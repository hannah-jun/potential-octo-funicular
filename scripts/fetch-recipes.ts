import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const API_KEY = process.env.RECIPE_API_KEY;
if (!API_KEY) {
  throw new Error("RECIPE_API_KEY가 설정되어 있지 않습니다. .env.local을 확인하세요.");
}

const BASE_URL = "http://211.237.50.150:7080/openapi";
const RECIPE_GRID = "Grid_20150827000000000226_1";
const INGREDIENT_GRID = "Grid_20150827000000000227_1";
const STEP_GRID = "Grid_20150827000000000228_1";
const MAX_PAGE_SIZE = 1000;

const INGREDIENT_GROUP_ORDER = ["주재료", "부재료", "양념"];

interface RawRow {
  [tag: string]: string;
}

interface RecipeRow {
  RECIPE_ID: string;
  RECIPE_NM_KO: string;
  NATION_NM: string;
  TY_NM: string;
}

interface IngredientRow {
  RECIPE_ID: string;
  IRDNT_SN: string;
  IRDNT_NM: string;
  IRDNT_CPCTY: string;
  IRDNT_TY_NM: string;
}

interface StepRow {
  RECIPE_ID: string;
  COOKING_NO: string;
  COOKING_DC: string;
  STEP_TIP: string;
}

interface Ingredient {
  name: string;
  amount: string;
}

interface IngredientGroup {
  label: string;
  items: Ingredient[];
}

interface CookingStep {
  order: number;
  description: string;
  tip: string | null;
}

interface Recipe {
  id: string;
  title: string;
  cuisineType: string;
  dishType: string;
  ingredientGroups: IngredientGroup[];
  steps: CookingStep[];
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function parseRows(xml: string): RawRow[] {
  const rows: RawRow[] = [];
  for (const rowMatch of xml.matchAll(/<row>([\s\S]*?)<\/row>/g)) {
    const row: RawRow = {};
    for (const fieldMatch of rowMatch[1].matchAll(
      /<([A-Z_]+)>([\s\S]*?)<\/\1>/g
    )) {
      row[fieldMatch[1]] = decodeXmlEntities(fieldMatch[2].trim());
    }
    rows.push(row);
  }
  return rows;
}

async function fetchGrid(gridId: string): Promise<RawRow[]> {
  const probeXml = await fetchRange(gridId, 1, 1);
  const totalMatch = probeXml.match(/<totalCnt>(\d+)<\/totalCnt>/);
  if (!totalMatch) {
    throw new Error(`${gridId}: totalCnt를 찾을 수 없습니다.\n${probeXml}`);
  }
  const total = Number(totalMatch[1]);

  const rows: RawRow[] = [];
  for (let start = 1; start <= total; start += MAX_PAGE_SIZE) {
    const end = Math.min(start + MAX_PAGE_SIZE - 1, total);
    const xml = await fetchRange(gridId, start, end);
    rows.push(...parseRows(xml));
  }
  return rows;
}

async function fetchRange(
  gridId: string,
  start: number,
  end: number
): Promise<string> {
  const url = `${BASE_URL}/${API_KEY}/xml/${gridId}/${start}/${end}`;
  const response = await fetch(url);
  const xml = await response.text();
  const errorMatch = xml.match(/<code>(ERROR-\d+)<\/code>/);
  if (errorMatch) {
    const messageMatch = xml.match(/<message>([\s\S]*?)<\/message>/);
    throw new Error(
      `${gridId} [${start}-${end}] ${errorMatch[1]}: ${messageMatch?.[1] ?? "알 수 없는 오류"}`
    );
  }
  return xml;
}

function groupLabelRank(label: string): number {
  const index = INGREDIENT_GROUP_ORDER.indexOf(label);
  return index === -1 ? INGREDIENT_GROUP_ORDER.length : index;
}

async function main() {
  console.log("레시피 마스터 데이터 수집 중...");
  const recipeRows = (await fetchGrid(RECIPE_GRID)) as unknown as RecipeRow[];
  console.log(`  ${recipeRows.length}건 수집`);

  console.log("재료 데이터 수집 중...");
  const ingredientRows = (await fetchGrid(
    INGREDIENT_GRID
  )) as unknown as IngredientRow[];
  console.log(`  ${ingredientRows.length}건 수집`);

  console.log("조리 순서 데이터 수집 중...");
  const stepRows = (await fetchGrid(STEP_GRID)) as unknown as StepRow[];
  console.log(`  ${stepRows.length}건 수집`);

  const ingredientsByRecipeId = new Map<string, IngredientRow[]>();
  for (const row of ingredientRows) {
    const list = ingredientsByRecipeId.get(row.RECIPE_ID) ?? [];
    list.push(row);
    ingredientsByRecipeId.set(row.RECIPE_ID, list);
  }

  const stepsByRecipeId = new Map<string, StepRow[]>();
  for (const row of stepRows) {
    const list = stepsByRecipeId.get(row.RECIPE_ID) ?? [];
    list.push(row);
    stepsByRecipeId.set(row.RECIPE_ID, list);
  }

  const recipes: Recipe[] = [];
  let skippedNoIngredients = 0;

  for (const recipeRow of recipeRows) {
    const ingredientRowsForRecipe = ingredientsByRecipeId.get(
      recipeRow.RECIPE_ID
    );
    if (!ingredientRowsForRecipe || ingredientRowsForRecipe.length === 0) {
      skippedNoIngredients += 1;
      continue;
    }

    const sorted = [...ingredientRowsForRecipe].sort(
      (a, b) => Number(a.IRDNT_SN) - Number(b.IRDNT_SN)
    );

    const groups = new Map<string, Ingredient[]>();
    for (const ingredientRow of sorted) {
      const label = ingredientRow.IRDNT_TY_NM;
      const items = groups.get(label) ?? [];
      items.push({
        name: ingredientRow.IRDNT_NM,
        amount: ingredientRow.IRDNT_CPCTY,
      });
      groups.set(label, items);
    }

    const ingredientGroups = [...groups.entries()]
      .sort((a, b) => groupLabelRank(a[0]) - groupLabelRank(b[0]))
      .map(([label, items]) => ({ label, items }));

    const steps = (stepsByRecipeId.get(recipeRow.RECIPE_ID) ?? [])
      .slice()
      .sort((a, b) => Number(a.COOKING_NO) - Number(b.COOKING_NO))
      .map((stepRow) => ({
        order: Number(stepRow.COOKING_NO),
        description: stepRow.COOKING_DC,
        tip: stepRow.STEP_TIP ? stepRow.STEP_TIP : null,
      }));

    recipes.push({
      id: recipeRow.RECIPE_ID,
      title: recipeRow.RECIPE_NM_KO,
      cuisineType: recipeRow.NATION_NM,
      dishType: recipeRow.TY_NM,
      ingredientGroups,
      steps,
    });
  }

  const outputPath = join(process.cwd(), "data", "recipes.json");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(recipes, null, 2) + "\n", "utf-8");

  console.log(
    `완료: ${recipes.length}개 레시피를 ${outputPath}에 저장했습니다. (재료 없어서 제외: ${skippedNoIngredients}건)`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
