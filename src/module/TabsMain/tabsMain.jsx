import { Tabs } from "@mantine/core";
import { TaskList } from "../TaskList/taskList";
import { Archive } from "../../page/main/archive";

export const MainTasks = ({
  tasks,
  handleDeleteTaskClick,
  setTaskToDelete,
  setEditTaskId,
  editTaskText,
  setEditTaskText,
  handleEditTask,
  archivedTasks,
  handleCheckboxChange,
  handleDeleteArchiveClick,
}) => {
  return (
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
          setEditTaskId={setEditTaskId}
          editTaskText={editTaskText}
          setEditTaskText={setEditTaskText}
          handleEditTask={handleEditTask}
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
  );
};
