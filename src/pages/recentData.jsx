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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { AppBar, Toolbar } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt';
import LinearProgress from '@mui/material/LinearProgress';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Divider from '@mui/material/Divider';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export function Recent() {
    const [recentData, setRecantData] = React.useState([])


    React.useEffect(() => {
        var localData = localStorage.getItem("recentData")
        if (localData) {
            setRecantData(JSON.parse(localData))
        } else {
            localStorage.setItem("recentData", "[]")
        }
    }, [])

    return (
        <>
            <TopAppBar title="最近查詢"></TopAppBar>
            <Box sx={{ p: 3 }}>
                {recentData.length < 1 ? <>無資料</> : <></>}
                <List>

                    {
                        recentData.map((d, i) => {
                            return <ListItem key={i}>{d.StationName}</ListItem>
                        })
                    }

                </List>
            </Box>
        </>
    )
}