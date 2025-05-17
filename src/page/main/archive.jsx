import { useDisclosure } from "@mantine/hooks";
import { MyCheckbox } from "../../UI/MyCheckbox/MyCheckbox";
import Trash from "../../svg/trash.svg?react";
import { Button, Modal } from "@mantine/core";
import { useState } from "react";

export const Archive = ({
  filtered,
  archivedTasks,
  handleCheckboxChange,
  handleDeleteArchiveClick,
  setTaskToDelete,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [archivedTask, setArchivedTask] = useState("false");
  return (
    <div className="tasks">
      {archivedTasks
        ?.filter((key) => filtered.includes(key.task))
        .map((t) => (
          <div
            className={`task-item ${
              archivedTask === t.id ? "active" : "default"
            }`}
            key={t.id}
          >
            <MyCheckbox
              checked={t.checked || false}
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
        onClose={() => {
          setTaskToDelete(null);
          close();
        }}
        title="Вы точно хотите удалить задачу?"
        overlayProps={{
          bg: "transparent",
        }}
      >
        <div className="modal-btn">
          <Button onClick={close}>Отмена</Button>
          <Button
            variant="filled"
            color="red"
            onClick={() => {
              handleDeleteArchiveClick();
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
