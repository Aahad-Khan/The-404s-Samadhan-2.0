import React from "react";
import TaskCard from "./TaskCard";

export default function Column({ id, label, tasks, onAdd, onEdit, onDelete, TEAM }) {
  return (
    <div className="flex flex-col gap-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">{label} ({tasks.length})</h3>
        <button
          onClick={() => onAdd(id)}
          className="text-xs px-2 py-1 border rounded-lg hover:bg-gray-50"
        >
          + Add
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} TEAM={TEAM} />
        ))}
      </div>
    </div>
  );
}
