import { ActivityType } from "@/Interfaces/BaseType";

export const useDownloadActivity = () => {
  const downloadActivity = (activity: ActivityType) => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Export HTML to Word</title></head>
        <body>
          <h2>${activity.title}</h2>
          <p><strong>Tip aktivnosti:</strong> ${activity.type_of_activity}</p>
          <p><strong>Datum:</strong> ${activity.date}</p>
          <p><strong>Mesto:</strong> ${activity.place}</p>
          <div>${activity.description}</div>
        </body>
      </html>
    `;

    const blob = new Blob(["\ufeff", htmlContent], {
      type: "application/msword",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activity.title.replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return { downloadActivity };
};
