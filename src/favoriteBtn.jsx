import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { pink } from '@mui/material/colors';

function editFavoriteList() {

}

const label = { inputProps: { 'aria-label': 'Checkbox demo', onchange: (e) => { if (e.target.checked) { }; console.log(e) } } };


export default function FavoriteBtn({ stationName, stationUID, options }) {
    return (
        <div>
            <Checkbox {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />} sx={{
                color: pink[800],
                '&.Mui-checked': {
                    color: pink[600],
                },

            }} />
        </div>
    );
}