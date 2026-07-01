"use client";

import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { viVN } from "@mui/x-date-pickers/locales";
import "dayjs/locale/vi";

dayjs.locale("vi");

interface DateTimePickerFieldProps {
  value?: string | null;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export function DateTimePickerField({
  value,
  onChange,
  label,
  disabled = false,
}: DateTimePickerFieldProps) {
  const handleChange = (newValue: Dayjs | null) => {
    onChange(
      newValue ? newValue.toDate().toISOString() : new Date().toISOString(),
    );
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="vi"
      localeText={
        viVN.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <DateTimePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={handleChange}
        maxDate={dayjs().endOf("day")}
        disabled={disabled}
        views={["year", "month", "day", "hours", "minutes"]}
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
          },
        }}
      />
    </LocalizationProvider>
  );
}
