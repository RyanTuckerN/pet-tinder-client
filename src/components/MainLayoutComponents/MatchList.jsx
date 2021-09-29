import React, { useState, useEffect } from 'react';
import OnlineStatus from "./OnlineStatus";
import "./layout.css";

import {
  Badge,
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
    matchlistNotifications
  } = props.matchListProps;
  
  const [notificationsHash, setNotificationsHash] = useState({});

  useEffect(()=>{
    const hash = matchlistNotifications?.reduce((a,b)=>{
      if(!a[b.senderId]){
        a[b.senderId] = 0
      }
      a[b.senderId]++
      return a
    },{})
    setNotificationsHash(hash)
  }, [matchlistNotifications])

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
                    <Badge 
                    badgeContent='!'
                    // variant='dot'
                    invisible={notificationsHash[match.id]?false:true}
                     color='secondary'  >
                      <Avatar
                        src={match.photo_url}
                        id="matchlist-avatar"
                        className={
                          chatTarget?.id == match.id ? "current-target" : null
                        }
                      />
                    </Badge>
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
