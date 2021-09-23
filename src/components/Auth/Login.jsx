import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Pets from "@material-ui/icons/Pets";
import Typography from "@material-ui/core/Typography";
import API_URL from "../_helpers/environment";

const Login = (props) => {
  const { classes, updateToken, toggleView, setUsersInfo, usersInfo } = props;
  const [profile_name, setProfile_name] = useState("");
  const [password, setPassword] = useState("");

  const handleProfileName = (e) => setProfile_name(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fetchResults = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        body: JSON.stringify({ profile_name, password }),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
      const json = await fetchResults.json();
      if (!json.user || !json.sessionToken) {
        alert(json.message);
        return;
      }
      const matchesFetch = await fetch(`${API_URL}/like/matches`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: json.sessionToken,
        }),
      });
      const matchesJson = await matchesFetch.json();
      setUsersInfo({
        ...usersInfo,
        user: json.user,
        matches: matchesJson.matches,
        matchesCount: matchesJson.count,
      });
      updateToken(json.sessionToken);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Pets />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            value={profile_name}
            onChange={handleProfileName}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={handlePassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link onClick={toggleView} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Grid>
  );
};

export default Login;
