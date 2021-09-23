import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import breeds from "./assets/breedlist";

export default function BasicInfo(props) {
  const {
    name,
    breed,
    age,
    weight,
    is_female,
    creatingProfile,
    setName,
    setBreed,
    setAge,
    setWeight,
    setIsFemale,
    setLocation,
    setTemperament,
  } = props.zeroProps;
  const handleName = (e) => setName(e.target.value);
  const handleBreed = (e) => setBreed(e.target.value);
  const handleAge = (e) => setAge(e.target.value);
  const handleWeight = (e) => setWeight(e.target.value);
  const handleGender = (e) =>
    setIsFemale(e.target.value === "female" ? true : false);

  useEffect(() => {
    if (creatingProfile) {
      if (
        breeds.map((b) => b.name.toLowerCase()).includes(breed.toLowerCase())
      ) {
        //if the breed input is in this big breed list
        const breedFetch = async () => {
          //run this async fetch
          try {
            const breedInfo = await fetch(
              `https://api.thedogapi.com/v1/breeds/${
                breeds.filter(
                  (b) => b.name.toLowerCase() === breed.toLowerCase()
                )[0].id
              }`
            );
            const breedJson = await breedInfo.json();
            console.log(breedJson.temperament.split(","));
            setTemperament(breedJson.temperament.split(","));
          } catch (err) {
            console.error(err);
          }
        };
        breedFetch();
      }
    }
  }, [breed]);
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Basic Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="name"
            name="name"
            label="Name"
            fullWidth
            value={name}
            onChange={handleName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="breed"
            name="breed"
            label="Breed"
            fullWidth
            value={breed}
            onChange={handleBreed}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="age"
            name="age"
            label="Age"
            fullWidth
            value={age}
            type="number"
            onChange={handleAge}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="weight"
            name="weight"
            label="Weight (lbs)"
            fullWidth
            value={weight}
            type="number"
            onChange={handleWeight}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              onChange={handleGender}
              value={is_female ? "female" : "male"}
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
