"use client";
import React, { FC, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import clsx from "clsx";
import styles from "./TextInput.module.scss";

interface TextInputProps {
  label?: string;
  type: "text" | "password";
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const TextInput: FC<TextInputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={clsx(styles.inputWrapper, { [styles.error]: !!error })}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputContainer}>
        <input
          type={type === "password" && !showPassword ? "password" : "text"}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={clsx(styles.input, { [styles.error]: !!error })}
        />
        {type === "password" && (
          <div
            onClick={handleTogglePasswordVisibility}
            className={clsx(styles.visibilityIcon, {
              [styles.iconVisible]: showPassword,
            })}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </div>
        )}
      </div>
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
};

export default TextInput;
