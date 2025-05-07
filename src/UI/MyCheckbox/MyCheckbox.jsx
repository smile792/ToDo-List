import { Checkbox } from "@mantine/core";
import classes from "./MyCheckbox.module.css";
export const MyCheckbox = ({ checked, onChange, label }) => {
  return (
    <Checkbox
      classNames={{
        body: classes.body,
        label: classes.label,
      }}
      checked={checked}
      onChange={onChange}
      label={label}
    />
  );
};
