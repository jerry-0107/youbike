import * as React from 'react'
import { TopAppBar } from '../TopBar';

import { Box, Button } from "@mui/material";
import "leaflet/dist/leaflet.css";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
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