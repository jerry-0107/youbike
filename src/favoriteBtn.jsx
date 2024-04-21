import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { pink } from '@mui/material/colors';

function editFavoriteList(data, method) {
    var favoriteStations = JSON.parse(localStorage.getItem("favoriteStations"))
    if (favoriteStations) {

    } else {
        localStorage.setItem("favoriteStations", "[]")
        favoriteStations = JSON.parse(localStorage.getItem("favoriteStations"))
    }

    if (method === "add") {
        favoriteStations.push(data)
        localStorage.setItem(JSON.stringify(favoriteStations))
    }
    else if (method === "remove") {
        var newArr = favoriteStations.filter((v) => { return v.uid !== data.uid })
        localStorage.setItem(JSON.stringify(newArr))
    }
}


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




export default function FavoriteBtn({ stationName, stationUID, options }) {
    const label = { inputProps: { 'aria-label': '加入或移除我的最愛', } };


    return (

        <Checkbox {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />} sx={{
            color: pink[800],
            '&.Mui-checked': {
                color: pink[600],
            },
            display: "inline-block",
            verticalAlign: "text-top"

        }}
            onClick={
                (e) => {
                    if (e.target.checked) {
                        editFavoriteList({ name: stationName, uid: stationUID }, "add")
                    };
                    console.log(e)
                }
            }
        />

    );
}