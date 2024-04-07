import * as React from "react";
import { TopAppBar } from '../TopBar';
import getData from "../getData";
import { Box, Autocomplete, TextField, Button } from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Alert } from "@mui/material";
import { Link } from "react-router-dom";
import { Paper } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from "leaflet";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ConstructionOutlined } from "@mui/icons-material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { SearchField } from "../searchField";
import Chip from '@mui/material/Chip';
import { yellow } from "@mui/material/colors";

import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { YouBikeImage } from "../youbikeImage";

function BikeRoot() {
  const mymap = React.useRef();
  const [dialogOpen, setDialogOpen] = React.useState(false);


  const [isLoading, setIsLoading] = React.useState(false)

  const [moreData, setMoreData] = React.useState({ moreBike: { stationName: "NULL", bikes: 0 }, moreSpace: { stationName: "NULL", space: 0 } })

  const [stationNearbyBtn, setStationNearbyBtn] = React.useState(
    <>
      <Button
        variant="contained"
        onClick={() => {
          getLocation();
        }}
      >
        請開啟定位
      </Button>
    </>
  );
  const [stationNearby, setStationNearby] = React.useState([]);
  const [stationNearbyBikes, setStationNearbyBikes] = React.useState([]);

  const [locationMark, setLocationMark] = React.useState(<></>);

  const [currentLocation, setCurrentLocation] = React.useState([0, 0])

  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
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


  const GridItem = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));


  function getNearByBikeData(lat, lon) {
    setIsLoading(true)
    getData(
      `https://tdx.transportdata.tw/api/advanced/v2/Bike/Station/NearBy?%24spatialFilter=nearby%28${lat}%2C%20${lon}%2C%201000%29&%24format=JSON`,
      (res) => {
        console.log(res);
        var list = [];
        for (var i = 0; i < res.length; i++) {
          list.push({
            id: res[i].StationUID,
            name: res[i].StationName.Zh_tw,
          });
        }
        setStationNearby(res);
        setIsLoading(false)

        setCurrentLocation([lat, lon])
      },
      () => setIsLoading(false)

    );

    getData(
      `https://tdx.transportdata.tw/api/advanced/v2/Bike/Availability/NearBy?%24spatialFilter=nearby%28${lat}%2C%20${lon}%2C%201000%29&%24format=JSON`,
      (res) => {
        setIsLoading(false)
        console.log(res);
        setStationNearbyBikes(res);


      },
      e => { alert("error"); setIsLoading(false) }
    );
  }


  function getLocation() {
    setIsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
      setDialogOpen(true);
    }

    function successFunction(loc) {
      setIsLoading(false)
      //loc.coords.longitude
      console.log(loc);
      setStationNearbyBtn(<></>);
      setLocationMark(
        <>
          <Marker
            position={[loc.coords.latitude, loc.coords.longitude]}
            icon={redIcon}
          >
            <Popup>你的位置</Popup>
          </Marker>
        </>
      );
      mymap.current.setView([loc.coords.latitude, loc.coords.longitude], 16)
      getNearByBikeData(loc.coords.latitude, loc.coords.longitude)
    }
    function errorFunction() {
      setIsLoading(false)
      //if(localStorage.getItem("dialog.getLocationError.show") === "true" || !localStorage.getItem("dialog.getLocationError.show")){
      setDialogOpen(true); //無論如何
      //}
    }
  }
  const MapEvents = () => {
    useMapEvents({
      // click(e) {
      //   // setState your coords here
      //   // coords exist in "e.latlng.lat" and "e.latlng.lng"
      //   var loc = [e.latlng.lat, e.latlng.lng]
      //   let marker = L.marker(loc, { icon: greenIcon }).addTo(mymap.current);

      //   marker.bindPopup("標記的位置")
      //   mymap.current.flyTo(loc, 16)

      //   marker.addEventListener("click", (e) => { console.log(e) })
      // },
      dragend: (e) => {
        console.log("mapCenter", e.target.getCenter());
        getNearByBikeData(e.target.getCenter().lat, e.target.getCenter().lng)
      }
    })
    return false;
  };

  React.useEffect(() => {
    getLocation();
  }, []);

  React.useEffect(() => {
    if (stationNearby.length > 0 && stationNearbyBikes.length > 0 && stationNearby.length === stationNearbyBikes.length) {
      console.log(stationNearby, stationNearbyBikes, "000")
      var moreBike = 0, moreSpace = 0;
      var theMoreBikeStation = [], theMoreSpaceStation = []
      for (let i = 0; i < stationNearbyBikes.length; i++) {
        if (stationNearbyBikes[i].ServiceStatus === 1 && stationNearby[i].StationName.Zh_tw) {
          if (stationNearbyBikes[i].AvailableRentBikes > moreBike) {
            theMoreBikeStation[0] = stationNearby[i].StationName.Zh_tw
            theMoreBikeStation[1] = stationNearbyBikes[i].AvailableRentBikes
            moreBike = stationNearbyBikes[i].AvailableRentBikes
          }
          if (stationNearbyBikes[i].AvailableReturnBikes > moreSpace) {
            theMoreSpaceStation[0] = stationNearby[i].StationName.Zh_tw
            theMoreSpaceStation[1] = stationNearbyBikes[i].AvailableReturnBikes
            moreSpace = stationNearbyBikes[i].AvailableReturnBikes
          }
        }
      }
      if (theMoreBikeStation.length > 0) {
        setMoreData({ moreBike: { stationName: theMoreBikeStation[0], bikes: theMoreBikeStation[1] }, moreSpace: { stationName: theMoreSpaceStation[0], space: theMoreSpaceStation[1] } })
      }
      else {
        setMoreData({ moreBike: { stationName: "NULL", bikes: 0 }, moreSpace: { stationName: "NULL", space: 0 } })
      }
    } else {
      setMoreData({ moreBike: { stationName: "NULL", bikes: 0 }, moreSpace: { stationName: "NULL", space: 0 } })
    }
  }, [stationNearby, stationNearbyBikes])

  return (
    <>
      <TopAppBar title="YouBike 站點查詢" isLoading={isLoading} />
      <Box sx={{ p: 3 }}>
        <SearchField location={currentLocation} setIsLoading={setIsLoading} />
        <p></p>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <GridItem>
                <YouBikeImage src='/youbike/YouBike2.0.svg' style={{ height: "2.5em" }} alt='可借車輛' /><br /><b>車輛最多</b><br />
                {moreData.moreBike.stationName == "NULL" ? <>無資料</> :
                  <>{moreData.moreBike.stationName.split("_").length < 2 ? <>
                    <Typography >{moreData.moreBike.stationName.split("_")[0]}</Typography>
                  </> : <>
                    <Typography >{moreData.moreBike.stationName.split("_")[0]} {moreData.moreBike.stationName.split("_")[1]}</Typography>
                  </>}<Typography >{moreData.moreBike.bikes}輛車</Typography></>}

              </GridItem>
            </Grid>
            <Grid xs={6}>
              <GridItem>
                <YouBikeImage src='/youbike/2.0-dock.svg' style={{ height: "2.5em" }} alt='可還空位' /><br /><b>空位最多</b><br />
                {moreData.moreSpace.stationName == "NULL" ? <>無資料</> : <>{moreData.moreSpace.stationName.split("_").length < 2 ? <>
                  <Typography >{moreData.moreSpace.stationName.split("_")[0]}</Typography>
                </> : <>
                  <Typography >{moreData.moreSpace.stationName.split("_")[0]} {moreData.moreSpace.stationName.split("_")[1]}</Typography>
                </>}<Typography >{moreData.moreSpace.space}個空位</Typography></>}
              </GridItem>

            </Grid>

          </Grid>
        </Box>
        <p></p>
        <MapContainer
          ref={mymap}
          scrollWheelZoom={false}
          center={[23.75518176611264, 120.9406086935125]}
          zoom={11}
          style={{ width: "100%", height: "60vh" }}
        >
          <TileLayer
            attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors${L.Browser.mobile ? "" : ""
              }<br/>移動地圖來查看其他站點`}
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locationMark}
          <MapEvents />
          {
            stationNearby.length > 0 ?
              stationNearby.map(function (res, index) {
                return (
                  <Marker
                    eventHandlers={{
                      click: (e) => {
                        console.log('marker clicked', e)
                      },
                    }}
                    key={"marker-" + index}
                    position={[res.StationPosition.PositionLat, res.StationPosition.PositionLon]}
                    icon={greenIcon}
                  >
                    <Popup>
                      {res.StationName.Zh_tw.replace("_", " ")}
                      <p>
                        {stationNearbyBikes[index] ? (
                          stationNearbyBikes[index].ServiceStatus === 1 ?
                            (
                              <>
                                一般:{stationNearbyBikes[index].AvailableRentBikesDetail.GeneralBikes}<br />
                                {stationNearbyBikes[index].AvailableRentBikesDetail.ElectricBikes > 0 ? <>電輔:{stationNearbyBikes[index].AvailableRentBikesDetail.ElectricBikes}<br /></> : <></>}
                                空位:{stationNearbyBikes[index].AvailableReturnBikes}<br />
                              </>
                            )
                            :
                            stationNearbyBikes[index].ServiceStatus === 0 ?
                              (
                                <>停止營運</>
                              )
                              : (<>暫停營運</>)
                        ) : (
                          <CircularProgress size="1rem" />
                        )}
                      </p>
                      <Link to={`/bike/station/?uid=${res.StationUID}`}>詳細資料</Link>
                    </Popup>
                  </Marker>
                )
              })
              : <></>
          }
        </MapContainer>
        <p></p>
        <Box sx={{ width: "100%", m: 0, p: 0 }}>
          <Card sx={{ mt: 0, pt: 0 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                附近的站點:
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {stationNearby.length > 0 ? <>附近有 {stationNearby.length} 個站點</> : <>找不到任何站點</>}
              </Typography>

              {
                stationNearby.length > 0 ?
                  stationNearby.map(function (res, index) {
                    return (

                      <Card
                        key={res.StationUID}
                        sx={{
                          m: 1, p: 1
                        }}
                      >
                        <Box sx={{ display: "flex" }}>

                          {res.StationName.Zh_tw.split("_").length < 2 ? <>
                            <Typography variant="h6" component="h6">{res.StationName.Zh_tw.split("_")[0]}</Typography>
                          </> : <>
                            <Chip label={res.StationName.Zh_tw.split("_")[0]} sx={{ background: yellow[200], me: 1 }} />
                            <Typography variant="h6" component="h6">{res.StationName.Zh_tw.split("_")[1]}</Typography>
                          </>}
                        </Box>
                        <Box sx={{ p: 0.5 }}>
                          {stationNearbyBikes[index] ? (
                            stationNearbyBikes[index].ServiceStatus === 1 ?
                              (
                                <>
                                  一般:{stationNearbyBikes[index].AvailableRentBikesDetail.GeneralBikes}<br />
                                  {stationNearbyBikes[index].AvailableRentBikesDetail.ElectricBikes > 0 ? <>電輔:{stationNearbyBikes[index].AvailableRentBikesDetail.ElectricBikes}<br /></> : <></>}
                                  空位:{stationNearbyBikes[index].AvailableReturnBikes}<br />
                                </>
                              )
                              :
                              stationNearbyBikes[index].ServiceStatus === 0 ?
                                (
                                  <>停止營運</>
                                )
                                : (<>暫停營運</>)
                          ) : (
                            <CircularProgress size="1rem" />
                          )}
                          <div>
                            <Button variant="text" onClick={() => {
                              mymap.current.setView([res.StationPosition.PositionLat, res.StationPosition.PositionLon], 18);
                              window.scrollTo(0, 0)
                            }}>在地圖上顯示</Button>

                            <Button variant="contained" component={Link} to={`/bike/station/?uid=${res.StationUID}`}>
                              更多資訊
                            </Button>
                          </div>
                        </Box>
                      </Card>

                    );
                  })
                  : <>
                  </>
              }
            </CardContent>
          </Card></Box>
      </Box >
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"無法使用你的定位資訊"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component="div">
            我們無法使用你的定位資訊，你將無法使用我們所提供的部分功能
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BikeRoot;