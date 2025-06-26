import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import clsx from "clsx";
import styles from "./DatePicker.module.scss";

interface DatePickerFieldProps {
  value: string;
  onChange: (newValue: Dayjs | null) => void;
  label: string;
  className?: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
  label,
  className,
}) => {
  return (
    <div className={clsx(styles.datePickerWrap, className)}>
      <span className={styles.label}>{label}</span>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            value={value ? dayjs(value) : null}
            onChange={onChange}
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
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};

export default DatePickerField;
