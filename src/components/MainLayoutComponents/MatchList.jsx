import OnlineStatus from "./OnlineStatus";
import "./layout.css";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  ListItemAvatar,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { Chat, ChevronLeft } from "@material-ui/icons";
import TypingIndicator from "./TypingIndicator";

const MatchList = (props) => {
  const { handleDrawerClose } = props;
  const {
    usersInfo,
    setChatTarget,
    socket,
    chatTarget,
    typingUsers,
    handleDrawerToggle,
    onlineUsers,
    open,
  } = props.matchListProps;

  return (
    <List>
      <ListItemIcon>
        <IconButton onClick={handleDrawerToggle}>
          {open ? (
            <ChevronLeft />
          ) : (
            <Tooltip title="Select a match to begin chatting">
              <Chat />
            </Tooltip>
          )}
        </IconButton>
      </ListItemIcon>
      {usersInfo?.matches
        ? usersInfo.matches.map((match) => (
            <Tooltip key={match.id} title={`Bark at ${match.name}!`}>
              <ListItem
                button
                onClick={() => {
                  // console.log("CHAT TARGET: ", match);
                  handleDrawerClose();
                  setChatTarget(match);
                  socket.emit("chat", {
                    sender: usersInfo.user,
                    receiver: match.user,
                  });
                }}
              >
                <ListItemAvatar>
                  <div className="avatar-wrapper">
                    <Avatar
                      src={match.photo_url}
                      id="matchlist-avatar"
                      className={
                        chatTarget?.id == match.id ? "current-target" : null
                      }
                    />
                  </div>
                </ListItemAvatar>
                {typingUsers.includes(match.id) ? (
                  <TypingIndicator />
                ) : (
                  <OnlineStatus onlineUsers={onlineUsers} match={match} />
                )}
                <ListItemText primary={match.name} />
              </ListItem>
            </Tooltip>
          ))
        : null}
    </List>
  );
};

export default MatchList;
