import { RecipeBrowser } from "@/components/recipe-browser";
import { RECIPES } from "@/lib/recipes";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-background">
      <main className="flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl tracking-tight text-primary">
            오늘 저녁 뭐 먹지?
          </h1>
          <p className="text-sm text-muted-foreground">
            검색하거나 음식 종류·조리 방식을 골라서 오늘 메뉴를 정해보세요.
          </p>
        </div>
        <RecipeBrowser recipes={RECIPES} />
      </main>
    </div>
  );
}
