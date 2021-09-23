import { Avatar, Typography } from "@material-ui/core";
import { Link } from 'react-router-dom'
import "./Chat.css";
import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import StickyFooter from "./StickyFooter";

const ChatIndex = (props) => {
  const { socket, usersInfo, chatTarget, setChatTarget, setChatActive, open } =
    props.chatProps;
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  const handleAlign = (m, i) =>
    m.user._id == i.user.id ? "flex-end" : "flex-start";
  const handleChange = (e) => setChatMessage(e.target.value);
  const handleExitChat = () => {
    setChatTarget(null);
    setMessages([]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatTarget) {
      alert("Please select a dog to bark at!");
      return;
    } else {
      if (chatMessage.length >= 255) {
        alert("Your message is too long! Keep it under 255 characters.");
      } else {
        socket.emit("message", {
          text: chatMessage,
          sender: usersInfo.user,
          receiver: chatTarget.user,
        });
      }
    }
    setChatMessage("");
  };

  useEffect(()=>{
    setChatActive(true)
    return ()=>setChatActive(false)
  },[])

  useEffect(() => {
    if (socket) {
      socket.on("priorMessages", (conversation) =>
        setMessages(conversation.messages)
      );
      socket.on("incomingMessage", ({ message, conversation }) =>
        setMessages(conversation.messages)
      );
    }
    return handleExitChat;
  }, [socket]);

  useEffect(scrollToBottom, [messages]);

  return (
    <>
      <section id="chat-window">
        {chatTarget ? (
          <div className="chat-target-banner">
            <Link to={`/profile/${chatTarget.id}`}>
              <Avatar src={chatTarget.photo_url} id="chat-target-avatar" />
            </Link>
            <div>
              <Typography className="chat-target-text" variant="h6">
                {chatTarget.name}
              </Typography>
              <Typography
                className="chat-target-text"
                variant="caption"
              >{`${chatTarget.breed}, ${chatTarget.age} years old.`}</Typography>
            </div>
          </div>
        ) : (
          <div style={{ margin: 100 }}>
            {usersInfo?.matches?.length
              ? "Click a match in the side menu to start chatting!"
              : "Match with some dogs to start chatting!"}
          </div>
        )}
        <div
          className="chat-messages"
          style={{ width: "100%", marginBottom: 100 }}
        >
          {messages
            ? messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: "flex",
                    justifyContent: handleAlign(message, usersInfo),
                    overflowAnchor: "none",
                  }}
                >
                  <ChatMessage message={message} usersInfo={usersInfo} />
                  <div ref={messagesEndRef} />
                  <br />
                </div>
              ))
            : null}
        </div>
      </section>

      <StickyFooter
        handleChange={handleChange}
        chatMessage={chatMessage}
        handleSubmit={handleSubmit}
        value={chatMessage}
        open={open}
      />
    </>
  );
};

export default ChatIndex;
