import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import { Chip, Grid } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import "../Matches/Matches.css";
import distanceBetCoor from "../../functions/distanceBetCoor";
import useWindowDimension from "../customHooks/useWindowDimension";
import { smallImage } from "../_helpers/helpers";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 20,
    height: 600,
    textAlign: "left",
    color: "#514949",
    background: "#f3f0ee",
  },
  media: {
    height: 280,
  },
  chip: {
    backgroundColor: "#514949",
    color: "#f3f0ee",
  },
}));

export default function DogDisplay(props) {
  const { dog, usersInfo } = props;
  const { height, width } = useWindowDimension();
  const classes = useStyles();

  return (
    <Grid
      container
      item
      xs={12}
      style={{ display: "flex", justifyContent: "space-around", padding: 18 }}
    >
      <Card
        key={dog.id}
        className={[classes.root, "matches-card-body"].join(" ")}
        style={{ 
          width: width < 400 ? width - 35 : 375,
          // height: height < 600 ? height - 200 : height < 800 ? height -275 : 500
        }}
      >
        <CardMedia
          className={classes.media}
          image={smallImage(dog.photo_url, 300)}
          title={dog.name}
          // style={{height: height < 800 ? height - 500 : 280}}
        />
        <Typography
          variant="caption"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          {dog.location.lat && usersInfo?.user?.dog?.location?.lat
            ? distanceBetCoor.calcMiles([
                dog.location.lat,
                dog.location.lon,
                usersInfo.user.dog.location.lat,
                usersInfo.user.dog.location.lon,
              ]) < 5
              ? "Less than 5 miles away"
              : `About ${distanceBetCoor.calcMiles([
                  dog.location.lat,
                  dog.location.lon,
                  usersInfo.user.dog.location.lat,
                  usersInfo.user.dog.location.lon,
                ])} miles away`
            : null}
        </Typography>
        <CardContent style={{ overflow: "auto", maxHeight: 320 }}>
          <span id="title">{`${dog.name}, `}</span>
          <span id="subtitle">{dog.is_female ? "female" : "male"}</span>
          <Typography variant="caption" component="p">
            {dog.breed} | Age: {dog.age} | Weight: {dog.weight} lbs
          </Typography>
          <ul className="chips-list">
            {dog.temperament.map((temp, i) => {
              return (
                <li key={i} className="chip">
                  <Chip label={temp} className={classes.chip} />
                </li>
              );
            })}
          </ul>
          <Typography variant="caption" component="p">
            {dog.ad_description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
