import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";
import API_URL from "../_helpers/environment";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    color: 'white'
  },
  demo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

export default function NotificationsPage(props) {
  const { usersInfo, notifications, setNotifications, socket, setChatTarget } =
    props.noteProps;
  const [matchImages, setMatchImages] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    const picDictionary = usersInfo?.matches?.reduce((a, b) => {
      a[b.id] = b.photo_url;
      return a;
    }, {});
    // console.log(picDictionary);
    setMatchImages(picDictionary);
  }, [usersInfo]);

  const handleClear = async () => {
    const fetchDelete = await fetch(`${API_URL}/note/`, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      }),
    });
    const deletionsJson = await fetchDelete.json();
    // console.log(deletionsJson);
    setNotifications(null);
  };
  const handleChatTarget = (notification) => {
    setChatTarget(
      //finds match that corresponds to notification target
      usersInfo?.matches?.filter((match) => match.id == notification.target)[0]
    );
    socket.emit("chat", {
      sender: usersInfo?.user,
      receiver: { id: notification.target },
    });
  };

  //clears notification on unmount
  useEffect(() => {
    return handleClear;
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.title}>
            Notifications
          </Typography>
          <div className={classes.demo}>
            <List>
              {notifications
                ? notifications.length
                  ? notifications.map((n) => {
                      return (
                        <Link to="/chat" key={n.id} >
                          <ListItem onClick={() => handleChatTarget(n)}>
                            <ListItemAvatar>
                              <Avatar
                                src={matchImages ? matchImages[n.target] : null}
                              ></Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={n.message} style={{color: '#f3f0ee'}} />
                          </ListItem>
                        </Link>
                      );
                    })
                  : "No Notifications to display!"
                : "No Notifications to display!"}
            </List>
            {notifications?.length ? (
              <Button onClick={handleClear} variant="outlined" style={{color: '#f3f0ee', border: 'solid white 1px'}}>
                CLEAR NOTIFICATIONS
              </Button>
            ) : null}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
