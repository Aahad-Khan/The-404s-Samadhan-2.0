import React from "react";

export default function Avatar({ name, color }) {
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase();
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-bold"
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials}
    </div>
  );
}
