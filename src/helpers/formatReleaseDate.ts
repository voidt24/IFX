export default function formatReleaseDate(date: string) {
  const formatedDate = new Date(date);
  if (formatedDate.getTime() > Date.now())
    return `${formatedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })}`;

  return date?.slice(0, 4);
}
