import CssBaseline from "@material-ui/core/CssBaseline";
import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Login from "./Login";
import Signup from "./Signup";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage:
      "url(http://images.unsplash.com/photo-1630359563592-c685967f83d7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max)",
      backgroundRepeat: "no-repeat",
      backgroundColor:
        theme.palette.type === "light"
          ? theme.palette.grey[50]
          : theme.palette.grey[900],
      backgroundSize: "cover",
      backgroundPosition: "center",

  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Auth(props) {
  const { updateToken, setUsersInfo } = props;
  const [loginShowing, setLoginShowing] = useState(true);
  const classes = useStyles();

  const toggleView = () => setLoginShowing(!loginShowing);

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      {loginShowing ? (
        <Login
          classes={classes}
          updateToken={updateToken}
          setUsersInfo={setUsersInfo}
          toggleView={toggleView}
        />
      ) : (
        <Signup
          classes={classes}
          updateToken={updateToken}
          setUsersInfo={setUsersInfo}
          toggleView={toggleView}
        />
      )}
    </Grid>
  );
}