import React from "react";

export default function ActivityLog({ entries }) {
  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      {entries.length === 0 && (
        <p className="text-sm text-gray-400 italic">No activity yet.</p>
      )}
      {entries.map((e) => (
        <div key={e.id} className="text-xs text-gray-700 border-b pb-1">
          <span className="font-medium">{e.actor}</span> {e.action}
          <div className="text-[10px] text-gray-400">{new Date(e.ts).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
