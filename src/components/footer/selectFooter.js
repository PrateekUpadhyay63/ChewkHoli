import * as React from "react";
import { Paper, Container, Box } from "@mui/material";
import "./footer.css";
import selectBtn from "../../assets/images/charm_square-ticksqTick.svg";
import selectAllBtn from "../../assets/images/selectFooterIcons/selectAllBtn.svg";
import Buttoncancel from "../../assets/images/selectFooterIcons/Buttoncancel.svg";
import deleteBtn from "../../assets/images/selectFooterIcons/deleteBtn.svg";
import downloadBtn from "../../assets/images/selectFooterIcons/downloadBtn.svg";
export default function SelectFooter(props) {

  function selectAll(){
    console.log(props.checkAll)
    props.isCheckall(!props.checkAll)
  }
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
                margin:"0.3rem 0 0 0"
            }}
          >
            <div className="selectDiv">
            <img className="imgSelectClass" src={selectBtn} alt="logo"/>
            <p className="selectedTxt">{props.isChecked}</p>
            </div>

            <div onClick={selectAll}>
            <img  className="imgClass" src={selectAllBtn} alt="logo"/>
            </div>

            <div>
            <img className="imgClass" src={downloadBtn} alt="logo"/>
            </div>

            <div>
            <img className="imgClass" src={deleteBtn} alt="logo"/>
            </div>

            <div>
            <img className="imgClass" src={Buttoncancel} onClick={()=>{props.setSelected(false); props.setChecked(0)}} alt="logo"/>
            </div>
          </Box>
        </Container>
<div className="footerDiv"></div>
      </Paper>
    </>
  );
}
