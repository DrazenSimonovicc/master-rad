import { FC } from "react";

interface FileUploaderProps {
  label: string;
  onFileChange: (file: File | null) => void;
}

export const FileUploader: FC<FileUploaderProps> = ({
  label,
  onFileChange,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    onFileChange(file);
  };

  return (
    <div>
      <label>{label}</label>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};
