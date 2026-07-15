import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const TaskCalendar = ({ tasks }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.taskDate); // use taskDate from your schema

    return (
      taskDate.toDateString() === selectedDate.toDateString()
    );
  });

  const hasTaskOnDate = (date) => {
    return tasks.some((task) => {
      const taskDate = new Date(task.taskDate); 
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
   
    <div>
      <h2 className="text-xl font-bold mb-4">
        Task Calendar
      </h2>
<Calendar
  onChange={setSelectedDate}
  value={selectedDate}
  tileClassName={({ date }) =>
    hasTaskOnDate(date) ? "task-date" : null
  }
/>
      <div className="mt-4">
        <h3 className="font-semibold">
          Tasks on {selectedDate.toDateString()}
        </h3>

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="p-2 border rounded mt-2"
            >
              <p><strong>{task.title}</strong></p>
              <p>Status: {task.status}</p>
              <p>Amount: ₹{task.amount}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-2">
            No tasks for this date
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskCalendar;