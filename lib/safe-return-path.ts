const controlCharacters = /[\u0000-\u001F\u007F]/u;

export function parseSafeReturnPath(value: unknown, fallback = "/") {
  if (typeof value !== "string") return fallback;

  const path = value.trim();
  const isSafe =
    path.length <= 2_048 &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("\\") &&
    !controlCharacters.test(path);

  return isSafe ? path : fallback;
}
