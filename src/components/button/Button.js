import React from "react";
import { Button as MUIButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Button = ({ style, label }) => {
  return (
    <div>
      <MUIButton variant="contained" sx={style}>
        <AddIcon sx={{ pr: "8px" ,fontSize: "1.74rem" }} />
        {label}
      </MUIButton>
    </div>
  );
};

export default Button;
