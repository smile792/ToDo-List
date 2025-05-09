import { Button, Input, Loader, Modal } from "@mantine/core";
import { useContext, useState, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Context } from "../../main";
import { useAuthState } from "react-firebase-hooks/auth";
import { MyCheckbox } from "../../UI/MyCheckbox/MyCheckbox";
import Trash from "../../svg/trash.svg?react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { useDisclosure } from "@mantine/hooks";

export const Main = () => {
  const { auth, firestore } = useContext(Context);
  const [user, userLoading] = useAuthState(auth);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const tasksRef = useMemo(() => collection(firestore, "tasks"), [firestore]);
  const [opened, { open, close }] = useDisclosure(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const tasksConverter = useMemo(
    () => ({
      toFirestore: (data) => data,
      fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return { ...data, id: snapshot.id };
      },
    }),
    []
  );

  const tasksQuery = useMemo(
    () => query(tasksRef.withConverter(tasksConverter), orderBy("createdAt")),
    [tasksRef]
  );

  const [tasks, loading] = useCollectionData(tasksQuery);

  const sendTask = async () => {
    if (!text.trim() || !user) return;
    try {
      await addDoc(tasksRef, {
        task: text,
        checked: false,
        createdAt: new Date(),
      });
      setText("");
    } catch (err) {
      setError("Ошибка при добавлении задачи:", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const taskDoc = doc(firestore, "tasks", taskId);
      await deleteDoc(taskDoc);
    } catch (err) {
      setError("Ошибка при удалении задачи:", err);
    }
  };

  const handleCheckboxChange = async (taskId, checked) => {
    try {
      const taskDoc = doc(firestore, "tasks", taskId);
      await updateDoc(taskDoc, { checked: checked });
    } catch (err) {
      setError("Ошибка при обновлении состояния чекбокса:", err);
    }
  };

  const handleDeleteClick = async () => {
    if (!taskToDelete) return;
    await deleteTask(taskToDelete);
    setTaskToDelete(null);
    close();
  };

  if (loading || userLoading) return <Loader />;
  return (
    <div className="main">
      <div className="main-menu">
        <Input
          placeholder="Напиши свою задачу"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button variant="filled" size="xs" onClick={sendTask}>
          Добавить задачу
        </Button>
      </div>
      <div className="tasks">
        {tasks.map((t) => (
          <div
            className={t.checked ? "task-item-true" : "task-item"}
            key={t.id}
          >
            <div className="task-text">
              <MyCheckbox
                checked={t.checked || false}
                onChange={(e) =>
                  handleCheckboxChange(t.id, e.currentTarget.checked)
                }
                label={<span className="task-label">{t.task}</span>}
              />
            </div>
            <span
              className="task-icon"
              onClick={() => {
                setTaskToDelete(t.id);
                open();
              }}
            >
              <Trash />
            </span>
            <Modal
              opened={opened}
              onClose={() => {
                setTaskToDelete(null);
                close();
              }}
              title="Вы точно хотите удалить заметку?"
              centered
              overlayProps={{
                bg: "transparent",
              }}
            >
              <div className="modal-btn">
                <Button onClick={close}>Отмена</Button>
                <Button
                  variant="filled"
                  color="red"
                  onClick={handleDeleteClick}
                >
                  Удалить
                </Button>
              </div>
            </Modal>
          </div>
        ))}
        <div>{error}</div>
      </div>
    </div>
  );
};
