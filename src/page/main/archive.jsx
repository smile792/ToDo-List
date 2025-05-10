import { useDisclosure } from "@mantine/hooks";
import { MyCheckbox } from "../../UI/MyCheckbox/MyCheckbox";
import Trash from "../../svg/trash.svg?react";
import { Button, Modal } from "@mantine/core";

export const Archive = ({
  archivedTasks,
  handleCheckboxChange,
  handleDeleteArchiveClick,
  setTaskToDelete,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="tasks">
      {archivedTasks?.map((t) => (
        <div className="task-item-true" key={t.id}>
          <MyCheckbox
            checked={t.checked || false}
            onChange={(e) =>
              handleCheckboxChange(t.id, e.currentTarget.checked)
            }
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
