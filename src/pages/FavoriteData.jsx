import * as React from 'react'
import { TopAppBar } from '../TopBar';

import { Box, Button } from "@mui/material";
import "leaflet/dist/leaflet.css";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

export function Favorite() {
  const [FavoriteData, setRecantData] = React.useState(getFavoriteList())


  function getFavoriteList() {
    var favoriteStations = JSON.parse(localStorage.getItem("favoriteStations"))
    if (favoriteStations) {

    } else {
      localStorage.setItem("favoriteStations", "[]")
      favoriteStations = JSON.parse(localStorage.getItem("favoriteStations"))
      return favoriteStations
    }
    return favoriteStations
  }


  return (
    <>
      <TopAppBar title="我的最愛"></TopAppBar>
      <Box sx={{ p: 3 }}>
        <p>以下顯示我的最愛</p>
        <Button variant='text' color='error' onClick={() => { if (window.confirm("是否確定清除資料?")) { localStorage.setItem("favoriteStations", "[]"); window.location.reload() } }}>清除資料</Button>
        <p></p>
        {FavoriteData.length < 1 ? <>無資料</> : <></>}
        <List>

          {
            FavoriteData.reverse().map((d, i) => {
              return (
                <ListItem key={i}>
                  <ListItemButton component={Link} to={`/bike/station/?uid=${d.uid}`}>
                    <ListItemText primary={d.name} />
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