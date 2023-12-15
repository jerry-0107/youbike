import * as React from 'react'
import Backdrop from '@mui/material/Backdrop';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Route, Routes } from 'react-router-dom'

export function Err404() {
    return (<>ERROR 404</>)
}