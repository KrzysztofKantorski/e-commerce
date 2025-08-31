import React from 'react'
import { useState, useEffect } from 'react';
import axios from "axios"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import AppBar from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


const Item = styled(Paper)(({ theme }) => ({
  
  
  padding: theme.spacing(1),
  textAlign: 'left',
  
  
}));

function Login() {


const [data, setData] = useState([]);
      useEffect(() => {
        let isMounted = true;
        
        axios.get("http://localhost:3000/products")
            .then(response => {
                if (isMounted && response.data) {
                    setData(response.data.products);
                }
            })
            .catch(err => {
                if (isMounted) {
                    console.error('Error:', err);
                }
            });
            
        return () => {
            isMounted = false; 
        };
    }, []);


    
  return (
     <>
 <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
           <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
     
    <Box>
      <Grid container spacing={2} columns={{ xs: 2, sm: 4, md: 8, lg: 10, xlg: 12 }}>

        {data.map((product, index) => (
        <Grid key ={index} size={{ xs: 9, sm: 8, md: 4, lg: 2 }} height={450}>
          
                    <Card 
                    sx={{ 
                        height: '100%',  // Wszystkie karty tej samej wysokości
                        display: 'flex', 
                        flexDirection: 'column' ,
                        position: "relative"
                        }}>
            <CardMedia
                component="img"
                height="250"
                image={`http://localhost:3000${product.images}`}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                {product.name}
                </Typography>
                <Typography variant="body2" sx={{ 
                    color: 'text.secondary',
                        position: "absolute",
                        bottom: "3rem",
                       left: "1rem",
                       fontSize: "2.5rem",
                    }}>
                {product.price} zł
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small"
                   sx={{ 
                        position: "absolute",
                        bottom: ".5rem",
                        left: ".5rem"
                        }}
                >dodaj do koszyka</Button>
                <Button size="small"
                  sx={{ 
                        position: "absolute",
                        bottom: ".5rem",
                        right: ".5rem"
                        }}
                >dodaj do ulubionych</Button>
            </CardActions>
            </Card>
          
        </Grid>
        ))}

        </Grid>
    </Box>
    </>
  )

}
    

export default Login