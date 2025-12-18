import { useCallback } from "react";
import { LessonPlanType } from "@/Interfaces/BaseType";
import { LessonConfig } from "@/app/resursi-za-nastavu/priprema-za-nastavu/config";

interface UseDownloadLessonPlanParams {
  lesson: LessonPlanType;
}

export const useDownloadLessonPlan = ({
  lesson,
}: UseDownloadLessonPlanParams) => {
  const lessonGroups: {
    title: string;
    fields: (keyof LessonPlanType)[];
  }[] = [
    {
      title: "Opšti podaci",
      fields: ["date", "classNumber", "gradeAndClass"],
    },
    {
      title: "Opšti metodički podaci",
      fields: [
        "subject",
        "teachingTopic",
        "lessonName",
        "previousLesson",
        "nextLesson",
        "typeOfLesson",
      ],
    },
    {
      title: "Operativni zadaci",
      fields: [
        "educationalObjectives",
        "socialObjectives",
        "functionalObjectives",
        "teachingMethods",
        "formsOfWork",
        "instructionalMaterials",
        "correlation",
        "literature",
      ],
    },
    {
      title: "Struktura časa",
      fields: ["introductionSmall", "mainActivitySmall", "conclusionSmall"],
    },
    {
      title: "Razrada toka časa",
      fields: ["introduction", "main", "conclusion"],
    },
  ];

  const downloadLessonPlan = useCallback(() => {
    type LessonField = keyof typeof LessonConfig;

    let htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office'
            xmlns:w='urn:schemas-microsoft-com:office:word'
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Priprema za čas</title></head><body style="font-family:Calibri, sans-serif; font-size:11pt;">
    `;

    lessonGroups.forEach(({ title, fields }) => {
      htmlContent += `<h2 style="color:#2F5496;">${title}</h2>`;
      fields.forEach((field) => {
        const label = LessonConfig[field as LessonField]?.label || field;
        const value = lesson[field] || "-";
        const safeValue = typeof value === "string" ? value : "";
        htmlContent += `<p><strong>${label}:</strong><br/>${safeValue}</p>`;
      });
      htmlContent += `<hr style="border:none; border-top:1px solid #ccc; margin:15px 0;">`;
    });

    htmlContent += `</body></html>`;

    const contentWithoutTags = htmlContent.replace(/<[^>]+>/g, "").trim();
    if (!contentWithoutTags) {
      alert("Nema podataka za preuzimanje.");
      return;
    }

    const blob = new Blob([htmlContent], {
      type: "application/msword",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const sanitizeFilename = (name: string) =>
      name.replace(/[\/\\:\*\?"<>\|]/g, "").trim();

    const title = sanitizeFilename(lesson.lessonName || "Plan časa");
    link.download = `Priprema za čas - ${title}.doc`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [lesson]);

  return { downloadLessonPlan };
};
