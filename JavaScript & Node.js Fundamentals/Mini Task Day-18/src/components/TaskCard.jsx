import React from "react";
import Avatar from "./Avatar";

export default function TaskCard({ task, onEdit, onDelete, TEAM }) {
  const assignee = TEAM.find((u) => u.id === task.assigneeId);

  return (
    <div className="p-3 rounded-xl border bg-gray-50 shadow-sm group hover:shadow-md transition">
      <h4 className="font-semibold text-gray-800">{task.title}</h4>
      {task.description && <p className="text-xs text-gray-600 mt-1">{task.description}</p>}
      <div className="flex justify-between items-center mt-3">
        {assignee ? (
          <Avatar name={assignee.name} color={assignee.color} />
        ) : (
          <span className="text-xs text-gray-400 italic">Unassigned</span>
        )}
        <div className="space-x-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(task)}
            className="text-xs border px-2 py-1 rounded hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs border px-2 py-1 rounded text-red-500 hover:bg-red-50"
          >
            Del
          </button>
        </div>
      </div>
    </div>
  );
}
