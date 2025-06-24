"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

import styles from "./TextEditor.module.scss";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  error?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  error,
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    injectCSS: false,
    immediatelyRender: false,
  });

  return (
    <div
      className={`${styles.editorWrapper} ${error ? styles.errorBorder : ""}`}
    >
      {editor && (
        <div className={styles.toolbar}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? styles.active : ""}
            title="Bold"
          >
            <FormatBoldIcon />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? styles.active : ""}
            title="Italic"
          >
            <FormatItalicIcon />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? styles.active : ""}
            title="Underline"
          >
            <FormatUnderlinedIcon />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? styles.active : ""}
            title="Strike"
          >
            <StrikethroughSIcon />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? styles.active : ""}
            title="Bullet List"
          >
            <FormatListBulletedIcon />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? styles.active : ""}
            title="Numbered List"
          >
            <FormatListNumberedIcon />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            <UndoIcon />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            <RedoIcon />
          </button>
        </div>
      )}
      <EditorContent editor={editor} className={styles.editorContent} />
    </div>
  );
};
