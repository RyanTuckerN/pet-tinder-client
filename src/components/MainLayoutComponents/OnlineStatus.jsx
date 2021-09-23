import React, { useState, useEffect } from "react";

const OnlineStatus = (props) => {
  const { match, onlineUsers } = props;
  const [socketsListExists, setSocketsListExists] = useState(false);
  useEffect(() => {
    setSocketsListExists(onlineUsers ? true : false);
  }, [onlineUsers]);

  const statusStyle = {
    minHeight: 10,
    minWidth: 10,
    border: "solid black 1px",
    borderRadius: "50%",
    position: "relative",
    right: 24,
    top: 15,
  };
  return (
    <div
      id="online-status"
      style={socketsListExists ? statusStyle : {}}
      className={
        socketsListExists
          ? Object.keys(onlineUsers.mobileSockets).includes(match.id.toString())
            ? "online-status-on"
            : null
          : null
      }
    ></div>
  );
};

export default OnlineStatus;
