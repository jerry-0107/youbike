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
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

function BikeRoot() {
    const mymap = React.useRef();
    const [radioValue, setRadioValue] = React.useState("nearby");
    const [dialogOpen, setDialogOpen] = React.useState(false);

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


    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
        } else {
            setDialogOpen(true);
        }

        function successFunction(loc) {
            //loc.coords.longitude
            console.log(loc);
            setStationNearbyBtn(<></>);
            getData(
                `https://tdx.transportdata.tw/api/advanced/v2/Bike/Station/NearBy?%24spatialFilter=nearby%28${loc.coords.latitude}%2C%20${loc.coords.longitude}%2C%201000%29&%24format=JSON`,
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
                    mymap.current.setView(
                        [loc.coords.latitude, loc.coords.longitude],
                        14
                    );
                },

            );

            getData(
                `https://tdx.transportdata.tw/api/advanced/v2/Bike/Availability/NearBy?%24spatialFilter=nearby%28${loc.coords.latitude}%2C%20${loc.coords.longitude}%2C%201000%29&%24format=JSON`,
                (res) => {
                    console.log(res);
                    setStationNearbyBikes(res);
                },
                { useLocalCatch: false }
            );
        }
        function errorFunction() {
            //if(localStorage.getItem("dialog.getLocationError.show") === "true" || !localStorage.getItem("dialog.getLocationError.show")){
            setDialogOpen(true); //無論如何
            //}
        }
    }

    React.useEffect(() => {
        getLocation();
    }, []);

    return (
        <>
            <TopAppBar title="公共自行車"></TopAppBar>
            <Box sx={{ p: 3 }}>

                <MapContainer
                    ref={mymap}
                    dragging={!L.Browser.mobile}
                    scrollWheelZoom={false}
                    center={[23.75518176611264, 120.9406086935125]}
                    zoom={7}
                    style={{ width: "100%", height: "35vh" }}
                >
                    <TileLayer
                        attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors${L.Browser.mobile ? "<br/>使用兩指移動與縮放地圖" : ""
                            }`}
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locationMark}

                    {
                        stationNearby.map(function (res, index) {
                            return (
                                <Marker
                                    key={"marker-" + index}
                                    position={[res.StationPosition.PositionLat, res.StationPosition.PositionLon]}
                                    icon={greenIcon}
                                >
                                    <Popup>{res.StationName.Zh_tw.replace("_", " ")}</Popup>
                                </Marker>
                            )
                        })
                    }
                </MapContainer>
                <p></p>
                <Box sx={{ width: "100%", m: 0, p: 0 }}>
                    <Card sx={{ mt: 0, pt: 0 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                附近站點:
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary"></Typography>
                            <Typography variant="body2" component="div">
                                {stationNearbyBtn}
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ p: 0.5 }}>類型</TableCell>
                                                <TableCell sx={{ p: 0.5 }}>名稱</TableCell>
                                                <TableCell sx={{ p: 0.5 }}>狀態</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stationNearby.map(function (res, index) {
                                                return (

                                                    <TableRow
                                                        key={res.StationUID}
                                                        sx={{
                                                            "&:last-child td, &:last-child th": { border: 0 },
                                                        }}
                                                    >
                                                        <TableCell component="th" scope="row" sx={{ p: 0.5 }}>
                                                            {res.StationName.Zh_tw.split("_")[0]}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row" sx={{ p: 0.5 }}>
                                                            <Link
                                                                to={`/bike/station/?lat=${res.StationPosition.PositionLon}&lon=${res.StationPosition.PositionLat}&uid=${res.StationUID}`}
                                                            >
                                                                {res.StationName.Zh_tw.split("_")[1]}
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell component="th" scope="row" sx={{ p: 0.5 }}>
                                                            {stationNearbyBikes[index] ? (
                                                                stationNearbyBikes[index].ServiceStatus === 1 ?
                                                                    (
                                                                        <>
                                                                            一般:{stationNearbyBikes[index].AvailableRentBikesDetail.GeneralBikes}<br />
                                                                            電輔:{stationNearbyBikes[index].AvailableRentBikesDetail.ElectricBikes}<br />
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
                                                        </TableCell>
                                                    </TableRow>

                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Typography>
                        </CardContent>
                    </Card></Box>
            </Box>
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
                        我們無法使用你的定位資訊，這可能是因為
                        {navigator.geolocation ? (
                            <>
                                你之前拒絕了我們的定位請求
                                <br />
                                如果要啟用定位，請到
                                <Paper sx={{ p: 0.5 }}>
                                    瀏覽器設定&gt;網站設定&gt;{window.location.origin}
                                </Paper>
                                開啟定位服務，接著刷新此頁面
                            </>
                        ) : (
                            <>
                                你的裝置不支援我們的技術
                                <br />
                                請嘗試更新瀏覽器，或在其他裝置上再試一次
                            </>
                        )}
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