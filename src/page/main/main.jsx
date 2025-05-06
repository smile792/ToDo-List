import { Button, Checkbox, Input, Loader } from "@mantine/core";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { v4 as uuidv4 } from "uuid";

import Trash from "../../svg/trash.svg?react";

export const Main = () => {
  const [text, setText] = useState("");
  const [tasks, loading] = useCollectionData(collection(firestore, "tasks"), {
    idField: "id",
  });

  const sendTask = async () => {
    if (!text.trim()) return;
    await addDoc(collection(firestore, "tasks"), {
      task: text,
      taskId: uuidv4(),
      createdAt: new Date(),
    });
    setText("");
  };

  const deleteTask = async (taskId) => {
    const taskRef = doc(firestore, "tasks", taskId);
    await deleteDoc(taskRef);
  };

  if (loading) {
    return <Loader />;
  }

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
        {tasks?.map((t) => (
          <div
            key={t.taskId}
            style={{
              color: "white",
              display: "flex",
              gap: "20px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            <Checkbox label={t.task} />
            <button
              onClick={() => {
                deleteTask(t.taskId);
              }}
            >
              ok
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
