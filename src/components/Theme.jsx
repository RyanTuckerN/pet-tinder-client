import { createTheme } from "@material-ui/core";

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#251f1f",
    },
    secondary: {
      main: "#fd2974",
      light: "#ff5864",
      dark: "#ff655b",
    },
    background: {
      default: "#f3f0ee",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Fira Sans",
    h1: {
      fontSize: "4rem",
      fontWeight: 400,
    },
    h2: {
      fontFamily: "Fira Sans",
      fontSize: "3.4rem",
    },
    h5: {
      fontFamily: "Fira Sans",
    },
    h4: {
      fontFamily: "Fira Sans",
    },
    h6: {
      fontFamily: "Fira Sans",
    },
    subtitle1: {
      fontFamily: "Ubuntu",
    },
    subtitle2: {
      fontFamily: "Ubuntu",
    },
    body1: {
      fontFamily: "Ubuntu",
      fontSize: ".75rem",
    },
    body2: {
      fontFamily: "Ubuntu",
    },
    button: {
      fontFamily: "Ubuntu",
    },
    caption: {
      fontFamily: "Ubuntu",
    },
    overline: {
      fontFamily: "Ubuntu",
    },
  },
});

export default theme;
