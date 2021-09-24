import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import MatchDisplay from "./MatchDisplay";
import API_URL from "../_helpers/environment";

const Matches = (props) => {
  const { usersInfo, socket } = props;
  const [superlikeRef, setSuperlikeRef] = useState({});

  const fetchLikes = () => {
    const fetchLikesFetch = async () => {
      try {
        const likesFetch = await fetch(
          `${API_URL}/like/superlikes`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            }),
          }
        );
        const likesJson = await likesFetch.json();
        const superlikeHash = !likesJson.message
          ? likesJson.reduce((a, b) => {
              a[b.liked_dog_id] = b.superlike;
              return a;
            }, {})
          : {};
        setSuperlikeRef(superlikeHash);
      } catch (err) {
        console.error(err);
        alert("There was an error! Please try again");
      }
    };
    fetchLikesFetch();
  };

  useEffect(fetchLikes, [setSuperlikeRef, usersInfo]);
  return (
    <Grid container justifyContent="center">
      {usersInfo?.matches?.length ? (
        [
          ...usersInfo?.matches?.filter(
            (match) => match.user.likes[0].superlike && superlikeRef[match.id]
          ),
          ...usersInfo?.matches?.filter(
            (match) => !match.user.likes[0].superlike || !superlikeRef[match.id]
          ),
        ].map((match) => (
          <MatchDisplay
            dog={match}
            socket={socket}
            usersInfo={usersInfo}
            key={match.id}
            superlikeRef={superlikeRef}
          />
        ))
      ) : (
        <Typography variant="h5" style={{ color: "white" }}>
          No Matches Yet
        </Typography>
      )}
    </Grid>
  );
};

export default Matches;
