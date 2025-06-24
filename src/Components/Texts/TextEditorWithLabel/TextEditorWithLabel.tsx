import { RichTextEditor } from "@/Components/Texts/TextEditorWithLabel/TextEditor/TextEditor";
import React, { FC } from "react";

import styles from "./TextEditorWithLabel.module.scss";

interface TextEditorWithLabelProps {
  index?: number;
  task: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
}

const TextEditorWithLabel: FC<TextEditorWithLabelProps> = ({
  index,
  task,
  onChange,
  label,
  error,
}) => {
  return (
    <div key={index} className={styles.textEditorWrapper}>
      <span className={styles.label}>{label}</span>
      <div>
        <RichTextEditor content={task} onChange={onChange} error={!!error} />
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
};

export default TextEditorWithLabel;
