import * as React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import "@splidejs/splide/dist/css/themes/splide-sea-green.min.css"
import getData from '../getData';
import '@splidejs/react-splide/css';
import { Typography } from '@mui/material';
import { Paper } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

export function StationSlide() {

    const GridItem = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        minWidth: "160px"
    }));

    const [slideData, setSlideData] = React.useState([])
    const [isFavDataLenBiggerThen5, setIsFavDataLenBiggerThen5] = React.useState(false)


    async function getFavoriteList() {
        var favoriteStations = JSON.parse(localStorage.getItem("favoriteStations"))
        if (favoriteStations) {

        } else {
            localStorage.setItem("favoriteStations", "[]")
            favoriteStations = JSON.parse(localStorage.getItem("favoriteStations"))
            return favoriteStations
        }
        return favoriteStations
    }

    function getCityName(stationUID) {

        var cityCode = stationUID.slice(0, 3)
        var citys = ["Taichung", "Hsinchu", "MiaoliCounty", "NewTaipei", "PingtungCounty", "KinmenCounty", "Taoyuan", "Taipei", "Kaohsiung", "Tainan", "Chiayi", "HsinchuCounty"]
        var codes = ["TXG", "HSZ", "MIA", "NWT", "PIF", "KIN", "TAO", "TPE", "KHH", "TNN", "CYI", "HSQ"]
        return (citys[codes.indexOf(cityCode)])
    }

    React.useEffect(() => {
        async function _asyncFunc() {
            const FavoriteData = await getFavoriteList()
            for (let i = 0; i < 5; i++) {
                try {
                    getData(
                        `https://tdx.transportdata.tw/api/basic/v2/Bike/Availability/City/${getCityName(FavoriteData[i].uid)}?%24filter=StationUID%20eq%20%27${FavoriteData[i].uid}%27&%24format=JSON`,
                        (res) => { setSlideData((old) => [...old, { name: FavoriteData[i].name, bikes: res }]); console.log(slideData) },
                        (...errors) => { }
                    )
                } catch {

                }
            }
            if (FavoriteData.length > 5) { setIsFavDataLenBiggerThen5(true) }
        }
        _asyncFunc()
    }, [])

    React.useEffect(() => { console.log(slideData) }, [slideData])

    //TODO:GET DATA FROM TDX FOR EVERY SLIDE.
    //TODO:MAKE A LAZY LOAD WHICH JUST LOAD THE SLIDES THAT ARE VISABLE TO USERS.


    return (
        <>
            {slideData.length < 1 ? <></> :
                <Splide options={
                    {
                        perPage: (Math.round(window.innerWidth / 300) < 1 ? 1 : Math.round(window.innerWidth / 300)),
                        rewind: true,
                        perMove: 1,
                        drag: 'free',
                        snap: true,
                        autoplay: true,
                    }
                }

                    style={{ paddingLeft: "3em", paddingRight: "3em" }}>

                    {slideData.map((d, i) => {
                        return (
                            <>{
                                d.bikes ?
                                    <SplideSlide >
                                        <GridItem sx={{ m: 1, textAlign: 'left' }}>
                                            <Typography noWrap variant='h5'>{d.name.split(" ")[1]}</Typography>
                                            <p>一般:{d.bikes[0].AvailableRentBikesDetail.GeneralBikes}</p>
                                            {d.bikes[0].AvailableRentBikesDetail.ElectricBikes > 0 ? <p>電輔:{d.bikes[0].AvailableRentBikesDetail.ElectricBikes}</p> : <></>}
                                            <p>空位:{d.bikes[0].AvailableReturnBikes}</p>
                                            <p><Link to={`/bike/station/?uid=${d.uid}`}>詳細資料</Link></p>
                                        </GridItem>
                                    </SplideSlide>
                                    : <></>
                            }</>
                        )
                    })}

                    {isFavDataLenBiggerThen5 ?

                        <SplideSlide >
                            <GridItem sx={{ m: 1, textAlign: 'center', display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <div>
                                    <Typography variant='h5'>顯示更多 </Typography>
                                    <p>前往<Link to={"/favorite"}>我的最愛</Link></p>
                                </div>
                            </GridItem>
                        </SplideSlide>
                        : <></>
                    }
                </Splide>
            }
        </>
    )
}