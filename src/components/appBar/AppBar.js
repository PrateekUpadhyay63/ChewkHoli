import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { AppBar as MUIAppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FMLogo from "../../assets/images/FM Logo.svg";
import "../../App.css"
import { padding } from "@material-ui/system";
const AppBar = ({ setMenuOpen }) => {
  return (
    <MUIAppBar
      sx={{ backgroundColor: "white", boxShadow: "none"}}
      position="static"
    >
      <Toolbar sx={{paddingRight: "0 !important"}}>
        <Typography
          covariant="h6"
          component="div"
          sx={{ flexGrow: 1, color: "black", margin:"30px 0 7px 0" }}
        >
          <img className="mainLogo" src={FMLogo} alt="logo" />
        </Typography>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 0, color: "black" , padding: "12px 17px 12px 12px" }}
          onClick={(e) => setMenuOpen(true)}
        >
          <MoreHorizIcon />
        </IconButton>
      </Toolbar>
    </MUIAppBar>
  );
};

export default AppBar;
