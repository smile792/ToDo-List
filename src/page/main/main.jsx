import { Button, Input, Loader, Tabs } from "@mantine/core";
import { useContext, useState, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Context } from "../../main";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  getDoc,
  where,
} from "firebase/firestore";
import { useDisclosure } from "@mantine/hooks";
import { TaskList } from "../../module/TaskList/taskList";
import { Archive } from "./archive";

export const Main = () => {
  const { auth, firestore } = useContext(Context);
  const [user, userLoading] = useAuthState(auth);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const tasksRef = useMemo(() => collection(firestore, "tasks"), [firestore]);
  const archivedTasksRef = useMemo(
    () => collection(firestore, "archivedTasks"),
    [firestore]
  );

  const tasksConverter = {
    toFirestore: (data) => data,
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return {
        id: snapshot.id,
        task: data.task || "",
        checked: data.checked || false,
        createdAt: data.createdAt || null,
        uid: data.uid || null,
        archivedAt: data.archivedAt || null,
      };
    },
  };

  const tasksQuery = useMemo(() => {
    if (!user) return null;
    return query(
      tasksRef.withConverter(tasksConverter),
      where("uid", "==", user.uid),
      orderBy("createdAt")
    );
  }, [tasksRef, user]);

  const archivedTasksQuery = useMemo(() => {
    if (!user) return null;
    return query(
      archivedTasksRef.withConverter(tasksConverter),
      where("uid", "==", user.uid),
      orderBy("archivedAt")
    );
  }, [archivedTasksRef, user]);

  const [tasks, loading] = useCollectionData(tasksQuery);
  const [archivedTasks, archivedLoading] =
    useCollectionData(archivedTasksQuery);

  const sendTask = async () => {
    if (!text.trim()) {
      setError("Задача не может быть пустой");
      return;
    }
    try {
      setText("");
      setError("");
      await addDoc(tasksRef, {
        task: text,
        checked: false,
        createdAt: new Date(),
        uid: user.uid,
      });
    } catch (err) {
      console.error("Ошибка добавления задачи:", err);
      setError(`Ошибка при добавлении задачи: ${err.message}`);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const taskDoc = doc(firestore, "tasks", taskId);
      await deleteDoc(taskDoc);
    } catch (err) {
      setError(`Ошибка при удалении задачи: ${err.message}`);
    }
  };

  const deleteArchivedTask = async (taskId) => {
    try {
      const taskDoc = doc(firestore, "archivedTasks", taskId);
      await deleteDoc(taskDoc);
    } catch (err) {
      setError(`Ошибка при удалении задачи: ${err.message}`);
    }
  };

  const handleCheckboxChange = async (taskId, checked) => {
    try {
      const taskDocRef = doc(firestore, "tasks", taskId);
      const taskSnapshot = await getDoc(taskDocRef);
      const taskData = taskSnapshot.data();

      if (checked) {
        const archivedRef = collection(firestore, "archivedTasks");
        await addDoc(archivedRef, {
          ...taskData,
          checked: true,
          archivedAt: new Date(),
        });
        await deleteDoc(taskDocRef);
      } else {
        const archivedTaskDocRef = doc(firestore, "archivedTasks", taskId);
        const archivedTaskSnapshot = await getDoc(archivedTaskDocRef);
        const archivedTaskData = archivedTaskSnapshot.data();
        if (archivedTaskSnapshot.exists()) {
          await addDoc(tasksRef, {
            ...archivedTaskData,
            checked: false,
            createdAt: new Date(),
          });
          await deleteDoc(archivedTaskDocRef);
        } else {
          await updateDoc(taskDocRef, { checked: false });
        }
      }
    } catch (err) {
      setError(`Ошибка при обновлении задачи: ${err.message}`);
    }
  };

  const handleDeleteTaskClick = async () => {
    if (!taskToDelete) return;
    await deleteTask(taskToDelete);
    setTaskToDelete(null);
    close();
  };

  const handleDeleteArchiveClick = async () => {
    if (!taskToDelete) return;
    await deleteArchivedTask(taskToDelete);
    setTaskToDelete(null);
  };

  if (!user || userLoading || loading || archivedLoading) return <Loader />;

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
      <Tabs defaultValue="active">
        <Tabs.List justify="center">
          <Tabs.Tab value="active">Активные задачи</Tabs.Tab>
          <Tabs.Tab value="archived">Архив</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="active">
          <TaskList
            tasks={tasks}
            handleCheckboxChange={handleCheckboxChange}
            handleDeleteTaskClick={handleDeleteTaskClick}
            setTaskToDelete={setTaskToDelete}
            open={open}
            close={close}
            opened={opened}
          />
        </Tabs.Panel>
        <Tabs.Panel value="archived">
          <Archive
            archivedTasks={archivedTasks}
            handleCheckboxChange={handleCheckboxChange}
            handleDeleteArchiveClick={handleDeleteArchiveClick}
            setTaskToDelete={setTaskToDelete}
          />
        </Tabs.Panel>
      </Tabs>
      <div>{error}</div>
    </div>
  );
};
