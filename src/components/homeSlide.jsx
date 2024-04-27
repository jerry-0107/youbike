import * as React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Box from '@mui/material/Box';

export function StationSlide() {
    const [slideData, setSlideData] = React.useState([])

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


    React.useEffect(() => {
        var FavoriteData = getFavoriteList()
        for (let i = 0; i < FavoriteData.length; i++) {
            slideData.push(
                <SplideSlide>
                    {FavoriteData[i].name}
                </SplideSlide>
            )
        }
    }, [])


    //TODO:GET DATA FROM TDX FOR EVERY SLIDE.
    //TODO:MAKE A LAZY LOAD WHICH JUST LOAD THE SLIDES THAT ARE VISABLE TO USERS.


    return (
        <>
            {slideData.length < 1 ? <>添加站點到我的最愛之後，就會顯示在這裡</> :
                <Splide>
                    <SplideSlide>

                    </SplideSlide>
                </Splide>
            }
        </>
    )
}