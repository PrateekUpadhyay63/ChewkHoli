import React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Button from "../button/Button";
import "./SearchSection.scss"
const SearchSection = () => {
  return (
    <div className="section-container">
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "90%",
          background: "#F3F3F3",
          boxShadow: "none",
          margin: "0 20px !important",
          
        }}
      >
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search-icon">
          <img src="/searchIcon.svg" alt="search"/>
        </IconButton>
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            background: "#F3F3F3",
            borderRadius: "6px",
            height: "40px",
            border: "none",
            color:"#50555C",
            caretColor:"#000000de !important"
          }}
          id="searchInput"
          className="inputClass"
          placeholder="Search"
          inputProps={{ "aria-label": "search" }}
        />
      </Paper>
      <Button
        style={{
          background:
            "linear-gradient(90deg, #FF06C5 0%, #FE0CB5 9.91%, #F5471D 101.97%)",
          color: "white",
          height: 48,
          FontFamily: "Inter",
          margin:"0 18px 0 0",
          textTransform:"Capitalize",
          fontSize: 16,

        }}
        label="Create"
      />
    </div>
  );
};

export default SearchSection;
