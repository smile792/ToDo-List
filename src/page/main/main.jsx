import { Loader } from "@mantine/core";
import { useContext, useState, useMemo, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Context } from "../../main";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { MainMenu } from "../../module/MainMenu/mainMenu";
import { MainTasks } from "../../module/TabsMain/tabsMain";
import { useQuery, useTaskRef } from "../../hooks/hooks";
import { DeleteTask } from "../../utils/utils";

export const Main = () => {
  const { auth, firestore } = useContext(Context);
  const [user, userLoading] = useAuthState(auth);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [taskToDelete, setTaskToDelete] = useState("");
  const [editTaskId, setEditTaskId] = useState("");
  const [editTaskText, setEditTaskText] = useState("");
  const [filteredTask, setFilteredTask] = useState("");

  const handleFilterUpdate = useMemo(() => (filtered) => {
    setFilteredTask(filtered);
  });
  const tasksRef = useTaskRef(firestore, "tasks");
  const archivedTasksRef = useTaskRef(firestore, "archivedTasks");

  const tasksQuery = useQuery(auth, tasksRef, "createdAt");
  const archivedTasksQuery = useQuery(auth, archivedTasksRef, "archivedAt");

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

  const handleDeleteTaskClick = async () => {
    await DeleteTask(firestore, "tasks", taskToDelete);
    setTaskToDelete("");
  };

  const handleDeleteArchiveClick = async () => {
    await DeleteTask(firestore, "archivedTasks", taskToDelete);
    setTaskToDelete("");
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
  const allTasks = useMemo(() => {
    const active = (tasks || []).map((t) => t.task);
    const archived = (archivedTasks || []).map((t) => t.task);
    return [...active, ...archived];
  }, [tasks, archivedTasks]);

  if (!user || userLoading || loading || archivedLoading) return <Loader />;

  return (
    <div className="main">
      <MainMenu
        value={text}
        onChange={(e) => setText(e.target.value)}
        onClick={sendTask}
        allTasks={allTasks}
        onFiltered={handleFilterUpdate}
      />
      <MainTasks
        tasks={tasks}
        filtered={filteredTask}
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
