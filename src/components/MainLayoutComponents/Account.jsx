import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Pets from "@material-ui/icons/Pets";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Container } from "@material-ui/core";
import NotConnected from "./NotConnected";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  disabledInput: {
    "& .MuiInputBase-root.Mui-disabled": {
      color: "black",
    },
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

const Account = (props) => {
  const { usersInfo, socket } = props;
  const classes = useStyles();
  const history = useHistory();
  const [name, setName] = useState(null);
  const [profile_name, setProfile_name] = useState(null);
  const [email, setEmail] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);

  useEffect(() => {
    setName(usersInfo?.user?.name);
    setProfile_name(usersInfo?.user?.profile_name);
    setEmail(usersInfo?.user?.email);
  },[usersInfo?.user]);

  const handleName = (e) => setName(e.target.value);
  const handleProfileName = (e) => setProfile_name(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);

  const validateName = (fullName) => fullName?.split(" ").length >= 2;
  const validateEmail = (emailAddress) =>
    emailAddress.split("").includes("@") && emailAddress?.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateName(name)) {
      alert("Please fill out your full name.");
      return;
    }
    if (!validateEmail(email)) {
      alert("Please use a valid email address.");
      return;
    }

    try {
      const fetchResults = await fetch("http://localhost:3333/user/", {
        method: "PUT",
        body: JSON.stringify({
          profile_name,
          name: name
            .split(" ")
            .map((name) => name[0].toUpperCase() + name.slice(1))
            .join(" "),
          email,
        }),
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        }),
      });
      const json = await fetchResults.json();
      alert(json.message);
      socket.emit("newLogin", usersInfo?.user?.id);
      history.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return usersInfo?.user?.name ? (
    <Container
      style={{
        height: "80%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Pets />
          </Avatar>
          <Typography component="h1" variant="h5">
            Account
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              title="Username must be at least 6 characters!"
              variant="standard"
              disabled
              className={classes.disabledInput}
              margin="normal"
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={profile_name ?? usersInfo?.user?.profile_name}
              onChange={handleProfileName}
              InputProps={{ disableUnderline: true }}
            />
            <TextField
              variant={editingName ? "outlined" : "standard"}
              disabled={editingName ? false : true}
              className={classes.disabledInput}
              margin="normal"
              fullWidth
              naked
              id="full-name"
              label="Name"
              name="full-name"
              autoFocus
              value={name ?? usersInfo?.user?.name}
              onChange={handleName}
              InputProps={{
                endAdornment: (
                  <Button onClick={() => setEditingName(!editingName)}>
                    {editingName ? "save" : "edit"}
                  </Button>
                ),
                disableUnderline: true,
              }}
            />

            <TextField
              variant={editingEmail ? "outlined" : "standard"}
              disabled={editingEmail ? false : true}
              className={classes.disabledInput}
              margin="normal"
              type="email"
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={email ?? usersInfo?.user?.email}
              onChange={handleEmail}
              InputProps={{
                endAdornment: (
                  <Button onClick={() => setEditingEmail(!editingEmail)}>
                    {editingEmail ? "save" : "edit"}
                  </Button>
                ),
                disableUnderline: true,
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Save Changes
            </Button>
          </form>
        </div>
      </Grid>
    </Container>
  ) : (
    <NotConnected />
  );
};

export default Account;
