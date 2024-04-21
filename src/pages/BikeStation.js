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
import { YouBikeImage } from '../youbikeImage';
import FavoriteBtn from '../favoriteBtn';

export default function BikeStation() {
  const [pageTitle, setPageTitle] = React.useState("loading")
  const [bikeStationCardTitle, setBikeStationCardTitle] = React.useState()
  const [bikeStationCardSubTitle, setBikeStationCardSubTitle] = React.useState()
  const [bikeStationCardBody, setBikeStationCardBody] = React.useState()
  const [bikeData, setBikeData] = React.useState({ SrcUpdateTime: "NULL" })
  const [bikeStationData, setBikeStationData] = React.useState()
  const [topbarTitle, setTopbarTitle] = React.useState("Loading...")
  const [progress, setProgress] = React.useState(0);
  const [stationID, setStationID] = React.useState()
  const [countdown, setCountdown] = React.useState(60)
  const [isLoading, setIsLoading] = React.useState(false)

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
    if (recentData) {
      if (recentData.length > 99) {
        recentData.reverse().pop()
        recentData.reverse()
      }
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

  function getCityName(stationUID) {

    var cityCode = stationUID.slice(0, 3)
    var citys = ["Taichung", "Hsinchu", "MiaoliCounty", "NewTaipei", "PingtungCounty", "KinmenCounty", "Taoyuan", "Taipei", "Kaohsiung", "Tainan", "Chiayi", "HsinchuCounty"]
    var codes = ["TXG", "HSZ", "MIA", "NWT", "PIF", "KIN", "TAO", "TPE", "KHH", "TNN", "CYI", "HSQ"]
    return (citys[codes.indexOf(cityCode)])
  }

  function getBikeData() {
    setIsLoading(true)
    getData(
      `https://tdx.transportdata.tw/api/basic/v2/Bike/Availability/City/${getCityName(UrlParam("uid"))}?%24filter=StationUID%20eq%20%27${UrlParam("uid")}%27&%24format=JSON`,
      (res2) => { setBikeData(res2); setIsLoading(false) },
      (...errors) => { setOpen(true); console.log(errors); setIsLoading(false) })
  }

  function BikeDataDisplay({ data }) {
    //計算可借車輛，並回傳處理過的JSX 組件 
    return (
      <Box sx={{
        display: "flex", justifyContent: "space-between", mt: 2
      }}
        component="div">
        <div style={{ textAlign: "center", flexGrow: "1" }}>
          <YouBikeImage src='/youbike/YouBike2.0.svg' style={{ height: "2.5em" }} alt='可借車輛' /><br />一般<br />
          <Typography component="div" sx={{ fontSize: "2.5em", m: 0, p: 1, height: "100%" }}>
            {data.StationUID === "" ? <CircularProgress size={"1rem"} /> :
              <>{
                data[0].AvailableRentBikesDetail.GeneralBikes < 1 ? <span style={{ color: "red" }}>{data[0].AvailableRentBikesDetail.GeneralBikes}</span> : data[0].AvailableRentBikesDetail.GeneralBikes
              }</>}</Typography>
        </div>

        <Divider component="div" orientation="vertical" variant="middle" flexItem />
        {data[0].AvailableRentBikesDetail.ElectricBikes > 0 ? <>
          <div style={{ textAlign: "center", flexGrow: "1" }}>
            <YouBikeImage src='/youbike/YouBike2.0E.svg' style={{ height: "2.5em" }} alt='2.0E可借車輛' /><br />電輔<br />
            <Typography component="div" sx={{ fontSize: "2.5em", m: 0, p: 1 }}>
              {data.StationUID === "" ? <CircularProgress size={"1rem"} /> :
                <>{data[0].AvailableRentBikesDetail.ElectricBikes}</>}</Typography>
          </div>
          <Divider component="div" orientation="vertical" variant="middle" flexItem />
        </> : <></>}
        <div style={{ textAlign: "center", flexGrow: "1" }}>
          <YouBikeImage src='/youbike/2.0-dock.svg' style={{ height: "2.5em" }} alt='可還空位' /><br />空位<br />
          <Typography component="div" sx={{ fontSize: "2.5em", m: 0, p: 1 }}>
            {data.StationUID === "" ? <CircularProgress size={"1rem"} /> :
              data[0].AvailableReturnBikes < 1 ? <span style={{ color: "red" }}>{data[0].AvailableReturnBikes}</span> : data[0].AvailableReturnBikes}</Typography></div>
      </Box>
    )
  }


  function setSubtitleAndChip(data) {
    if (data[0].ServiceStatus === 0) {
      setBikeStationCardSubTitle(<Chip color="error" label="停止營運" />)
      setCountdown(-1)
    } else if (data[0].ServiceStatus === 1) {
      //正常
      if (data[0].AvailableRentBikes === 0) {
        setBikeStationCardSubTitle(<Chip color="warning" label="無車可借" />)
      } else if (data[0].AvailableReturnBikes === 0) {
        setBikeStationCardSubTitle(<Chip color="warning" label="車位滿載" />)
      } else {
        setBikeStationCardSubTitle(<Chip color="success" label="正常借還" />)
      }
    }
    else {
      setBikeStationCardSubTitle(<Chip color="error" label="暫停營運" />)
      setCountdown(-1)
    }
  }



  React.useEffect(() => {
    if (!UrlParam("uid")) {
      setTopbarTitle("找不到站點")
      setBikeStationCardTitle("找不到站點")
      setBikeStationCardSubTitle("網址無效")
      setCountdown(-1)
    }
    else {
      setIsLoading(true)
      getData(
        `https://tdx.transportdata.tw/api/basic/v2/Bike/Station/City/${getCityName(UrlParam("uid"))}?%24filter=StationUID%20eq%20%27${UrlParam("uid")}%27&%24format=JSON`,
        (res) => {
          setIsLoading(false)
          if (res.length) {
            recordRecentData({ StationName: res[0].StationName.Zh_tw.replace("_", " "), uid: UrlParam("uid") })
            setBikeStationData(res)
            setTopbarTitle(<><FavoriteBtn stationName={res[0].StationName.Zh_tw} stationUID={UrlParam("uid")} /> {res[0].StationName.Zh_tw.replace("_", " ")}</>)
            setBikeStationCardTitle(res[0].StationName.Zh_tw.replace("_", " "))
            setBikeStationCardSubTitle(<></>)
          } else {
            setCountdown(-1)
            setTopbarTitle("找不到站點")
            setBikeStationCardTitle("找不到站點")
            setBikeStationCardSubTitle("請檢查輸入")
          }
        }, () => setIsLoading(false))
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
      setOpen(false)
      var res = bikeStationData
      console.log(res, bikeData)
      if (res.length === 0) {
        setCountdown(-1)
        setTopbarTitle("找不到站點")
        setBikeStationCardTitle("找不到站點")
        setBikeStationCardSubTitle("請檢查輸入")
      } else if (bikeData.length > 0 && bikeStationData.length > 0) {
        setSubtitleAndChip(bikeData)
        setBikeStationCardBody(
          <>
            <LocationOnIcon sx={{ verticalAlign: "bottom" }} />{res[0].StationAddress.Zh_tw ? res[0].StationAddress.Zh_tw : "沒有地址資料"}
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
            <BikeDataDisplay data={bikeData} />

            <p>最後更新: {dayjs(bikeData.SrcUpdateTime).format("HH:mm:ss")}</p>
          </>)
      } else {
        // alert("page load failed")
      }
    }
  }, [bikeData, bikeStationData])



  return (
    <>
      <TopAppBar title={topbarTitle} isLoading={isLoading} />
      <Box sx={{ m: 0, p: 3 }}>
        <Card sx={{ mt: 0, pt: 0 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              <Typography component="div" sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #ffef00,#fff647)" }} variant='div' ></Typography>
              {bikeStationCardTitle}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary" component={"div"}>
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
          {<>發生錯誤，無法更新資料</>}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            更新 即時車位資料 時出錯<br />
            請確認你的網路連線<br />
            我們將持續嘗試更新資料
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