export function formatarData(dataStr) {
  if (!dataStr) return "";
  const data = new Date(dataStr);
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(data);
}
