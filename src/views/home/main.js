import React from "react";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import Footer from "../../components/footer/footer";
import SelectFooter from "../../components/footer/selectFooter";
import Checkbox from "@mui/material/Checkbox";
import CircleIcon from "@mui/icons-material/Circle";
import DoneIcon from '@mui/icons-material/Done';
import { ImageListItem } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import "./main.css"
const useStyles = makeStyles({
  cardImage: {},
  name: {
    fontStyle: "normal",
    fontWeight: "700 !important",
    fontSize: "16px",
    lineHeight: "18px",
    color: "#000000 !important",
    margin: "0 0 10px 0 !important",
  },
  salutations: {
    fontWeight: 400,
    fontSize: "14px !important",
    textAlign: "justify",
    color: "#000000 !important",
  },
  pics: {
    fontWeight: 400,
    fontSize: "14px",
    color: "#50555C",
  },

  cardContent: {
    fontFamily: "Inter",
    fontStyle: "normal",
    lineHeight: "18px",
    textAlign: "justify",
  },
  cardContent_expired: {
    opacity: 0.4,
  },
  Expstatus: {
    height: 24,
    width: "28%",
    float: "right",
    marginTop: 18,
    background: "linear-gradient(90deg, #A5A5A5 0%, #50555C 100%)",
    borderRadius: 2,
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 2,
    textAlign: "center",
    color: "white",
  },
  textDiv: {
    padding: "0 5%",
    textAlign:"justify"
  },
  nostatus: {
    height: 24,
    width: "40% !important",
    float: "right",
    marginTop: 18,
    borderRadius: 2,
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 2,
    textAlign: "center",
    color: "white",
  },
  DemStatus: {
    height: 24,
    width: "28%",
    float: "right",
    marginTop: 18,
    background:
      "linear-gradient(90deg, #FF06C5 0%, #FE0CB5 9.91%, #F5471D 101.97%)",
    borderRadius: 2,
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 2,
    textAlign: "center",
    color: "white",
  },
  checkBox: {
    fontSize: "40px !important",
    color: "white",
  },
  selectedBox: {
    fontSize: "32px !important",
    color: "#FF06C5",
    border: "none",
    backgroundColor: "white",
    borderRadius: "50px",
    margin: "4px 3px 0 0",
  },
  mainSpan: {
    position: "absolute",
    right:"0",
  },
  error: {
    color: "#f00",
  },
  cardDiv:{},
  mainDiv:{
    padding:"0 10px"
  },
  cardClass:{
    maxWidth: "100%",
    minHeight: "100%",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    boxShadow: "none !important",
    margin: "1rem 0 1.5rem 0",
  },
  footerClass:{
    border: "none",
    outline:"none",
    boxShadow:"none"
  }

});

const Main = ({ data }) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(1);
  const [isLoading, setLoading] = React.useState(false);
  const [pics, setPics] = React.useState([]);
  const [error, setError] = React.useState("");
  const [selected, setSelected] = React.useState(false);
  const [isChecked,setChecked]= React.useState(0);
  const [checkAll, isCheckall]= React.useState(false);
  React.useEffect(() => {
    getPics();
  },[]);

  window.onscroll = () => {
    let count =0;
    let url = window.location.href;
    let page=  url.split("/").pop()
    if (
      Math.ceil(window.scrollY) >
      (document.body.clientHeight - window.outerHeight)*4/5
    ) {
      if(count=== 0 && page ==="main"){
      handleScroll();}
      count +=1;
    }
    count= 0;
  };
  const handleScroll = () => {
    setPage(page + 1);
    getPics();
  };

  async function getPics() {
    
    setLoading(true);
    setError("");
    // let keyArr =["8AZrPTNWRojnY4x0pCGR60oNBnA2I0OeXpXOKBi3ivs","RigOnEYj8TJ336N7oYvhenhxogTNN5g1-vCH-sIT-So","Ht7Z8HdR4-F4sZPKxQK4fGpW0rDbAbhW0KFKd5-Vi6k","Gfc0M21XCATENQyjK-3YFxYyreKlVNjKk5LI-o6OG90" ,"QMfjNLv4NBfnbkaLsgbzBxc9eUvMbvMKWY8Ly7apiqA", "pudNu2_xOrbF348wRMjAGgFsMnHtWnZETDzUIgutgSk","rUaaXn5eHmjF88-PcaGXtmVFFu_gwgTmVCCIH6VlSRM","Ht7Z8HdR4-F4sZPKxQK4fGpW0rDbAbhW0KFKd5-Vi6k" ,"uodbSPL7Xhx9mMKp8EfwvTGFOS-HcaU7vtJzhJs7-dg"]
    let key= "Ht7Z8HdR4-F4sZPKxQK4fGpW0rDbAbhW0KFKd5-Vi6k";
  
    const url = `https://api.unsplash.com/photos?client_id=${key}&page=${page}&per_page=15&timestamp=${new Date().getTime()}`;
    axios
      .get(url)
      .then((response) => {
        setPics([...pics, ...response.data]);
        setLoading(false);
      })
      .catch((e) => {
        setError("Rate Limit Exceed");
        setLoading(false);
      });
  }

  function ChangeCheckBox(e){
    let checked = e.target.checked;
    e.target.checked=true
    if (checked) {
      setChecked(isChecked+1);
    } else {
      setChecked(isChecked-1);
    }
  }

  return (
    <div>
    <div className={classes.mainDiv}>
      <Card
      className={classes.cardClass}
      >
        <CardMedia
          className={classes.cardImage}
          sx={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginLeft: "2%",
          }}
          lg={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginLeft: "22%",
          }}
          component="img"
          alt="Image"
          height="140"
          image={data.img}
        />
        <div className={classes.textDiv}>
          <Typography className={classes.name}>{data.name}</Typography>
          <Typography color="text.secondary" className={classes.salutations}>
            {data.salutations}
          </Typography>
        </div>
      </Card>

      {/* <ImageList
        variant="quilted"
        sx={{
          columnCount: {
            xs: "2 !important",
            sm: "2 !important",
            md: "3 !important",
            lg: "4 !important",
            xl: "5 !important",
          },
        }}
        gap={8}
      > */}
      <ResponsiveMasonry
                columnsCountBreakPoints={{5:1 ,350: 2, 750: 2, 900: 3, 1200:4, 1600:5}}
                className={classes.cardDiv}
                >
        <Masonry gutter="10px">
        {!!pics && pics.length
          ? pics.map((data, index) => {
            {console.log(checkAll,"all")}
            return (
              <ImageListItem key={index}>
                {selected ? (
                  <div className={classes.mainSpan}>
                    <Checkbox
                      icon={<CircleIcon className={classes.checkBox} />}
                      defaultChecked = {checkAll}
                      // defaultChecked= {false}
                      onChange={(e)=>ChangeCheckBox(e)}
                      checkedIcon={
                        <DoneIcon
                        className={classes.selectedBox}
                        />
                      }
                    />
                  </div>
                ) : (
                  ""
                )}
                <img src={data?.urls.thumb} alt="image_1" style={{
                  opacity: isLoading ? 0.5 : 1,
                  transition: "opacity .35s linear"
                }} />
              </ImageListItem>
            
            );
          })
          : null}
      {/* </ImageList> */}
      </Masonry>
      </ResponsiveMasonry>
      {isLoading ? <CircularProgress /> : ""}
      {error && <div className={classes.error}>Rate Limit Exceeded</div>}

    </div>
      {!selected ? (
        <Footer className={classes.footerClass} selected={selected} setSelected={setSelected} />
      ) : (
        <SelectFooter className={classes.footerClass} setSelected={setSelected} isChecked={isChecked} setChecked={setChecked} isCheckall= {isCheckall} checkAll={checkAll}/>
      )}
    </div>
  );
};

export default Main;
