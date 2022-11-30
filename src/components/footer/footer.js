import * as React from "react";
import { Paper, Container, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// import "./footer.css";
import Buttonselect from "../../assets/images/Buttonselect.svg";
import faceSearch from "../../assets/images/Face_Search.svg";
// import "../footer/footer.css";

export default function Footer(props) {
  return (
    <>
      <Paper
        sx={{
          marginTop: "calc(10% + 60px)",
          width: "100%",
          position: "fixed",
          bottom: 0,
          border:"none !important",
        }}
        component="footer"
        square
        variant="outlined"
      >
        <Container maxWidth="lg">
          <Box
            sx={{
                flexGrow: 1,
                justifyContent: "space-evenly",
                display: "flex",
                margin:"0.5rem 0 0 10px"
            }}
          >
            <div>
            <img className="imgClass marginLF" src={Buttonselect} onClick={()=>props.setSelected(true)} alt="logo"/>
            </div>
            <div className="addClass">
              <AddIcon
                sx={{
                    color:"white",
                  background:
                    "linear-gradient(90deg, #FF06C5 0%, #FE0CB5 9.91%, #F5471D 101.97%)",
                    padding: "10px 25px",
                    borderRadius: "6px",
                    border: "2px solid #F8F8F8",
                }}
              />
            </div>
            <div>
            <img className="imgClass" src={faceSearch} alt="logo"/>
            </div>
          </Box>
        </Container>
<div className="footerDiv" style={{height : '10px', background : 'linear-gradient(90deg, #FF06C5 0%, #FE0CB6 9.91%, #F5471D 101.97%)'}}></div>

      </Paper>

    </>
  );
}
