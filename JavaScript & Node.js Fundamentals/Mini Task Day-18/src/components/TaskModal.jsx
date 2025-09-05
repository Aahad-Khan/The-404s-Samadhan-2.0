import React, { useEffect, useState } from "react";

export default function TaskModal({ open, initial, onClose, onSave, TEAM }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [assigneeId, setAssigneeId] = useState(initial?.assigneeId ?? "");

  useEffect(() => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setAssigneeId(initial?.assigneeId ?? "");
  }, [initial, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{initial?.id ? "Edit Task" : "New Task"}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Task title"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
              rows={3}
              placeholder="Task details..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Assignee</label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="">Unassigned</option>
              {TEAM.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-3 py-2 border rounded-lg">Cancel</button>
          <button
            onClick={() => onSave({ ...(initial ?? {}), title, description, assigneeId })}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
