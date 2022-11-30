import * as React from "react";
import Card from "@mui/material/Card";
import { Link } from "react-router-dom";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  name: {
    fontStyle: "normal",
    fontWeight: "700 !important",
    fontSize: "16px",
    lineHeight: "18px",
    color: "#000000 !important",
    margin: "0 0 16px 0 !important",
  },
  salutations: {
    fontWeight: 400,
    fontSize: "15px !important",
    fontStyle: "normal",
    lineHeight: "18px",
    color: "#000000 !important",
    margin: "0 0 8px 0 !important",
  },
  pics: {
    fontWeight: 400,
    fontSize: "14px !important",
    color: "#50555C !important",
    fontStyle: "normal",
    lineHeight: "18px",
    margin: "0 0 8px 0 !important",
  },

  cardContent: {
    fontFamily: "Inter",
    fontStyle: "normal",
    lineHeight: "18px",
    textAlign: "center",
    padding: "26px !important",
  },
  cardContent_expired: {
    opacity: 0.4,
  },
  Expstatus: {
    height: 24,
    // width: "28%",
    padding: "3px 6px",
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
    marginRight: 10,
    position: "absolute",
    right: "0",
  },
  nostatus: {
    height: 24,
    // width: "28%",
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
    padding: "3px 6px",
    marginRight: 10,
    height: 24,
    // width: "28%",
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
    position: "absolute",
    right: "0",
  },
  topDiv: {
    margin: "2rem 0 0 0",
    xs: { margin: "2rem 0 0 15% !important" },
    padding: "0 20px",
  },
  linkClass: {
    width: "100%",
  },
  imageClass: {
    width: 180,
    height: 180,
    borderRadius: 50,
    // marginLeft: "25%",
    marginTop: "30px",
    filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.25))",
  },
  imgDiv: { textAlign: "-webkit-center" },
  tagDiv: {position:"relative"},
  lastDiv: {textAlign: "-webkit-center",},
  pTag: {    margin: "20px",
    fontWeight: "500",
    fontSize:" 0.9rem",
    color: "#A5A5A5",}

});

export default function ImgMediaCard({ setData }) {
  const classes = useStyles();
  const dataObj = [
    {
      name: "Kit & Joy",
      salutations: "2022.05.20 Wedding of Kit & Jay. Thanks for coming!",
      minPics: 2000,
      maxPics: 3000,
      Expiry: "2022-06-02",
      img: "/images/img_01.jpg",
      status: "",
    },
    {
      name: "Rick & Morty",
      salutations: "Celebrating with our dearest mum and dad",
      minPics: 500,
      maxPics: 3000,
      Expiry: "2022-02-10",
      img: "/images/img_01.jpg",
      status: "Expired",
    },
    {
      name: "Demo Album 1",
      salutations: "Add 50 pictures for free",
      minPics: 10,
      maxPics: 50,
      Expiry: "N/A",
      img: "/images/image3.jpg",
      status: "Demo",
    },
    {
      name: "Demo Album 2",
      salutations: "Add 50 pictures for free",
      minPics: 0,
      maxPics: 50,
      Expiry: "N/A",
      img: "/images/image5.jpg",
      status: "Demo",
    },
  ];
  const cardClicked = (data) => {
    setData(data);
    // props.history.push({
    //   pathname: '/main',
    //   state: data
    //  });
  };
  const disableLink = (e, status) => {
    if (status === "Expired") {
      e.preventDefault();
    }
  };
  return (
    <div className={classes.topDiv}>
      <Grid
        container
        spacing={{ xs: 4, md: 2 }}
        columns={{ xs: 1, sm: 8, md: 12 }}
      >
        {dataObj.map((data, index) => (
          <Grid
            sx={{ display: "flex", justifyContent: "center" }}
            item
            xs={2}
            sm={4}
            md={4}
            key={index}
            onClick={() => cardClicked(data)}
          >
            <Link
              className={classes.linkClass}
              to={{
                pathname: "/main",
              }}
              onClick={(event) => disableLink(event, data.status)}
            >
              <Card
                sx={{
                  maxWidth: "calc(100%-64px) !important",
                  minHeight: 425,
                  textAlign: "center",
                  boxShadow: "2px 2px 4px 1px #00000040",
                }}
              >
                <div className={classes.tagDiv}>
                  {data.status !== "" ? (
                    <div
                      className={
                        data.status === "Expired"
                          ? classes.Expstatus
                          : classes.DemStatus
                      }
                    >
                      <p>{data.status}</p>
                    </div>
                  ) : (
                    <div className={classes.nostatus}>{data.status}</div>
                  )}
                </div>
                <div className={classes.imgDiv}>
                  {" "}
                  <CardMedia
                    className={classes.cardImage}
                    sx={{
                      width: 180,
                      height: 180,
                      borderRadius: 50,
                      // marginLeft: "25%",
                      marginTop: "30px",
                      filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.25))",
                    }}
                    component="img"
                    alt="Image"
                    height="140"
                    image={data.img}
                  />
                </div>
                {/* <img className={classes.imageClass} src={data ? data.img : "/images/img_01.jpg"}/> */}
                <CardContent
                  className={
                    data.status === "Expired"
                      ? classes.cardContent_expired
                      : classes.cardContent
                  }
                >
                  <Typography className={classes.name}>{data.name}</Typography>
                  <Typography
                    color="text.secondary"
                    className={classes.salutations}
                  >
                    {data.salutations}
                  </Typography>
                  <Typography className={classes.pics}>
                    {data.minPics}/ {data.maxPics} photos
                  </Typography>
                  <Typography className={classes.pics}>
                    Expiry: {data.Expiry}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}

      </Grid>
      <div className={classes.lastDiv}>
        {dataObj.length ? (
        <p className={classes.pTag}> No More Album</p>
        ):(
          <p className={classes.pTag}>No Data Found</p>
        )}      
        </div>
    </div>
  );
}
