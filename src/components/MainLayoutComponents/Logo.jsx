import React from "react";
import { smallImage } from "../_helpers/helpers";
import PetTinderLogo from "./assets/PetTinderLogo.png";

const Logo = () => {
  const image = {
    height: "100%",
    filter: 'contrast(5) drop-shadow(1px 1px rgba(0, 0, 0, 0.514))'
  };

  const div = {
    height: 50,
  };

  return (
    <div style={div}>
      <img style={image} src={smallImage(PetTinderLogo)} alt="Pet Tinder Logo" />
    </div>
  );
};

export default Logo;
