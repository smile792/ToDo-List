import { Tabs } from "@mantine/core";
import { TaskList } from "../TaskList/taskList";
import { Archive } from "../../page/main/archive";

export const MainTasks = (props) => {
  const {
    tasks,
    filtered,
    handleDeleteTaskClick,
    setTaskToDelete,
    setEditTaskId,
    editTaskText,
    setEditTaskText,
    handleEditTask,
    archivedTasks,
    handleCheckboxChange,
    handleDeleteArchiveClick,
    firestore,
  } = props;
  return (
    <Tabs defaultValue="active">
      <Tabs.List justify="center">
        <Tabs.Tab value="active">Активные задачи</Tabs.Tab>
        <Tabs.Tab value="archived">Архив</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="active">
        <TaskList
          tasks={tasks}
          filtered={filtered}
          firestore={firestore}
          handleCheckboxChange={handleCheckboxChange}
          handleDeleteTaskClick={handleDeleteTaskClick}
          setTaskToDelete={setTaskToDelete}
          setEditTaskId={setEditTaskId}
          editTaskText={editTaskText}
          setEditTaskText={setEditTaskText}
          handleEditTask={handleEditTask}
        />
      </Tabs.Panel>
      <Tabs.Panel value="archived">
        <Archive
          filtered={filtered}
          archivedTasks={archivedTasks}
          handleCheckboxChange={handleCheckboxChange}
          handleDeleteArchiveClick={handleDeleteArchiveClick}
          setTaskToDelete={setTaskToDelete}
        />
      </Tabs.Panel>
    </Tabs>
  );
};
