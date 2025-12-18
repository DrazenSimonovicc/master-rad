export const useFormattedSerbianDate = (isoDateString: string) => {
  if (!isoDateString) return "";

  const date = new Date(isoDateString);

  const datePart = new Intl.DateTimeFormat("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("sr-RS", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);

  return `${datePart} u ${timePart}`;
};
