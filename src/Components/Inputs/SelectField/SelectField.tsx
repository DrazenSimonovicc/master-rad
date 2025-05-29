import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import clsx from "clsx";
import styles from "./SelectField.module.scss";

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: string[];
  error?: boolean;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  error = false,
  className,
}) => {
  return (
    <div className={clsx(styles.selectFiled, className)}>
      <span className={styles.label}>{label}</span>
      <FormControl
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            border: "1px solid #49bbbd",
            borderRadius: "60px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiInputBase-input.MuiOutlinedInput-input": {
            paddingLeft: "32px",
          },
        }}
      >
        <Select value={value} onChange={onChange} error={error}>
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectField;
