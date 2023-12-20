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
import { Link } from 'react-router-dom';

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
        <p>以下顯示你之前查詢過的站點 (最多記錄100個站點)</p>
        <Button variant='text' color='error' onClick={() => { if (window.confirm("是否確定清除資料?")) { localStorage.setItem("recentData", "[]"); window.location.reload() } }}>清除資料</Button>
        <p></p>
        {recentData.length < 1 ? <>無資料</> : <></>}
        <List>

          {
            recentData.reverse().map((d, i) => {
              return (
                <ListItem key={i}>
                  <ListItemButton component={Link} to={`/bike/station/?uid=${d.uid}`}>
                    <ListItemText primary={d.StationName} />
                  </ListItemButton>
                </ListItem>
              )
            })
          }

        </List>
      </Box>
    </>
  )
}