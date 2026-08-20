const COLOR_BY_CUISINE_TYPE: Record<string, string> = {
  한식: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200",
  서양: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-200",
  퓨전: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-200",
  중국: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200",
  일본: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-200",
  이탈리아:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200",
  동남아시아: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-200",
};

const DEFAULT_COLOR = "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200";

export function getCuisineColor(cuisineType: string): string {
  return COLOR_BY_CUISINE_TYPE[cuisineType] ?? DEFAULT_COLOR;
}
