import { Button, Input, Loader } from "@mantine/core";
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

export const Main = () => {
  const { auth, firestore } = useContext(Context);
  const [user, userLoading] = useAuthState(auth);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const tasksRef = useMemo(() => collection(firestore, "tasks"), [firestore]);

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

  const handleDeleteClick = (taskId, e) => {
    e.stopPropagation();
    deleteTask(taskId);
  };

  if (loading || userLoading) return <Loader />;
  if (error) return <div>Ошибка загрузки задач: {error.message}</div>;

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
                label={t.task}
              />
            </div>
            <span
              className="task-icon"
              onClick={(e) => handleDeleteClick(t.id, e)}
            >
              <Trash />
            </span>
          </div>
        ))}
        <div>{error}</div>
      </div>
    </div>
  );
};
