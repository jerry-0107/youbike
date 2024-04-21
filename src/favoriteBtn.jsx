import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { pink } from '@mui/material/colors';
import Box from '@mui/material/Box';


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

function editFavoriteList(data, method) {
    var favoriteStations = getFavoriteList()
    if (favoriteStations) {

    } else {
        localStorage.setItem("favoriteStations", "[]")
        favoriteStations = JSON.parse(localStorage.getItem("favoriteStations"))
    }

    if (method === "add") {
        favoriteStations.push(data)
        localStorage.setItem("favoriteStations", JSON.stringify(favoriteStations))
    }
    else if (method === "remove") {
        var newArr = favoriteStations.filter((v) => { return v.uid !== data.uid })
        localStorage.setItem("favoriteStations", JSON.stringify(newArr))
    }
}

function isContainedInFavoriteList(uid) {
    var favoriteStations = getFavoriteList()

    for (let i = 0; i < favoriteStations.length; i++) {
        if (favoriteStations[i].uid === uid) {
            return true
        }
    }
    return false
}

export default function FavoriteBtn({ stationName, stationUID, options, isInTopBar }) {
    const label = { inputProps: { 'aria-label': '加入或移除我的最愛', } };


    return (
        <Box sx={{ display: isInTopBar ? "block" : { xs: 'none', sm: 'block' } }}>
            <Checkbox {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />} sx={{
                color: pink[800],
                '&.Mui-checked': {
                    color: pink[600],
                },
                verticalAlign: "text-top",
                display: isInTopBar ? "block" : "inline"

            }}
                checked={isContainedInFavoriteList(stationUID)}

                onClick={
                    (e) => {
                        if (e.target.checked) {
                            editFavoriteList({ name: stationName, uid: stationUID }, "add")
                            console.log(e, { name: stationName, uid: stationUID }, "add")

                        }
                        else {
                            editFavoriteList({ name: stationName, uid: stationUID }, "remove")
                            console.log(e, { name: stationName, uid: stationUID }, "remove")

                        }
                    }
                }
            />
        </Box>
    );
}