import * as React from 'react'
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Route, Routes, Link } from 'react-router-dom'
import { TopAppBar } from '../components/topBar';
import { Typography, Box } from '@mui/material';

export function Err404() {

    const theme = useTheme();
    const isBigScreen = useMediaQuery(theme.breakpoints.up('sm'));

    return (<>
        <TopAppBar title={"找不到頁面"} />
        <Box sx={{ p: 3 }}>
            <Typography variant="h3" sx={{ textAlign: (isBigScreen ? "left" : "center") }} gutterBottom>
                404
            </Typography>
            <Typography sx={{ textAlign: (isBigScreen ? "left" : "center") }}>
                我們找不到你想去的地方，請<Link to="/">回到首頁</Link>
            </Typography>
        </Box>
    </>)
}