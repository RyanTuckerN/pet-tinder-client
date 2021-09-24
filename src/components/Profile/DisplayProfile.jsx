import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Grid,
  Typography,
  Container,
  makeStyles,
  Avatar,
  Link,
  IconButton,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { LocationOn, Email, Chat } from "@material-ui/icons";
import NotConnected from "../MainLayoutComponents/NotConnected";

const useStyles = makeStyles({
  root: {
    borderRadius: 2,
    height: 600,
    color: "#514949",
  },
});

const DisplayProfile = (props) => {
  const classes = useStyles();
  const { dogId } = useParams();
  const { usersInfo, setChatTarget, socket } = props;
  const [locale, setLocale] = useState(null);
  const [ownDog, setOwnDog] = useState(null);
  const history = useHistory();
  const currentDog =
    usersInfo?.matches?.filter((match) => match.id === parseInt(dogId))[0] ??
    usersInfo?.user?.dog;

  useEffect(() => {
    setOwnDog(currentDog?.id === usersInfo?.user?.id ? true : false);
  }, [currentDog, usersInfo?.user]);

  useEffect(() => {
    if (!currentDog?.location?.lat || !currentDog?.location?.lon) return;
    const { lat, lon } = currentDog.location;
    try {
      const localeFetch = async () => {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        const json = await res.json();
        // console.log("REVERSE GEO:", json);
        if(!json.locality && !json.city)return
        setLocale({
          locale: json.city ? json.city : json.locality ,
          state: json.principalSubdivision,
        });
      };
      localeFetch();
    } catch (err) {
      console.error(err);
    }
  }, [currentDog]);

  const handleChatTarget = (dog) => {
    setChatTarget(
      //finds match that corresponds to target
      usersInfo?.matches?.filter((match) => match.id == dog.id)[0]
    );
    socket.emit("chat", {
      sender: usersInfo?.user,
      receiver: { id: dog.id },
    });
  };

  return currentDog ? (
    <Container
      maxWidth="sm"
      className={classes.root}
      style={{
        minHeight: "calc(100% - 65px)",
        border: "solid #f6f6f6 2px",
        borderRadius: 2,
        background: "white",
      }}
      id="profile-container"
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: 30 }}
      >
        <Grid
          item
          direction="column"
          justifyContent="center"
          alignItems="center"
          container
          style={{ padding: 10 }}
          xs={12}
        >
          <Grid item xs={11}>
            <Avatar
              src={currentDog.photo_url}
              alt={currentDog.name}
              style={{ width: 200, height: 200, borderRadius: "50%" }}
            />
          </Grid>
          {ownDog ? null : (
            <Grid
              container
              item
              xs={12}
              direction="row"
              justifyContent="space-evenly"
              style={{ position: "relative", bottom: 10 }}
            >
              <Grid item xs={5}></Grid>
              <Grid item xs={1}>
                <IconButton
                  onClick={() => {
                    handleChatTarget(currentDog);
                    history.push("/chat");
                  }}
                >
                  <Chat
                    style={{
                      position: "relative",
                      bottom: 13,
                      backgroundColor: "#fd2974",
                      padding: 3,
                      borderRadius: "50%",
                      color: "#f3f0ee",
                    }}
                  />
                </IconButton>
              </Grid>
              <Grid item xs={1}>
                <Link
                  href={`mailto:${currentDog.user?.email}
                    ?subject=Interested in ${currentDog.name}
                    &body=${
                      usersInfo?.user?.email
                        ? "You can reach me at " +
                          usersInfo?.user?.email +
                          ", or just send me a chat in the app!"
                        : "Why we using email?? Just hit me on the app!"
                    }`}
                >
                  <IconButton>
                    <Email
                      style={{
                        position: "relative",
                        bottom: 13,
                        backgroundColor: "#fd2974",
                        padding: 3,
                        borderRadius: "50%",
                        color: "#f3f0ee",
                      }}
                    />
                  </IconButton>
                </Link>
              </Grid>
              <Grid item xs={5}></Grid>
            </Grid>
          )}
          <Grid
            container
            item
            xs={11}
            style={{
              padding: 10,
            }}
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
          >
            <div style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography variant="h4" style={{ padding: 10 }}>
                  {currentDog.name}
                </Typography>
                <Typography
                  variant="body2"
                  style={{ paddingBottom: 5, paddingLeft: 15 }}
                >
                  {currentDog.temperament.join(" | ")}
                </Typography>
                <Typography
                  variant="subtitle1"
                  style={{ paddingBottom: 5, paddingLeft: 15 }}
                >
                  {`${currentDog.breed} | ${currentDog.age} years old | ${currentDog.weight} pounds`}
                </Typography>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  {locale ? <LocationOn color="secondary" /> : null}
                  <Typography variant="subtitle1">
                    {locale ? `${locale.locale}, ${locale.state ?? ""}` : null}
                  </Typography>
                </div>
              </div>
              <hr />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="body2"
                  style={{ padding: 20, fontStyle: "italic" }}
                >
                  "{currentDog.ad_description}"
                </Typography>
              </div>
              <div style={{ marginTop: 35 }}>
                <Typography variant="subtitle2">
                  {`Eligible ${
                    currentDog.is_female ? "bachelorette" : "bachelor"
                  } since ${new Date(
                    currentDog.createdAt
                  ).toLocaleDateString()}`}
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  ) : (
    <NotConnected />
  );
};

export default DisplayProfile;
