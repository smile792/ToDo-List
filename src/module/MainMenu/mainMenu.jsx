import { Button } from "@mantine/core";
import { MyInput } from "../../UI/MyInput/MyInput";
import { useEffect, useMemo, useState } from "react";

export const MainMenu = ({
  allTasks,
  value,
  onChange,
  onClick,
  onFiltered,
}) => {
  const [textSearch, setTextSearch] = useState("");
  const filteredTask = useMemo(() => {
    return allTasks.filter((task) =>
      task.toLowerCase().includes(textSearch?.trim().toLowerCase())
    );
  }, [allTasks, textSearch]);
  useEffect(() => {
    onFiltered(filteredTask);
  }, [filteredTask, allTasks]);
  return (
    <div className="main-menu">
      <div className="main-menu-add">
        <MyInput
          placeholder="Напиши свою задачу"
          value={value}
          onChange={onChange}
        />
        <Button variant="filled" size="xs" onClick={onClick}>
          Добавить задачу
        </Button>
      </div>
      <MyInput
        placeholder="Поиск задачи"
        value={textSearch}
        onChange={(e) => setTextSearch(e.target.value)}
      />
    </div>
  );
};
