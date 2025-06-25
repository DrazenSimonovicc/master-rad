import { useCallback } from "react";

type TaskType =
  | "test"
  | "homework"
  | "lesson"
  | "operative"
  | "global"
  | string;

interface UseDownloadTasksParams {
  plan: Record<string, any>;
  type?: TaskType;
}

export const useDownloadTasks = ({ plan, type }: UseDownloadTasksParams) => {
  const downloadAllTasks = useCallback(() => {
    let allTasksHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><title>Zadaci</title></head><body>
  `;

    for (let i = 1; i <= 10; i++) {
      const task = plan[`task${i}`];
      if (task && task.trim() !== "") {
        allTasksHtml += `<p><b>Zadatak ${i}:</b><br/>${task}</p>`;
      }
    }

    allTasksHtml += `</body></html>`;

    if (
      allTasksHtml.trim() ===
      `<html xmlns:o='urn:schemas-microsoft-com:office:office'
             xmlns:w='urn:schemas-microsoft-com:office:word'
             xmlns='http://www.w3.org/TR/REC-html40'>
       <head><title>Zadaci</title></head><body></body></html>`
    ) {
      alert("Nema zadataka za preuzimanje.");
      return;
    }

    const blob = new Blob([allTasksHtml], {
      type: "application/msword",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const sanitizeFilename = (name: string) =>
      name.replace(/[\/\\:\*\?"<>\|]/g, "").trim();

    const unitTitle = plan.teaching_unit?.trim();
    const safeTitle = sanitizeFilename(unitTitle || "zadaci");

    const typeToTitlePrefix: Record<string, string> = {
      test: "Test",
      homework: "Domaći zadatak",
      lesson: "Priprema za čas",
      operative: "Operativni plan",
      global: "Globalni plan",
    };

    const titlePrefix = typeToTitlePrefix[type || ""] || "Zadatak";

    link.download = `${titlePrefix} - ${safeTitle}.doc`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [plan, type]);

  return { downloadAllTasks };
};
