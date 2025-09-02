export function parsedDate(data: string) {
  const date = new Date(data);
  const normalDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return normalDate;
}
