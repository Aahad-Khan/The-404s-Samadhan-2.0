import React from "react";
import ProfileCard from "./ProfileCard";

export default function App() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <ProfileCard
        name="The 404s Member"
        role="Full Stack Developers"
        image="https://i.imgflip.com/4/3oevdk.jpg"
        skills={[
          "ReactJS",
          "NodeJS",
          "JavaScript",
          "SQL",
          "Python",
          "MongoDB",
          "React Hooks",
          "React Native",
        ]}
      />
    </div>
  );
}


