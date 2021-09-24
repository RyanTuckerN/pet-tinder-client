import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import BasicInfo from "./BasicInfo";
import AdDesc from "./AdDesc";
import ImageUpload from "./ImageUpload";
import Review from "./Review";
import { useHistory } from "react-router-dom";
import API_URL from "../_helpers/environment";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
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
  stepper: {
    padding: theme.spacing(3, 0, 5),
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

const steps = ["Basic information", "Description", "Image Upload", "Review"];

function getStepContent(step, props) {
  const { zero, one, two, three } = props;
  switch (step) {
    case 0:
      return <BasicInfo zeroProps={zero} />;
    case 1:
      return <AdDesc oneProps={one} />;
    case 2:
      return <ImageUpload twoProps={two} />;
    case 3:
      return <Review threeProps={three} />;
    default:
      throw new Error("Unknown step");
  }
}

export default function CreateProfile(props) {
  const { socket, usersInfo } = props;
  const classes = useStyles();
  const history = useHistory();
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState("Rufus");
  const [photo_url, setPhoto_url] = useState(
    "https://images.unsplash.com/photo-1491604612772-6853927639ef?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGRvZ3N8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
  );
  const [breed, setBreed] = useState("Husky");
  const [weight, setWeight] = useState(45);
  const [age, setAge] = useState(4);
  const [ad_description, setAdDescription] = useState(
    "Rufus is awesome, we love him!"
  );
  const [length, setLength] = useState(ad_description.length);
  const [temperament, setTemperament] = useState([
    "Playful",
    "Energetic",
    "Loyal",
  ]);
  const [is_female, setIsFemale] = useState(false);
  const [location, setLocation] = useState({});

  const properizeNoun = (str) =>
  str
    .split(" ")
    .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

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

  const getRandomDogPhoto = () => {
    const randomPhotoFetch = async () => {
      try {
        const photoFetch = await fetch(
          "https://dog.ceo/api/breeds/image/random"
        );
        const json = await photoFetch.json();
        if (json.status === "success") setPhoto_url(json.message);
      } catch (err) {
        console.error(err);
      }
    };
    randomPhotoFetch();
  };
  const getBreedList = () => {
    const breedListFetch = async () => {
      try {
        const listFetch = await fetch("https://dog.ceo/api/breeds/list/all");
        const json = await listFetch.json();
        const breedArray = Object.keys(json.message);
        setBreed(properizeNoun(breedArray[Math.floor(Math.random() * breedArray.length - 1)]));
      } catch (err) {
        console.error(err);
      }
    };
    breedListFetch();
  };

  useEffect(getRandomDogPhoto, []);
  useEffect(getBreedList, []);
  useEffect(() => {
    if (!usersInfo?.user?.dog?.location.lat || !usersInfo?.user?.dog) {
      getLocation();
    }
  }, []);
  useEffect(()=>{
    setAdDescription(`${name} is awesome, we love ${is_female ? 'her' : 'him' }.`)
  },[name, is_female])

  const creatingProfile = true;
  const stepperProps = {
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
      setTemperament,
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
      breed,
      weight,
      age,
      ad_description,
      temperament,
      is_female,
      location,
    },
  };

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);
  const handleSubmit = async () => {
    try {
      const fetchResults = await fetch(`${API_URL}/dog/`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        }),
        body: JSON.stringify(stepperProps.three),
      });
      const json = await fetchResults.json();
      // console.log("response@!!->>", json);
      alert("Thank you for creating a profile! Enjoy Pet Tinder!");
      socket.emit("newLogin", usersInfo?.user?.id);
      handleNext();
    } catch (err) {
      console.error(err);
      alert("There was an error! Please try again.");
    }
  };

  return (
    <>
      <CssBaseline />
      <section className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Setup your 🐕's profile
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <>
            {activeStep === steps.length ? (
              <>
                <Typography variant="h5" gutterBottom>
                  Thank you for creating a profile!
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Enjoy Pet Tinder!
                </Typography>
                <Typography variant="subtitle2">
                  <Button onClick={() => history.push("/potentialmatches")}>
                    Click here to get started
                  </Button>
                </Typography>
              </>
            ) : (
              <>
                {getStepContent(activeStep, stepperProps)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      {activeStep === steps.length - 1
                        ? "Yes, I need to change something"
                        : "Back"}
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={
                      activeStep === steps.length - 1
                        ? handleSubmit
                        : handleNext
                    }
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? "No, submit!" : "Next"}
                  </Button>
                </div>
              </>
            )}
          </>
        </Paper>
      </section>
    </>
  );
}
