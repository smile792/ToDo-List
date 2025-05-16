import { Button, Input } from "@mantine/core";

export const MainMenu = ({ value, onChange, onClick }) => {
  return (
    <div className="main-menu">
      <div className="main-menu-add">
        <Input
          placeholder="Напиши свою задачу"
          value={value}
          onChange={onChange}
        />
        <Button variant="filled" size="xs" onClick={onClick}>
          Добавить задачу
        </Button>
      </div>
      <Input placeholder="Поиск задачи" className="main-menu-search" />
    </div>
  );
};
