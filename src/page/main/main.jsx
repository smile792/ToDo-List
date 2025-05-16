import { Loader } from "@mantine/core";
import { useContext, useState, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Context } from "../../main";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDoc,
  where,
  updateDoc,
} from "firebase/firestore";
import { MainMenu } from "../../module/MainMenu/mainMenu";
import { MainTasks } from "../../module/TabsMain/tabsMain";

export const Main = () => {
  const { auth, firestore } = useContext(Context);
  const [user, userLoading] = useAuthState(auth);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [taskToDelete, setTaskToDelete] = useState("");
  const [editTaskId, setEditTaskId] = useState("");
  const [editTaskText, setEditTaskText] = useState("");
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
      const fromCollection = checked ? "tasks" : "archivedTasks";
      const toCollection = checked ? "archivedTasks" : "tasks";

      const sourceDocRef = doc(firestore, fromCollection, taskId);
      const sourceSnapshot = await getDoc(sourceDocRef);

      const taskData = sourceSnapshot.data();

      const newTaskData = {
        ...taskData,
        checked,
        [checked ? "archivedAt" : "createdAt"]: new Date(),
      };
      const toCollectionRef = collection(firestore, toCollection);
      await addDoc(toCollectionRef, newTaskData);

      await deleteDoc(sourceDocRef);
    } catch (err) {
      setError(`Ошибка при обновлении задачи: ${err.message}`);
    }
  };

  const handleDeleteTaskClick = async () => {
    await deleteTask(taskToDelete);
    setTaskToDelete("");
  };

  const handleDeleteArchiveClick = async () => {
    await deleteArchivedTask(taskToDelete);
    setTaskToDelete("");
  };

  const editTask = async (taskId, newTask) => {
    try {
      const editTaskRef = doc(firestore, "tasks", taskId);
      await updateDoc(editTaskRef, { task: newTask });
    } catch (err) {
      console.log(err);
      setError(`Ошибка при обновлении задачи: ${err.message}`);
    }
  };
  const handleEditTask = async () => {
    await editTask(editTaskId, editTaskText);
    setEditTaskId("");
    setEditTaskText("");
  };
  if (!user || userLoading || loading || archivedLoading) return <Loader />;

  return (
    <div className="main">
      <MainMenu
        value={text}
        onChange={(e) => setText(e.target.value)}
        onClick={sendTask}
      />
      <MainTasks
        tasks={tasks}
        handleCheckboxChange={handleCheckboxChange}
        handleDeleteTaskClick={handleDeleteTaskClick}
        setTaskToDelete={setTaskToDelete}
        setEditTaskId={setEditTaskId}
        editTaskText={editTaskText}
        setEditTaskText={setEditTaskText}
        handleEditTask={handleEditTask}
        archivedTasks={archivedTasks}
        handleDeleteArchiveClick={handleDeleteArchiveClick}
      />
      <div>{error}</div>
    </div>
  );
};
