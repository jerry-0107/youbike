import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import FavoriteBtn from './favoriteBtn';

const drawerWidth = 240;
const navItems = ['首頁', "搜尋", '我的最愛'];
const routes = ["/", "/search", "/favorite"]

export function TopAppBar(props) {
    const { window } = props;
    const { isLoading } = props;
    const { title } = props;
    const { favbtnData } = props
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    React.useEffect(() => {
        document.title = `${title} - YouBike 站點查詢`
    }, [title])

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                {title}
            </Typography>
            <Divider />
            <List>
                {navItems.map((item, i) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }} component={Link} to={routes[i]}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <>   <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'block', sm: 'block' } }}
                    >
                        {title}
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item, i) => (
                            <Button key={item} sx={{ color: '#fff' }} component={Link} to={routes[i]}>
                                {item}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        <FavoriteBtn isInTopBar={true} />
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>

        </Box>
            <div hidden={!isLoading}>
                <LinearProgress variant="indeterminate" /></div>
        </>
    );
}


