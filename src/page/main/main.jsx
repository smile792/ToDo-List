import { Button, Checkbox, Input, Loader } from "@mantine/core";
import { useContext, useState, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { Context } from "../../main";
import { useAuthState } from "react-firebase-hooks/auth";

export const Main = () => {
  const { auth, firestore } = useContext(Context);
  const [user, userLoading] = useAuthState(auth);
  const [text, setText] = useState("");

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

  const [tasks, loading, error] = useCollectionData(
    tasksRef.withConverter(tasksConverter)
  );

  const sendTask = async () => {
    if (!text.trim() || !user) return;
    try {
      await addDoc(tasksRef, {
        task: text,
        taskId: user.uid,
        createdAt: new Date(),
      });
      setText("");
    } catch (err) {
      console.error("Ошибка при добавлении задачи:", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const taskDoc = doc(firestore, "tasks", taskId);
      await deleteDoc(taskDoc);
    } catch (err) {
      console.error("Ошибка при удалении задачи:", err);
    }
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
            key={t.id}
            style={{
              color: "white",
              display: "flex",
              gap: "20px",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Checkbox label={t.task} />
            <Button size="xs" color="red" onClick={() => deleteTask(t.id)}>
              Удалить
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
