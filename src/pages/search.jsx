import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link } from 'react-router-dom';
import { SearchField } from '../searchField';
import { UrlParam } from '../urlParam';
import { TopAppBar } from '../TopBar';
import { Box } from '@mui/material';
import getData from '../getData';

export function Search() {

    const [stationNearby, setStationNearby] = React.useState([]);
    const [stationNearbyBikes, setStationNearbyBikes] = React.useState([]);

    const [locationMark, setLocationMark] = React.useState(<></>);

    const [currentLocation, setCurrentLocation] = React.useState([0, 0])
    function getBikeData() {
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
            <TopAppBar title="公共自行車"></TopAppBar>
            <Box sx={{ p: 3 }}>
                <SearchField useAinsteadOfLink={true} defaultValue={[UrlParam("q"), UrlParam("city")]} />
                <div>
                    共有 {stationNearby.length} 項結果
                    {stationNearby.map((d, i) => {
                        return <p key={i}>{d.StationName.Zh_tw}</p>
                    })}
                </div>
            </Box>

        </>
    )
}