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

function editFavoriteList(data, method, callback) {
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
    callback(isContainedInFavoriteList(data.uid))
}

function isContainedInFavoriteList(uid) {
    var favoriteStations = getFavoriteList()
    console.log(favoriteStations)
    for (let i = 0; i < favoriteStations.length; i++) {
        if (favoriteStations[i].uid === uid) {
            console.log(favoriteStations[i].uid === uid, favoriteStations[i].uid, uid)
            return true
        }
    }
    return false
}

export default function FavoriteBtn({ stationName, stationUID, options, isInTopBar, sx }) {
    const label = { inputProps: { 'aria-label': '加入或移除我的最愛', } };
    const [isChecked, setIsChecked] = React.useState(isContainedInFavoriteList(stationUID))
    React.useEffect(() => {
        setIsChecked(isContainedInFavoriteList(stationUID));
        console.log("isContainedInFavoriteList ?", isContainedInFavoriteList(stationUID))
    }, [stationUID])



    return (
        <Box sx={{ display: isInTopBar ? "block" : { xs: 'none', sm: 'block' } }}>
            <Checkbox {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />} sx={{
                color: pink[800],
                '&.Mui-checked': {
                    color: pink[600],
                },
                ...sx

            }}
                checked={isChecked}

                onClick={
                    (e) => {
                        if (e.target.checked) {
                            editFavoriteList({ name: stationName.replace("_", " "), uid: stationUID }, "add", setIsChecked)
                            console.log(e, { name: stationName.replace("_", " "), uid: stationUID }, "add")
                        }
                        else {
                            editFavoriteList({ name: stationName.replace("_", " "), uid: stationUID }, "remove", setIsChecked)
                            console.log(e, { name: stationName.replace("_", " "), uid: stationUID }, "remove")
                        }
                    }
                }
            />
        </Box>
    );
}