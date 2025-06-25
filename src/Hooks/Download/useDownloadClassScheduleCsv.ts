import { useCallback } from "react";

type ClassScheduleItem = {
  dayName: string;
  subject: string | string[]; // accept both formats
};

const daysOrder = ["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak"];
const classTimes = [
  "08:00 - 08:45",
  "08:50 - 09:35",
  "09:40 - 10:25",
  "10:30 - 11:15",
  "11:20 - 12:05",
  "12:10 - 12:55",
  "13:00 - 13:45",
];

export const useDownloadClassScheduleCsv = (
  classSchedule: ClassScheduleItem[],
) => {
  const downloadCsv = useCallback(() => {
    const scheduleMap: Record<string, string[]> = {};

    for (const day of daysOrder) {
      const entry = classSchedule.find((item) => item.dayName === day);

      let subjects: string[] = [];

      if (typeof entry?.subject === "string") {
        subjects = entry.subject.split(",").map((s) => s.trim());
      } else if (Array.isArray(entry?.subject)) {
        subjects = entry.subject.map((s) => s.trim());
      }

      scheduleMap[day] = subjects;
    }

    const maxPeriods = Math.max(
      ...Object.values(scheduleMap).map((s) => s.length),
    );

    const headerRow = ["Čas br.", ...daysOrder, "Vreme"];
    const rows: string[][] = [headerRow];

    for (let i = 0; i < maxPeriods; i++) {
      const row: string[] = [`${i + 1}`];
      for (const day of daysOrder) {
        row.push(scheduleMap[day][i] || "");
      }
      row.push(classTimes[i] || "");
      rows.push(row);
    }

    const csvContent = rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "raspored_casova.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [classSchedule]);

  return { downloadCsv };
};
