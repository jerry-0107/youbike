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

export function SearchField({ location, useAinsteadOfLink, defaultValue, setIsLoading }) {
    const [city, setCity] = React.useState(defaultValue ? defaultValue[1] : "");
    const [keyword, setKeyword] = React.useState(defaultValue ? defaultValue[0] : "")
    const linkRef = React.useRef()

    const [selectError, setSelectError] = React.useState(false)
    const [inputError, setInputError] = React.useState(false)

    const handleChange = (event) => {
        setCity(event.target.value);
    };


    function submitSearch() {
        if (!city) { setSelectError(true) }
        else if (!keyword) { setInputError(true) }
        else if (!useAinsteadOfLink) {
            linkRef.current.click()
        } else {
            if (setIsLoading) { setIsLoading(true) }
            window.location.href = `/search/?q=${keyword}&city=${city}`
        }
    }

    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
        >
            <FormControl sx={{ flexGrow: 1 }} error={inputError && !keyword}>
                <InputBase

                    sx={{ ml: 1, flex: 1 }}
                    placeholder="搜尋站點"
                    inputProps={{ 'aria-label': '搜尋站點' }}
                    value={keyword} onInput={(e) => setKeyword(e.target.value)}
                />
            </FormControl>

            <FormControl sx={{ m: 0.5, minWidth: 105 }} size="small" error={!city && selectError}>
                <InputLabel id="demo-select-small-label">選擇縣市</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    value={city}
                    label="縣市"
                    onChange={handleChange}
                >
                    {/* <MenuItem value="None"><em>不指定</em></MenuItem> */}

                    <MenuItem value="Taichung">台中市</MenuItem>
                    <MenuItem value="Hsinchu">新竹市</MenuItem>
                    <MenuItem value="MiaoliCounty">苗栗縣</MenuItem>
                    <MenuItem value="NewTaipei">新北市</MenuItem>
                    <MenuItem value="PingtungCounty">屏東縣</MenuItem>
                    <MenuItem value="KinmenCounty">金門縣</MenuItem>
                    <MenuItem value="Taoyuan">桃園市</MenuItem>
                    <MenuItem value="Taipei">台北市</MenuItem>
                    <MenuItem value="Kaohsiung">高雄市</MenuItem>
                    <MenuItem value="Tainan">台南市</MenuItem>
                    <MenuItem value="Chiayi">嘉義市</MenuItem>
                    <MenuItem value="HsinchuCounty">新竹縣</MenuItem>
                </Select>
            </FormControl>
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => submitSearch()}>
                <SearchIcon />
            </IconButton>


            <div hidden><Link ref={linkRef} to={`/search/?q=${keyword}&city=${city}`}></Link></div>
        </Paper>
    );
} 