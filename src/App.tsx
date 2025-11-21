import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './component/users/Home';
import { AppBar, Toolbar, Button } from "@mui/material";
import Typography from '@mui/material/Typography'
import CinemaHome from './component/ticket_reservation/CinemaHome';
import FootballResults from './component/football-results/FootballResults';
import ExchangeRates from './component/exchange_rates/ExchangeRates';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CottageIcon from '@mui/icons-material/Cottage';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { JSX } from "react";


interface drawer {
  icon: JSX.Element,
  text: string,
  link: string
}

function App() {

  const [isDrawerShow, setIsDrawerShow] = useState<boolean>(false)
  const drawerInfo : drawer[] = [
    { icon: <CottageIcon />, text: 'Home', link: '/' },
    { icon: <LocalActivityIcon />, text: 'Book Tickets', link: '/book-ticket' },
    { icon: <SportsSoccerIcon />, text: 'Football Result', link: '/football-results' },
    { icon: <MonetizationOnIcon />, text: 'Exchamge Rates', link: '/exchange' }
  ]

  return (
    <>
      <BrowserRouter basename='/super-web-application-frontend'>
        <AppBar position="static" className=' fixed top-0 z-50 '>
          <Toolbar className='hidden md:flex justify-center items-center gap-20'>
            <Typography variant="h6" className='hover:scale-125 transition duration-700' >
              <Link to="/">Home</Link>
            </Typography>
            <Typography variant="h6" className='hover:scale-125 transition duration-700'  >
              <Link to="/book-ticket">Book Tickets</Link>
            </Typography>
            <Typography variant="h6" className='hover:scale-125 transition duration-700' >
              <Link to="/football-results">Football Result</Link>
            </Typography>
            <Typography variant="h6" className='hover:scale-125 transition duration-700' >
              <Link to="/exchange"> Exchamge Rates </Link>
            </Typography>
          </Toolbar>

          <Toolbar className='felx  md:hidden justify-end items-center gap-20'>
            <Box className="flex mx-auto" >
            </Box>
            <Button variant="text" size="large" className='text-white' onClick={() => { setIsDrawerShow(!isDrawerShow) }} >
              <FormatAlignJustifyIcon ></FormatAlignJustifyIcon>
            </Button>
          </Toolbar>
        </AppBar>


        <Drawer
          open={isDrawerShow}
          onClose={() => setIsDrawerShow(false)}
          slotProps={{
            paper: {
              className: "w-3/5 sm:w-1/2 h-screen rounded-none bg-white",
            },
          }}>
          <List className='w-full'>
            {drawerInfo.map((info, index) => (
              <ListItem key={index} disablePadding>
                <Link
                  className='w-full'
                  to={info.link}
                  onClick={() => setIsDrawerShow(false)}>
                  <ListItemButton className='w-full'>
                    <ListItemIcon className='text-black'>
                      {info.icon}
                    </ListItemIcon>
                    <ListItemText className='text-[#1976d2]' primary={info.text} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Drawer>


        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book-ticket" element={<CinemaHome />} />
          <Route path="/football-results" element={<FootballResults />} />
          <Route path="/exchange" element={<ExchangeRates />} />
        </Routes>
      </BrowserRouter>


    </>
  );
}

export default App;
