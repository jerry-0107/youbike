import * as React from 'react'
import Backdrop from '@mui/material/Backdrop';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home';
import { Err404 } from './pages/error404';
import BikeRoot from './pages/BikeRoot';
import BikeStation from './pages/BikeStation';
import { Nearby } from './pages/nearbyData';
import { Recent } from './pages/recentData';
import { Search } from './pages/search';
import { getapikey } from './getApiKey';


function App() {

  const [isConnected, setIsConnected] = React.useState(false)

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });


  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const systemTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  const currentTheme = (
    localStorage.getItem("theme") == "light" ? lightTheme :
      localStorage.getItem("theme") == "dark" ? darkTheme :
        systemTheme
  )

  React.useEffect(() => {
    getapikey(setIsConnected)
  }, [])




  return (
    <>
      {isConnected ?
        <ThemeProvider theme={currentTheme}>
          <CssBaseline />
          <Routes>
            <Route path='/' element={<BikeRoot />} ></Route>
            <Route path='/nearby' element={<Nearby />} ></Route>
            <Route path='/recent' element={<Recent />} ></Route>
            <Route path='/search' element={<Search />} ></Route>
            <Route path='/bike/station/' element={<BikeStation />} ></Route>
            <Route path='*' element={<Err404 />} ></Route>
          </Routes>
        </ThemeProvider>
        : <>連線中...</>}
    </>
  );
}

export default App;
