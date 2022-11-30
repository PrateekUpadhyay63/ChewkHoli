import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import Home from "./views/home/Home";
import Main from "./views/home/main";
import AppBar from "./components/appBar/AppBar";
import Drawer from "./components/drawer/Drawer";
import "./App.css"

export default function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [data,setData]= React.useState({});
  return (
    <div className="container">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar setMenuOpen={setMenuOpen} />
        <Drawer menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </Box>
      <Router>
        <Routes>
          <Route path="/" element={<Home setData={setData}/>} exact />
          <Route path="/main" element={<Main data={data}/>} />
        </Routes>
      </Router>
    </div>
  );
}
