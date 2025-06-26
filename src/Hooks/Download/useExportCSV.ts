"use client";

export function useExportCSV() {
  const downloadCSV = (
    type: "operative" | "global",
    operativePlans: any[],
    globalPlans: any[],
    filenamePrefix: string = "",
  ) => {
    let csvContent = "\uFEFF";

    if (type === "operative") {
      const headers = [
        "Red. br.",
        "Nastavna tema",
        "Naslov nastavne jedinice",
        "Tip časa",
        "Modeli nastavnog rada",
        "Oblici rada",
        "Metode rada",
        "Nastavna sredstva",
        "Nastavni objekti",
        "Korelacija",
        "Literatura",
        "Beleške",
      ];

      const rows = operativePlans.map((plan) => [
        plan.lesson_number,
        plan.teaching_topic,
        plan.lesson_title,
        plan.type_of_lesson,
        plan.teaching_methods,
        plan.forms_of_work,
        plan.teaching_techniques,
        plan.instructional_materials,
        plan.educational_objects,
        plan.correlation,
        plan.literature,
        plan.notes,
      ]);

      csvContent += headers.join(",") + "\n";
      rows.forEach((row) => {
        csvContent +=
          row
            .map((cell) => `"${(cell ?? "").toString().replace(/"/g, '""')}"`)
            .join(",") + "\n";
      });
    }

    if (type === "global") {
      const headers = [
        "Naziv nastavne teme",
        "Zadaci nastavne teme",
        "Mesec",
        "Obrada",
        "Utvrdjivanje",
        "Provera",
        "Ukupan broj časova",
      ];

      const rows = globalPlans.map((plan) => [
        plan.class_theme,
        plan.learning_objectives,
        plan.month,
        plan.processing_class,
        plan.evaluation_class,
        plan.review_class,
        plan.review_class + plan.processing_class + plan.evaluation_class,
      ]);

      csvContent += headers.join(",") + "\n";
      rows.forEach((row) => {
        csvContent +=
          row
            .map((cell) => `"${(cell ?? "").toString().replace(/"/g, '""')}"`)
            .join(",") + "\n";
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `${filenamePrefix}${type === "operative" ? "operativni-plan.csv" : "globalni-plan.csv"}`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { downloadCSV };
}
