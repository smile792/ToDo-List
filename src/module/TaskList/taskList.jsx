import { Modal, Button } from "@mantine/core";
import Trash from "../../svg/trash.svg?react";
import { MyCheckbox } from "../../UI/MyCheckbox/MyCheckbox";

export const TaskList = ({
  tasks,
  handleCheckboxChange,
  handleDeleteTaskClick,
  setTaskToDelete,
  open,
  close,
  opened,
}) => {
  return (
    <div className="tasks">
      {tasks.map((t) => (
        <div className="task-item" key={t.id}>
          <MyCheckbox
            checked={t.checked}
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
        onClose={close}
        title="Вы точно хотите удалить задачу?"
        overlayProps={{
          bg: "transparent",
        }}
      >
        <div className="modal-btn">
          <Button onClick={close}>Отмена</Button>
          <Button color="red" onClick={handleDeleteTaskClick}>
            Удалить
          </Button>
        </div>
      </Modal>
    </div>
  );
};
