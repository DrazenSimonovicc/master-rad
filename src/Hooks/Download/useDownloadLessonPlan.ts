import { useCallback } from "react";
import { LessonConfig } from "@/app/resursi-za-nastavu/priprema-za-nastavu/config";
import { LessonPlanType } from "@/Interfaces/BaseType";

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
      fields: ["date", "class_number", "grade_and_class"],
    },
    {
      title: "Opšti metodički podaci",
      fields: [
        "subject",
        "teaching_topic",
        "lesson_name",
        "previous_lesson",
        "next_lesson",
        "type_of_lesson",
      ],
    },
    {
      title: "Operativni zadaci",
      fields: [
        "educational_objectives",
        "social_objectives",
        "functional_objectives",
        "teaching_methods",
        "forms_of_work",
        "instructional_materials",
        "correlation",
        "literature",
      ],
    },
    {
      title: "Struktura časa",
      fields: ["introduction_small", "main_activity_small", "conclusion_small"],
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

    // Check if empty (no meaningful content)
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

    const title = sanitizeFilename(lesson.lesson_name || "Plan časa");
    link.download = `Priprema za čas - ${title}.doc`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [lesson]);

  return { downloadLessonPlan };
};
