import { deleteDoc, doc } from "firebase/firestore";

export const DeleteTask = async (firestore, store, taskId) => {
  try {
    const taskDoc = doc(firestore, store, taskId);
    await deleteDoc(taskDoc);
  } catch (err) {
    console.log(`Ошибка при удалении задачи: ${err.message}`);
  }
};
