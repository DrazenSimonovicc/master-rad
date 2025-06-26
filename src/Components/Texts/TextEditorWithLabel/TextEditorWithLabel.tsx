import React, { FC } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { RichTextEditor } from "@/Components/Texts/TextEditorWithLabel/TextEditor/TextEditor";
import styles from "./TextEditorWithLabel.module.scss";

interface TextEditorWithLabelProps {
  index?: number;
  task: string;
  onChange: (value: string) => void;
  onDelete?: () => void;
  onAdd?: () => void;
  canDelete?: boolean;
  label: string;
  error?: string;
}

const TextEditorWithLabel: FC<TextEditorWithLabelProps> = ({
  index,
  task,
  onChange,
  onDelete,
  onAdd,
  canDelete = true,
  label,
  error,
}) => {
  return (
    <div key={index} className={styles.textEditorWithDelete}>
      <div className={styles.labelAndDelete}>
        <label className={styles.label}>{label}</label>
        <div className={styles.iconRow}>
          {onAdd && (
            <AddIcon
              onClick={onAdd}
              className={`${styles.icon} ${styles.add}`}
            />
          )}
          {onDelete && canDelete && (
            <DeleteIcon
              onClick={onDelete}
              className={`${styles.icon} ${styles.delete}`}
            />
          )}
        </div>
      </div>

      <RichTextEditor content={task} onChange={onChange} error={!!error} />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default TextEditorWithLabel;
