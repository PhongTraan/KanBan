import React, { useState } from "react";
import { Grid, Divider } from "@mantine/core";
import Column from "./Column";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Task } from "../../../data/Task";
import Card from "./Card"; // Ensure this imports correctly
import TaskService from "../../../service/TaskService";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

const privateColumns = [
  {
    id: 1,
    title: "To Do List",
    status: "TO_DO_LIST",
    isPublic: false,
  },
  { id: 2, title: "In Progress", status: "IN_PROGRESS", isPublic: false },
  { id: 3, title: "Done", status: "DONE", isPublic: false },
  { id: 4, title: "Cancel", status: "CANCEL", isPublic: false },
];

const publicColumns = [
  {
    id: 5,
    title: "To List",
    status: "TO_DO_LIST",
    isPublic: true,
  },
  { id: 6, title: "In Progress", status: "IN_PROGRESS", isPublic: true },
  { id: 7, title: "Done", status: "DONE", isPublic: true },
  { id: 8, title: "Cancel", status: "CANCEL", isPublic: true },
];

function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const { mutate: moveTask } = TaskService.useMoveTask();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (over?.id !== active.id) {
      const oldColumnId = active.data.current?.sortable.index;
      const newColumnId = over?.data.current?.sortable.index;
      if (oldColumnId !== undefined && newColumnId !== undefined) {
        setTasks((tasks) => {
          const updatedTasks = arrayMove(tasks, oldColumnId, newColumnId);
          return updatedTasks;
        });
      }
      moveTask({
        token: localStorage.getItem("authToken") ?? "",
        taskActivity: {
          taskId: active.data?.current?.item?.id,
          overPosition: newColumnId,
          overStatus: over.data?.current?.sortable?.containerId,
        },
      });
    }
    setDraggedTask(null);
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 20,
      },
    })
  );

  return (
    <div>
      <div className="text-[20px] mb-7 border w-32 h-11 flex items-center justify-center bg-white font-bold rounded-md" >
        Your Task
      </div>

      <DndContext
        // onDragOver={(e) => console.log(e)}
        onDragEnd={handleDragEnd}
        onDragStart={(e) => setDraggedTask(e.active.data.current?.item ?? null)}
        sensors={sensors}
      >
        <Grid columns={12}>
          {privateColumns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              isPublic={column.isPublic}
              status={column.status}
            />
          ))}
        </Grid>
        <DragOverlay>
          {draggedTask ? <Card item={draggedTask} /> : null}{" "}
        </DragOverlay>
      </DndContext>
      <Divider my="xl" />

      <div className="text-[20px] mb-7 border w-32 h-11 flex items-center justify-center bg-white font-bold rounded-md">
        Team Task
      </div>
      <Grid columns={12}>
        {publicColumns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            isPublic={column.isPublic}
            status={column.status}
          />
        ))}
      </Grid>
    </div>
  );
}

export default Board;
