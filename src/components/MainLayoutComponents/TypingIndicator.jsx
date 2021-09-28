import React, { useState, useEffect } from "react";
import { MoreHoriz} from '@material-ui/icons';
import './layout.css'

const TypingIndicator = (props) => {
const style = {
  position: "relative",
  height: 15,
  right: 30,
  top: 12,
  backgroundColor: 'white',
  borderRadius: 7
}

  return ( 
    <>
      <MoreHoriz style={style} id='typing-indicator'/>
    </>
   );
}
 
export default TypingIndicator;