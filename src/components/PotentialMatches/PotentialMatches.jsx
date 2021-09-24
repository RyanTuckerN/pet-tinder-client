import React, { useState, useEffect } from "react";
import DogDisplay from "../Profile/DogDisplay";
import {
  Button,
  Grid,
  Radio,
  Typography,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import TinderCard from "react-tinder-card";
import "../Profile/Profile.css";
import "./PotentialMatches.css";
import distanceBetCoor from "../../functions/distanceBetCoor";
import API_URL from '../_helpers/environment'

let dogsState, originalArray;

const alreadyRemoved = [];

const PotentialMatches = (props) => {
  const { socket, usersInfo } = props;
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [lastDirection, setLastDirection] = useState();
  const [params, setParams] = useState({ sorted: false });
  const [value, setValue] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFemaleFilter = () => {
    setParams({ ...params, sex: "females" });
    setValue("a");
  };
  const handleMaleFilter = () => {
    setParams({ ...params, sex: "males" });
    setValue("b");
  };

  const fetchPotentialMatches = async (paramsObject) => {
    try {
      const allLikes = await fetch(`${API_URL}/like/mine`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        }),
      });
      const allDogs = await fetch(`${API_URL}/dog/all`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        }),
      });
      const likesJson = await allLikes.json();

      const dogsJson = await allDogs.json();
      {
        const likedIds = likesJson.length
          ? likesJson.map((el) => el.dog.id)
          : [];
        const likesRemoved = dogsJson.dogs
          .filter((dog) => !likedIds.includes(dog.id))
          .sort((a, b) => {
            const dist1 = distanceBetCoor.calcMiles([
              b.location?.lat ?? 0,
              b.location?.lon ?? 0,
              usersInfo?.user?.dog?.location?.lat ?? 0,
              usersInfo?.user?.dog?.location?.lon ?? 0,
            ]);
            const dist2 = distanceBetCoor.calcMiles([
              a.location?.lat ?? 0,
              a.location?.lon ?? 0,
              usersInfo?.user?.dog?.location?.lat ?? 0,
              usersInfo?.user?.dog?.location?.lon ?? 0,
            ]);
            // console.log("DISTANCES: ", dist1, dist2);
            return dist1 > dist2 ? 1 : -1;
          });
        let results =
          paramsObject?.sex === "females"
            ? likesRemoved.filter((dog) => dog.is_female)
            : paramsObject?.sex === "males"
            ? likesRemoved.filter((dog) => !dog.is_female)
            : likesRemoved;
        originalArray = results;
        dogsState = results;
        setPotentialMatches(results);
      }
    } catch (err) {
      console.error(err);
      alert("There was an error! Please try again.");
    }
  };
  useEffect(() => fetchPotentialMatches(params), [params]);

  const handleLike = async (dir, id) => {
    try {
      //First fetch matches
      const firstMatchesFetch = await fetch(
        `${API_URL}/like/matches`,
        {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          }),
        }
      );
      const firstRes = await firstMatchesFetch.json();
      const firstCount = firstRes.count;
      const firstMatches = firstRes.matches;
      //Like the dog
      const likeFetch = await fetch(`${API_URL}/like/${id}`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        }),
        body: JSON.stringify({ superlike: dir === "up" ? true : false }),
      });
      const json = await likeFetch.json();
      // console.log(json);
      socket.emit("matchRequest", usersInfo?.user?.id);

      //fetch matches again, see if there is a change
      const secondMatchesFetch = await fetch(
        `${API_URL}/like/matches`,
        {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          }),
        }
      );
      const secondRes = await secondMatchesFetch.json();
      const secondCount = secondRes.count;
      const secondMatches = secondRes.matches;
      //if there is a new match...
      if (secondCount > firstCount) {
        const newMatch = secondMatches.filter(
          (match) => !firstMatches.map((d) => d.id).includes(match.id)
        )[0];
        // console.log("NEW MATCH: ", newMatch);
        const selfNote = await fetch(
          `${API_URL}/note/${usersInfo?.user?.id}`,
          {
            method: "POST",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            }),
            body: JSON.stringify({
              message: `You have a new match! Send ${newMatch.name} a chat.`,
              target: newMatch?.id,
            }),
          }
        );
        const targetNote = await fetch(`${API_URL}/note/${id}`, {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          }),
          body: JSON.stringify({
            message: `You have a new match! Send ${usersInfo?.user?.dog?.name} a chat.`,
            target: usersInfo?.user?.id,
          }),
        });

        const targetJson = await targetNote.json();
        const selfJson = await selfNote.json();
        // console.log("NOTIFICATION RESPONSES: ", selfJson, targetJson);
        socket.emit("notificationRequest", {
          userId: usersInfo?.user?.id,
          target: id,
        });
      }
    } catch (err) {
      console.error(err);
      alert("There was an error! Please try again");
    }
  };

  const swiped = (dir, idToDelete) => {
    // console.log("removing :", idToDelete);
    setLastDirection(dir);
    alreadyRemoved.push(idToDelete);
    if (dir === "left" || dir === "down") return;
    handleLike(dir, idToDelete);
  };

  const outOfFrame = (id) => {
    // console.log(id + " left the screen!");
    dogsState = dogsState.filter((dog) => dog.id !== id);
    setPotentialMatches(dogsState);
  };

  return usersInfo?.user?.dog ? (
    <div id="tinder-card-page-wrapper">
      {lastDirection ? (
        <Typography
          variant="h6"
          key={lastDirection}
          className="infoText"
          style={{ color: "#f3f0ee", marginTop: 15 }}
        >
          {lastDirection === "left"
            ? "REJECTED!"
            : lastDirection === "up"
            ? "SUPERLIKE!"
            : "LIKED!"}
        </Typography>
      ) : (
        <Typography
          variant="h6"
          className="infoText"
          style={{ color: "#f3f0ee", marginTop: 15 }}
        >
          Swipe left to REJECT, swipe right to LIKE, swipe up to SUPERLIKE
        </Typography>
      )}
      <div className="tinderCards__cardContainer">
        {potentialMatches.map((dog) => (
          <TinderCard
            preventSwipe={["down"]}
            className="swipe"
            key={dog.id}
            onSwipe={(dir) => swiped(dir, dog.id)}
            onCardLeftScreen={() => outOfFrame(dog.id)}
          >
            <Grid container justifyContent="center">
              <DogDisplay
                dog={dog}
                usersInfo={usersInfo}
                showingMatches="false"
                className="card"
              />
            </Grid>
          </TinderCard>
        ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            id="filter-button"
          >
            Filter
          </Button>
        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"show me..."}
            </DialogTitle>
            <DialogContent>
              <div id="radio-buttons">
                <FormControlLabel
                  value="a"
                  control={
                    <Radio
                      checked={value === "a"}
                      onChange={handleFemaleFilter}
                      value="a"
                      name="radio-button-female"
                      inputProps={{ "aria-label": "females only" }}
                    />
                  }
                  label="girl dogs"
                  labelPlacement="top"
                />

                <FormControlLabel
                  value="a"
                  control={
                    <Radio
                      checked={value === "b"}
                      onChange={handleMaleFilter}
                      value="b"
                      name="radio-button-male"
                      inputProps={{ "aria-label": "males only" }}
                    />
                  }
                  label="boy dogs"
                  labelPlacement="top"
                />
                {/* <div> */}
                <Button
                  onClick={() => {
                    setParams({});
                    setValue("");
                  }}
                >
                  clear
                </Button>
                {/* </div> */}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  ) : (
    <Typography
      variant="h6"
      className="infoText"
      style={{ color: "#f3f0ee", marginTop: 15 }}
    >
      You need to create a profile for your dog before you can see potential
      matches!
    </Typography>
  );
};

export default PotentialMatches;
