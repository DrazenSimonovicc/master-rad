import { RichTextEditor } from "@/Components/Texts/TextEditorWithLabel/TextEditor/TextEditor";
import React, { FC } from "react";

import styles from "./TextEditorWithLabel.module.scss";

interface TextEditorWithLabelProps {
  index?: number;
  task: string;
  onChange: (value: string) => void;
  label: string;
}

const TextEditorWithLabel: FC<TextEditorWithLabelProps> = ({
  index,
  task,
  onChange,
  label,
}) => {
  return (
    <div key={index} className={styles.textEditorWrapper}>
      <span className={styles.label}>{label}</span>
      <RichTextEditor content={task} onChange={onChange} />
    </div>
  );
};

export default TextEditorWithLabel;
