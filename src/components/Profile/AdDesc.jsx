import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Typography, Grid, TextField, Chip } from "@material-ui/core";
import "./Profile.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    margin: 0,
  },
  chip: {
    background: "#fd2974",
    color: "#f3f0ee",
    fontFamily: "Roboto",
  },
}));

export default function AdDesc(props) {
  const {
    ad_description,
    temperament,
    setTemperament,
    setAdDescription,
    length,
    setLength,
  } = props.oneProps;
  const classes = useStyles();
  const [temporaryTemperament, setTemporaryTemperament] = useState("");

  const handleAdChange = (e) => {
    setLength(e.target.value.length);
    setAdDescription(e.target.value);
  };
  const handleDelete = (chipToDelete) => () => {
    setTemperament((chips) => chips.filter((chip) => chip != chipToDelete));
  };
  const handleTempTemp = (e) => {
    setTemporaryTemperament(e.target.value);
  };
  const handleTemperament = (e) => {
    e.preventDefault();
    setTemperament((temperament) => [
      ...temperament,
      temporaryTemperament[0].toUpperCase() +
        temporaryTemperament.substring(1).toLowerCase(),
    ]);
    setTemporaryTemperament("");
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Description
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Help other users get a feel for your dog!
      </Typography>
      <div style={{ height: 20 }} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            id="adDesc"
            multiline
            label="Describe your dog!"
            fullWidth
            value={ad_description}
            onChange={handleAdChange}
            inputProps={{ maxLength: 200 }}
          />
        </Grid>
      </Grid>
      <div style={{ height: 20 }} />
      <Typography variant="caption">{`${length}/200`} </Typography>
      <div style={{ height: 20 }} />
      <Typography variant="h6" gutterBottom>
        Temperament
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Add some descriptive keywords that describe your dog's temperament
      </Typography>
      <div style={{ height: 20 }} />
      <Grid
        container
        spacing={3}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Grid xs={6}>
          <form
            action="submit"
            style={{ display: "flex" }}
            onSubmit={handleTemperament}
          >
            <TextField
              variant="outlined"
              required
              id="adDesc"
              label="Keyword"
              fullWidth
              value={temporaryTemperament}
              onChange={handleTempTemp}
            />
          </form>
        </Grid>
      </Grid>
      <div style={{ height: 40 }} />
      <div id="chips-wrapper">
        <ul className={classes.root}>
          {temperament.map((temp, i) => {
            return (
              <li key={i} className="chip">
                <Chip
                  label={temp}
                  onDelete={handleDelete(temp)}
                  className={classes.chip}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </React.Fragment>
  );
}
