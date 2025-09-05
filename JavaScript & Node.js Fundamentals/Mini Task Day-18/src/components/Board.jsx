import React from "react";
import Column from "./Column";

export default function Board({ tasksByStatus, onAdd, onEdit, onDelete, STATUSES, TEAM }) {
  return (
    <div className="grid grid-cols-4 gap-5">
      {STATUSES.map((s) => (
        <Column
          key={s.id}
          id={s.id}
          label={s.label}
          tasks={tasksByStatus[s.id] || []}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
          TEAM={TEAM}
        />
      ))}
    </div>
  );
}
