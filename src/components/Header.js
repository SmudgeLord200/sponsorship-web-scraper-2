import React from "react";
import "../App.css";
import { Typography } from "@mui/material";

const Header = () => {
  return (
    <Typography
      variant="h3"
      sx={{
        fontFamily: "Londrina Outline",
        textWeight: "bold",
        fontStyle: "normal",
      }}
    >
      Search Sponsors...
    </Typography>
  );
};

export default Header;
