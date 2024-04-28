import * as React from 'react';
import { Link } from 'react-router-dom';
import { SearchField } from '../components/searchField';
import { UrlParam } from '../urlParam';
import { TopAppBar } from '../components/topBar';
import { Box } from '@mui/material';
import getData from '../getData';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';


export function Search() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [stationNearby, setStationNearby] = React.useState([]);
  const [stationNearbyBikes, setStationNearbyBikes] = React.useState([]);

  const [locationMark, setLocationMark] = React.useState(<></>);

  const [currentLocation, setCurrentLocation] = React.useState([0, 0])
  function getBikeData() {
    setIsLoading(true)
    getData(
      `https://tdx.transportdata.tw/api/basic/v2/Bike/Station/City/${UrlParam('city')}?%24filter=contains%28StationName%2FZh_tw%20%2C%20%27${UrlParam("q")}%27%29&%24format=JSON`,
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
      },

    );

    // getData(
    //     `https://tdx.transportdata.tw/api/basic/v2/Bike/Availability/City/${UrlParam('city')}?%24filter=contains%28StationName%2FZh_tw%20%2C%20%27${UrlParam("q")}%27%29&%24format=JSON`,
    //     (res) => {
    //         console.log(res);
    //         setStationNearbyBikes(res);
    //     },
    //     e => { alert("error") }
    // );
  }



  React.useEffect(() => {
    if (UrlParam("q") && UrlParam("city") && UrlParam("q") !== "_") {
      getBikeData()
    } else {

    }
  }, [])
  return (
    <>
      <TopAppBar title="公共自行車" isLoading={isLoading}></TopAppBar>
      <Box sx={{ p: 3 }}>
        <SearchField useAinsteadOfLink={true} defaultValue={[UrlParam("q"), UrlParam("city")]} setIsLoading={setIsLoading} />
        <div>
          {UrlParam("q") && UrlParam("city") ? isLoading ? <p>正在搜尋...</p> : <p>共有 {stationNearby.length} 項結果</p> : <p>輸入關鍵字及地區，進行搜尋</p>}
          <List>
            {stationNearby.map((d, i) => {
              return (
                <ListItem key={i}>
                  <ListItemButton component={Link} to={`/bike/station/?uid=${d.StationUID}`}>
                    <ListItemText primary={d.StationName.Zh_tw.replace("_", " ")} />
                  </ListItemButton>

                </ListItem>
              )
            })}
          </List>
        </div>
      </Box>

    </>
  )
}