import Trash from "../../svg/trash.svg?react";
import Pencil from "../../svg/pencil.svg?react";
import { Modal, Button, TextInput } from "@mantine/core";
import { MyCheckbox } from "../../UI/MyCheckbox/MyCheckbox";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

export const TaskList = (props) => {
  const {
    tasks,
    filtered,
    handleCheckboxChange,
    handleDeleteTaskClick,
    setTaskToDelete,
    setEditTaskId,
    handleEditTask,
    editTaskText,
    setEditTaskText,
  } = props;
  const [opened, { open, close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [archivedTask, setArchivedTask] = useState("false");
  return (
    <div className="tasks">
      {tasks
        ?.filter((key) => filtered.includes(key.task))
        .map((t) => (
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
            <div className="task-icon">
              <span
                className="task-icon-pencil"
                title="Редактировать"
                onClick={async () => {
                  await setEditTaskId(t.id);
                  setEditTaskText(t.task);
                  openEdit();
                }}
              >
                <Pencil />
              </span>
              <span
                title="Удалить"
                className="task-icon-trash"
                onClick={() => {
                  setTaskToDelete(t.id);
                  open();
                }}
              >
                <Trash />
              </span>
            </div>
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
      <Modal
        opened={openedEdit}
        onClose={closeEdit}
        title="Редактировать задачу"
        overlayProps={{
          bg: "transparent",
        }}
      >
        <TextInput
          value={editTaskText}
          onChange={(e) => setEditTaskText(e.currentTarget.value)}
        />
        <div className="modal-btn edit">
          <Button onClick={closeEdit}>Отмена</Button>
          <Button
            color="green"
            onClick={() => {
              handleEditTask();
              closeEdit();
            }}
          >
            Подтвердить
          </Button>
        </div>
      </Modal>
    </div>
  );
};
