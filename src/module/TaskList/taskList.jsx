import { Modal, Button } from "@mantine/core";
import Trash from "../../svg/trash.svg?react";
import { MyCheckbox } from "../../UI/MyCheckbox/MyCheckbox";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

export const TaskList = ({
  tasks,
  handleCheckboxChange,
  handleDeleteTaskClick,
  setTaskToDelete,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [archivedTask, setArchivedTask] = useState("false");
  return (
    <div className="tasks">
      {tasks?.map((t) => (
        <div
          className={`task-item ${archivedTask === t.id ? "archiving" : ""}`}
          key={t.id}
        >
          <MyCheckbox
            checked={t.checked}
            onChange={async (e) => {
              setArchivedTask(t.id);
              await handleCheckboxChange(t.id, e.currentTarget.checked);
              setArchivedTask("");
            }}
            label={t.task}
          />
          <span
            className="task-icon"
            onClick={() => {
              setTaskToDelete(t.id);
              open();
            }}
          >
            <Trash />
          </span>
        </div>
      ))}

      <Modal
        opened={opened}
        onClose={close}
        title="Вы точно хотите удалить задачу?"
        overlayProps={{
          bg: "transparent",
        }}
      >
        <div className="modal-btn">
          <Button onClick={close}>Отмена</Button>
          <Button
            color="red"
            onClick={() => {
              handleDeleteTaskClick();
              close();
            }}
          >
            Удалить
          </Button>
        </div>
      </Modal>
    </div>
  );
};
