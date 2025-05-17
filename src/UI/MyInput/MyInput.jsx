import { Input } from "@mantine/core";
import classes from "./MyInput.module.css";
export const MyInput = ({ placeholder, value, onChange }) => {
  return (
    <Input
      classNames={{
        input: classes.input,
      }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};
