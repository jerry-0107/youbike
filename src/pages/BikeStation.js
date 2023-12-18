import * as React from 'react'
import { TopAppBar } from '../TopBar';
import getData from '../getData';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Autocomplete, TextField, Button } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { AppBar, Toolbar } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Divider from '@mui/material/Divider';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';



export default function BikeStation() {
  const [pageTitle, setPageTitle] = React.useState("loading")
  const [bikeStationCardTitle, setBikeStationCardTitle] = React.useState()
  const [bikeStationCardSubTitle, setBikeStationCardSubTitle] = React.useState()
  const [bikeStationCardBody, setBikeStationCardBody] = React.useState()
  const [bikeData, setBikeData] = React.useState({ SrcUpdateTime: "NULL" })
  const [bikeStationData, setBikeStationData] = React.useState()
  const [topbar, setTopbar] = React.useState(<></>)
  const [progress, setProgress] = React.useState(0);
  const [stationID, setStationID] = React.useState()
  const [countdown, setCountdown] = React.useState(60)
  var locXY = []
  const [transferTab, setTransferTab] = React.useState(<><center><CircularProgress size="2rem" /><br />資料讀取中</center></>)
  function UrlParam(name) {
    var url = new URL(window.location.href),
      result = url.searchParams.get(name);
    return result
  }
  const [open, setOpen] = React.useState(false);


  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 1,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
    ...theme
  }));

  const handleClose = () => {
    setOpen(false);
  };

  function recordRecentData(data) {
    var recentData = JSON.parse(localStorage.getItem("recentData"))
    if (recentData[0]) {
      var oldData = (recentData)
      oldData.push(data)
      localStorage.setItem("recentData", JSON.stringify(oldData))
    } else {
      var newData = JSON.stringify([data])
      localStorage.setItem("recentData", (newData))
    }
  }

  const greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  function getBikeData() {
    getData(
      `https://tdx.transportdata.tw/api/advanced/v2/Bike/Availability/NearBy?%24spatialFilter=nearby%28${UrlParam("lon")}%2C%20${UrlParam("lat")}%2C%201%29&%24format=JSON&top=1`,
      (res2) => { setBikeData(res2) },
      (...errors) => { setOpen(true); console.log(errors) })
  }

  React.useEffect(() => {
    if (!UrlParam("lat") || !UrlParam("lon")) {// || !UrlParam("uid")) {
      setTopbar(<TopAppBar title={"找不到站點"} />)
      setBikeStationCardTitle("找不到站點")
      setBikeStationCardSubTitle("網址無效")
      setTransferTab("資料讀取失敗")
      setCountdown(-1)
    }
    else {
      getData(
        `https://tdx.transportdata.tw/api/advanced/v2/Bike/Station/NearBy?%24spatialFilter=nearby%28${UrlParam("lon")}%2C%20${UrlParam("lat")}%2C%201%29&%24format=JSON&top=1`,
        (res) => {
          if (res.length) {
            recordRecentData({ StationName: res[0].StationName.Zh_tw.replace("_", " "), StationPosition: [UrlParam("lon"), UrlParam("lat")] })

            setBikeStationData(res)
            setTopbar(<TopAppBar title={res[0].StationName.Zh_tw.replace("_", " ")} />)
            setBikeStationCardTitle(res[0].StationName.Zh_tw.replace("_", " "))
            setBikeStationCardSubTitle(<></>)
          } else {
            setCountdown(-1)
            setTopbar(<TopAppBar title={"找不到站點"} />)
            setBikeStationCardTitle("找不到站點")
            setBikeStationCardSubTitle("請檢查輸入")
            setTransferTab("資料讀取失敗")
          }

        },)
      getBikeData()
    }
  }, [])

  React.useEffect(() => {
    if (countdown === 0) {
      getBikeData()
      setCountdown(60)
    } else if (countdown > 0) {
      setProgress((60 - countdown) * (100 / 60))
    } else {

    }
  }, [countdown]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };

  }, []);

  React.useEffect(() => {
    if (bikeData && bikeStationData) {
      var res = bikeStationData
      console.log(res, bikeData)
      if (res.length === 0) {
        setCountdown(-1)
        setTopbar(<TopAppBar title={"找不到站點"} />)
        setBikeStationCardTitle("找不到站點")
        setBikeStationCardSubTitle("請檢查輸入")
        setTransferTab("資料讀取失敗")
      } else if (bikeData.length > 0 && bikeStationData.length > 0) {

        if (bikeData[0].ServiceStatus === 0) {
          setBikeStationCardSubTitle(<Chip color="error" label="停止營運" />)
          setCountdown(-1)
        } else if (bikeData[0].ServiceStatus === 1) {
          //正常
          if (bikeData[0].AvailableRentBikes === 0) {
            setBikeStationCardSubTitle(<Chip color="warning" label="無車可借" />)
          } else if (bikeData[0].AvailableReturnBikes === 0) {
            setBikeStationCardSubTitle(<Chip color="warning" label="車位滿載" />)
          } else {
            setBikeStationCardSubTitle(<Chip color="success" label="正常借還" />)
          }
        }
        else {
          setBikeStationCardSubTitle(<Chip color="error" label="暫停營運" />)
          setCountdown(-1)
        }


        setBikeStationCardBody(
          <>
            <LocationOnIcon sx={{ verticalAlign: "bottom" }} />{res[0].StationAddress.Zh_tw}
            <p></p>
            <MapContainer
              dragging={!L.Browser.mobile}
              scrollWheelZoom={false}
              center={[res[0].StationPosition.PositionLat, res[0].StationPosition.PositionLon]}
              zoom={18}
              style={{ width: "100%", height: "35vh" }}
            >
              <TileLayer
                attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors${L.Browser.mobile ? "<br/>使用兩指移動與縮放地圖" : ""}`}
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[res[0].StationPosition.PositionLat, res[0].StationPosition.PositionLon]}
                icon={greenIcon}
              >
                <Popup>{res[0].StationName.Zh_tw.replace("_", " ")}</Popup>
              </Marker>
            </MapContainer>
            <p></p>

            <Box sx={{
              display: "flex", justifyContent: "space-between", mt: 2
            }}
              component="div">
              <div style={{ textAlign: "center", flexGrow: "1" }}>
                <img src='/youbike/Youbike2.0.svg' style={{ height: "2.5em" }} alt='可借車輛' /><br />一般<br />
                <Typography component="div" sx={{ fontSize: "2.5em", m: 0, p: 1, height: "100%" }}>
                  {bikeData.StationUID === "" ? <CircularProgress size={"1rem"} /> :
                    <>{
                      bikeData[0].AvailableRentBikesDetail.GeneralBikes < 1 ? <span style={{ color: "red" }}>{bikeData[0].AvailableRentBikesDetail.GeneralBikes}</span> : bikeData[0].AvailableRentBikesDetail.GeneralBikes
                    }</>}</Typography>
              </div>

              <Divider component="div" orientation="vertical" variant="middle" flexItem />
              {bikeData[0].AvailableRentBikesDetail.ElectricBikes > 0 ? <>
                <div style={{ textAlign: "center", flexGrow: "1" }}>
                  <img src='/youbike/Youbike2.0E.svg' style={{ height: "2.5em" }} alt='2.0E可借車輛' /><br />電輔<br />
                  <Typography component="div" sx={{ fontSize: "2.5em", m: 0, p: 1 }}>
                    {bikeData.StationUID === "" ? <CircularProgress size={"1rem"} /> :
                      <>{bikeData[0].AvailableRentBikesDetail.ElectricBikes}</>}</Typography>
                </div>
                <Divider component="div" orientation="vertical" variant="middle" flexItem />
              </> : <></>}
              <div style={{ textAlign: "center", flexGrow: "1" }}>
                <img src='/youbike/2.0-dock.svg' style={{ height: "2.5em" }} alt='可還空位' /><br />空位<br />
                <Typography component="div" sx={{ fontSize: "2.5em", m: 0, p: 1 }}>
                  {bikeData.StationUID === "" ? <CircularProgress size={"1rem"} /> :
                    bikeData[0].AvailableReturnBikes < 1 ? <span style={{ color: "red" }}>{bikeData[0].AvailableReturnBikes}</span> : bikeData[0].AvailableReturnBikes}</Typography></div>
            </Box>
            <p>最後更新: {dayjs(bikeData.SrcUpdateTime).format("HH:mm:ss")}</p>
          </>)
      } else {
        // alert("page load failed")
      }
    }
  }, [bikeData, bikeStationData])



  return (
    <>
      {topbar}
      <Box sx={{ m: 0, p: 3 }}>
        <Card sx={{ mt: 0, pt: 0 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #ffef00,#fff647)" }} variant='div' ></Typography>
              {bikeStationCardTitle}

            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {bikeStationCardSubTitle}
            </Typography>
            <Typography variant="body2" component="div">
              {bikeStationCardBody}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <AppBar position="fixed" color="secondary" sx={{ top: 'auto', bottom: 0, height: 'auto', display: (countdown < 0 ? "none" : "unset") }} >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <BoltIcon sx={{ verticalAlign: 'middle' }} /> 即時車位資料 | {countdown}秒後更新
            <Box sx={{ width: '100%' }}>
              <LinearProgress value={progress} variant="determinate" />
            </Box>
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />


      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"發生錯誤，無法更新資料"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            更新 即時車位資料 時出錯<br />
            我們將持續嘗試更新資料<br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}