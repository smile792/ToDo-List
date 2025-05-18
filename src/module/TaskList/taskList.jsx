import Trash from "../../svg/trash.svg?react";
import Pencil from "../../svg/pencil.svg?react";
import { Modal, Button, TextInput, Select } from "@mantine/core";
import { MyCheckbox } from "../../UI/MyCheckbox/MyCheckbox";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";

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
    firestore,
  } = props;
  const [opened, { open, close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [archivedTask, setArchivedTask] = useState("false");
  const handlePriorityChange = async (taskId, value) => {
    const taskDoc = doc(firestore, "tasks", taskId);
    await updateDoc(taskDoc, { priority: value });
  };
  const handleSetTask = async () => {};
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "1":
        return "priority-low";
      case "2":
        return "priority-medium";
      case "3":
        return "priority-high";
      default:
        return "";
    }
  };
  return (
    <div className="tasks">
      {tasks
        ?.filter((key) => filtered.includes(key.task))
        .map((t) => (
          <div className={`task-wrapper`} key={t.id}>
            <div className={`task-item ${getPriorityClass(t.priority)}`}>
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
            <Select
              placeholder="Уровень важности"
              w={"150px"}
              value={t.priority || ""}
              onChange={(value) => handlePriorityChange(t.id, value)}
              data={[
                { value: "1", label: "Низкий" },
                { value: "2", label: "Средний" },
                { value: "3", label: "Высокий" },
              ]}
            />
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
