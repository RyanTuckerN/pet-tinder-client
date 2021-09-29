import { Typography, Tooltip } from "@material-ui/core";
import './Chat.css'

const ChatMessage = (props) => {
  const { message, usersInfo } = props;
  const time = new Date(message.createdAt).toLocaleTimeString();
  const month = new Date(message.createdAt).getMonth();
  const date = new Date(message.createdAt).getDate();
  const year = new Date(message.createdAt).getFullYear();
  const userStyle = {
    textAlign: "right",
    backgroundColor: "#514949",
    padding: "8px",
    borderRadius: 12,
    marginLeft: 15,
    marginRight: 15,
  };
  const targetStyle = {
    textAlign: "left",
    backgroundColor: "#fd2974",
    padding: "8px",
    borderRadius: 12,
    marginLeft: 15,
    marginRight: 15,
  };

  return (
    <Tooltip
      title={`Sent on: ${month}/${date}/${year}, ${time}`}
      placement="top"
    >
      <div
        className="chat-message"
        style={{ color: "white", padding: "2px", display: "inline-block" }}
      >
        <div
          key={message.id}
          style={
            message.user.name === usersInfo.user.profile_name
              ? userStyle
              : targetStyle
          }
        >
          <Typography
            variant="caption"
            style={{ paddingLeft: 8, paddingRight: 8 }}
          >
            {message.text}
          </Typography>
        </div>
      </div>
    </Tooltip>
  );
};

export default ChatMessage;
