import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import {
  Avatar,
  Backdrop,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import BasicInfo from "./BasicInfo";
import AdDesc from "./AdDesc";
import ImageUpload from "./ImageUpload";
import "./Profile.css";
import API_URL from "../_helpers/environment";

const useStyles = makeStyles((theme) => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const Profile = (props) => {
  const { token, avatarPhoto, usersInfo, socket } = props.profileProps;
  const { user } = usersInfo;
  const { dog } = user;
  const history = useHistory();
  const classes = useStyles();
  const [name, setName] = useState(dog.name);
  const [photo_url, setPhoto_url] = useState(dog.photo_url);
  const [breed, setBreed] = useState(dog.breed);
  const [weight, setWeight] = useState(dog.weight);
  const [age, setAge] = useState(dog.age);
  const [ad_description, setAdDescription] = useState(dog.ad_description);
  const [length, setLength] = useState(dog.ad_description.length);
  const [temperament, setTemperament] = useState(dog.temperament);
  const [is_female, setIsFemale] = useState(dog.is_female);
  const [location, setLocation] = useState(dog.location);
  const [open, setOpen] = useState(false);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      // THIS JS METHOD ASKS CLIENT FOR PERMISSION TO USE POSITION
      (position) => {
        // TAKES A CALLBACK
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        return {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
      }
    );
  };

  useEffect(() => {
    if (!usersInfo?.user?.dog?.location.lat || !usersInfo?.user?.dog) {
      getLocation();
    }
  }, []);

  const creatingProfile = false;
  const properizeNoun = (str) =>
    str
      .split(" ")
      .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  const handleClose = () => setOpen(false);

  const updateProps = {
    zero: {
      name,
      breed,
      age,
      weight,
      is_female,
      location,
      creatingProfile,
      setName,
      setBreed,
      setAge,
      setWeight,
      setIsFemale,
      setLocation,
    },
    one: {
      temperament,
      ad_description,
      length,
      setLength,
      setTemperament,
      setAdDescription,
    },
    two: { setPhoto_url, photo_url },
    three: {
      name,
      photo_url,
      breed: properizeNoun(breed),
      weight,
      age,
      ad_description,
      temperament,
      is_female,
      location,
    },
  };

  const handleSubmit = async () => {
    try {
      const fetchResults = await fetch(`${API_URL}/dog/${user.id}`, {
        method: "PUT",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: token,
        }),
        body: JSON.stringify(updateProps.three),
      });
      const json = await fetchResults.json();
      alert(json.message);
      socket.emit("newLogin", usersInfo.user.id);
      history.push("/");
    } catch (err) {
      alert(err);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "This will delete your profile! Your user account will still be intact. Do you want to proceed?"
      )
    )
      return;
    const deleteFetch = await fetch(`${API_URL}/dog/`, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: token,
      }),
    });
    const json = await deleteFetch.json();
    alert(json.message);
    socket.emit("newLogin", usersInfo.user.id);
    history.push("/");
  };

  return user?.dog ? (
    <>
      <CssBaseline />
      <section className={classes.layout}>
        <Paper className={classes.paper}>
          <div
            style={{
              padding: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div id="profile-photo-wrapper">
              <Avatar src={avatarPhoto} style={{ height: 180, width: 180 }} />
            </div>
            <hr />
            <div className="profile-section">
              <BasicInfo
                className="profile-section"
                zeroProps={updateProps.zero}
              />
              <AdDesc className="profile-section" oneProps={updateProps.one} />
              <ImageUpload
                className="profile-section"
                twoProps={updateProps.two}
              />
            </div>
          </div>
          <React.Fragment>
            <div className={classes.buttons}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleDelete}
              >
                Delete profile
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleSubmit}
              >
                Save changes
              </Button>
            </div>
          </React.Fragment>
        </Paper>
      </section>
    </>
  ) : (
    <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Profile;
