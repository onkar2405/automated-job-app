import React, { useMemo, useState } from "react";
import { User } from "../types/user";
import "../styles/Profile.css";

export default function Profile({ user }: { user: User }) {
  const [imgError, setImgError] = useState(false);

  const initials = useMemo(() => {
    const name = (user && user.name) || "";
    const parts = name.trim().split(/\s+/);
    const first = parts[0] ? parts[0][0] : "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }, [user]);

  const bgColor = useMemo(() => {
    const colors = [
      "#F44336",
      "#E91E63",
      "#9C27B0",
      "#3F51B5",
      "#2196F3",
      "#03A9F4",
      "#009688",
      "#4CAF50",
      "#FF9800",
      "#795548",
    ];
    const seedStr = (user && (user.id || user.name)) || "";
    const seed = seedStr
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return colors[seed % colors.length];
  }, [user]);

  if (!user) return null;

  const capitalCaseUserName = user.name
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))[0];

  const showInitials = !user.picture || imgError;

  return (
    <div className="profile">
      <span className="profile-name">{capitalCaseUserName}</span>
      {showInitials ? (
        <div className="profile-initials" style={{ backgroundColor: bgColor }}>
          {initials}
        </div>
      ) : (
        <img
          className="profile-avatar"
          src={user.picture}
          alt={user.name}
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}
