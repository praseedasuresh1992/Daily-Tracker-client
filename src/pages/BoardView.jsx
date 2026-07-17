import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import TaskCard from "../components/TaskCard";

import {
  getTasks,
  updateTaskStatus,
  deleteTask,
  updateTask,
  deleteAttachment,
  addAttachment,
} from "../services/taskService";

const BoardView = () => {
const Navigate=useNavigate();

  const [columns, setColumns] = useState({
    pending: [],
    completed: [],
  });

  useEffect(() => {
    fetchTasks();
  }, []);
  

  const fetchTasks = async () => {
    try {
      const tasks = await getTasks("all");

      setColumns({
        pending: tasks.filter(
          (task) => task.status === "pending"
        ),
        completed: tasks.filter(
          (task) => task.status === "completed"
        ),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const updatedTask = await updateTask(
        id,
        data
      );

      setColumns((prev) => ({
        pending: prev.pending.map((task) =>
          task._id === id
            ? updatedTask
            : task
        ),
        done: prev.done.map((task) =>
          task._id === id
            ? updatedTask
            : task
        ),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);

      setColumns((prev) => ({
        pending: prev.pending.filter(
          (task) => task._id !== id
        ),
        done: prev.done.filter(
          (task) => task._id !== id
        ),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDragEnd = async (
    result
  ) => {
    const { source, destination } =
      result;

    if (!destination) return;

    if (
      source.droppableId ===
        destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = [
      ...columns[source.droppableId],
    ];

    const destinationColumn =
      source.droppableId ===
      destination.droppableId
        ? sourceColumn
        : [
            ...columns[
              destination.droppableId
            ],
          ];

    const [movedTask] =
      sourceColumn.splice(
        source.index,
        1
      );

    movedTask.status =
      destination.droppableId;

    destinationColumn.splice(
      destination.index,
      0,
      movedTask
    );

    if (
      source.droppableId ===
      destination.droppableId
    ) {
      setColumns((prev) => ({
        ...prev,
        [source.droppableId]:
          sourceColumn,
      }));
    } else {
      setColumns((prev) => ({
        ...prev,
        [source.droppableId]:
          sourceColumn,
        [destination.droppableId]:
          destinationColumn,
      }));

      try {
        await updateTaskStatus(
          movedTask._id,
          destination.droppableId
        );
      } catch (err) {
        console.log(err);
        fetchTasks();
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between item-center mb-4">
      <h1 className="text-2xl font-bold mb-6">
        Expense Board
      </h1>

      <button onClick={()=>Navigate(-1)} 
        className="px-4 py-2 bg-gray-500 text-white rounded-full  ">Back</button>
</div>
      <DragDropContext
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Pending Column */}

          <Droppable
            droppableId="pending"
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 min-h-[600px]"
              >
                <h2 className="text-lg font-bold mb-4">
                  Pending (
                  {
                    columns.pending
                      .length
                  }
                  )
                </h2>

                {columns.pending.map(
                  (task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={
                        task._id
                      }
                      index={index}
                    >
                      {(
                        provided
                      ) => (
                        <div
                          ref={
                            provided.innerRef
                          }
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3"
                        >
                          <TaskCard
                            task={
                              task
                            }
                            onUpdate={
                              handleUpdate
                            }
                            onDelete={
                              handleDelete
                            }
                            onToggleStatus={() =>
                              fetchTasks()
                            }
                            deleteAttachment={
                              deleteAttachment
                            }
                            onAttachmentDeleted={
                              fetchTasks
                            }
                            addAttachment={
                              addAttachment
                            }
                          />
                        </div>
                      )}
                    </Draggable>
                  )
                )}

                {
                  provided.placeholder
                }
              </div>
            )}
          </Droppable>

          {/* Done Column */}

          <Droppable
            droppableId="completed"
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-green-50 dark:bg-gray-800 rounded-xl p-4 min-h-[600px]"
              >
                <h2 className="text-lg font-bold mb-4">
                  Completed (
                  {
                    columns.completed
                      .length
                  }
                  )
                </h2>

                {columns.completed.map(
                  (task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={
                        task._id
                      }
                      index={index}
                    >
                      {(
                        provided
                      ) => (
                        <div
                          ref={
                            provided.innerRef
                          }
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3"
                        >
                          <TaskCard
                            task={
                              task
                            }
                            onUpdate={
                              handleUpdate
                            }
                            onDelete={
                              handleDelete
                            }
                            onToggleStatus={() =>
                              fetchTasks()
                            }
                            deleteAttachment={
                              deleteAttachment
                            }
                            onAttachmentDeleted={
                              fetchTasks
                            }
                            addAttachment={
                              addAttachment
                            }
                          />
                        </div>
                      )}
                    </Draggable>
                  )
                )}

                {
                  provided.placeholder
                }
              </div>
            )}
          </Droppable>

        </div>
      </DragDropContext>
    </div>
  );
};

export default BoardView;