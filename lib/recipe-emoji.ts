const EMOJI_BY_DISH_TYPE: Record<string, string> = {
  밥: "🍚",
  "나물/생채/샐러드": "🥗",
  "만두/면류": "🥟",
  "밑반찬/김치": "🥬",
  국: "🥣",
  볶음: "🍳",
  "찌개/전골/스튜": "🍲",
  구이: "🍖",
  찜: "🥘",
  부침: "🥞",
  "튀김/커틀릿": "🍤",
  조림: "🍢",
  "도시락/간식": "🍱",
  "떡/한과": "🍡",
  양념장: "🧂",
  "빵/과자": "🍞",
  양식: "🍽️",
  음료: "🥤",
  "그라탕/리조또": "🍝",
  "샌드위치/햄버거": "🍔",
  피자: "🍕",
};

const DEFAULT_EMOJI = "🍽️";

export function getRecipeEmoji(dishType: string): string {
  return EMOJI_BY_DISH_TYPE[dishType] ?? DEFAULT_EMOJI;
}
