import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import CloseIcon from "@mui/icons-material/Close";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { MENU_ICONS } from "../../constants";
import "../footer/footer.css"
const Drawer = ({ menuOpen, setMenuOpen }) => {
  const list = () => (
    <Box
      sx={{
        anchor: "right",
        height: "150vh",
        width: "60vw",
        background: "linear-gradient(180deg, #FF06C5 0%, #F5471D 100%)",
      }}
   
      role="presentation"
      onClick={() => setMenuOpen(false)}
      onKeyDown={() => setMenuOpen(false)}
    >
      <Typography
        sx={{ color: "white", my: 4, mx: 1, float: "right", cursor: "pointer" }}
        onClick={() => setMenuOpen(false)}
      >
        <CloseIcon />
      </Typography>
      <Typography
        sx={{
          fontFamaliy: "Inter",
          fontWeight: "700",
          color: "white",
          fontSize:15,
          mt: 10,
          mb: 3,
          mx: 3
        }}
      >
        Brandon Li
      </Typography>
      <List>
        {MENU_ICONS.map((icon, index) => (
          <div  key={index}>
            <ListItem disablePadding>
              <ListItemButton sx={{ ml: 2, my: 1 }}>
                <img className="iconClass" src={icon["iconName"]} alt={icon["label"]} />
                <ListItemText
                  sx={{
                    fontFamaliy: "Inter",
                    fontWeight: "400",
                    ml: 1,
                    color: "white",
                    fontSize: "15px !important"
                  }}
                  primary={icon["label"]}
                />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ backgroundColor: "white" }} />
          </div>
        ))}
      </List>
      <Typography
        sx={{
          verticalAlign: "bottom",
          color: "white",
          fontFamily: "Roboto",
          bottom: 0,
          fontSize: "12px",
          fontWeigth: "700 !important",
          ml: 4,
          // marginTop:"18vh",
          position: "absolute",
          bottom: "1rem",
        }}
      >
        Powered by Facesmoment.com
      </Typography>
    </Box>
  );
  return (
    <SwipeableDrawer
      anchor="right"
      open={menuOpen}
      onClose={() => setMenuOpen(false)}
      onOpen={() => setMenuOpen(true)}
    >
      {list()}
    </SwipeableDrawer>
  );
};

export default Drawer;
