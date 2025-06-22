export function NormalizeSongTitle(title) {
    return title
      .toUpperCase()
      .replace(/[^\w\s]|_/g, "")
      .replace(/\s+/g, " ")
      .trim();
}