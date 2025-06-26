import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import styles from "./SearchInput.module.scss";

interface SearchToggleInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
}

const SearchToggleInput: React.FC<SearchToggleInputProps> = ({
  placeholder = "Pretraži...",
  value,
  onChange,
  onSearch,
}) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={styles.container}>
      {!open && (
        <button
          type="button"
          aria-label="Otvori pretragu"
          onClick={() => setOpen(true)}
          className={styles.iconButton}
        >
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            fill="none"
            stroke="#ff7a00"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      )}

      <div
        className={`${styles.inputWrapper} ${open ? styles.open : ""}`}
        aria-hidden={!open}
      >
        <svg
          aria-hidden="true"
          className={styles.icon}
          width="20"
          height="20"
          fill="none"
          stroke="#ff7a00"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="text"
          aria-label="Pretraga"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          className={styles.input}
        />

        <button
          type="button"
          aria-label="Zatvori pretragu"
          onClick={() => {
            if (value !== "") {
              onChange({
                target: { value: "" },
              } as React.ChangeEvent<HTMLInputElement>);
            } else {
              setOpen(false);
            }
          }}
          className={styles.closeButton}
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#999"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchToggleInput;
