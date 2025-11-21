import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MovieIcon from '@mui/icons-material/Movie';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import { movie } from './CinemaHome';

interface showtimeProps {
    movieInfo: movie[]
}

export const CinemaShowtimeConfig = ({ movieInfo }: showtimeProps) => {
    // open a modal that indicates list of movies
    const [isOpenMovie, setIsOpenMovie] = useState<boolean>(false)
    return (
        <>
            <Box className='flex w-full justify-center '>
                <Button variant="text" onClick={() => setIsOpenMovie(!isOpenMovie)} className='flex justify-center gap-2 bg-green-500 text-white hover:bg-green-600' >
                    <Typography variant="body1" > showtimes config </Typography>
                    <MovieIcon ></MovieIcon>
                </Button>
            </Box>

            <Modal
                open={isOpenMovie}
                onClose={() => { setIsOpenMovie(!isOpenMovie) }}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={isOpenMovie}>

                    <Box className="flex flex-col items-center overflow-y-scroll w-full md:w-3/5 lg:w-1/2 xl:w-1/2 h-2/3 md:h-3/4 xl:h-4/5 absolute top-1/2 left-1/2 bg-teal-100 -translate-y-1/2 -translate-x-1/2 px-1 py-2 md:px-7 md:py-6 ">
                        {
                            movieInfo.length > 0 ?
                                movieInfo.map((movie) => {
                                    return (
                                        <Box className="w-full flex justify-center hover:bg-red-300 my-1 border border-black rounded-md ">
                                            <Box className="w-1/2   bg-cyan-300 rounded-md mx-1 my-1 flex flex-col items-center justify-center">
                                                <Box><Typography variant="body2" color="initial" className='text-center font-bold mb-3'>{movie.title}</Typography> </Box>
                                                <Box className="w-full "> <Typography variant="body2" className='px-5 py-2 text-justify  sm:text-sm' >{movie.description}</Typography></Box>
                                                <Box className="flex flex-col w-full items-center justify-center ">
                                                    <Typography variant="body2" className='px-5 py-2 w-full  sm:text-sm text-center' >Genre : {movie.genre}</Typography>
                                                    <Typography variant="body2" className='px-5 py-2 w-full  sm:text-sm text-center' >Realease Year : {movie.releaseYear}</Typography>
                                                </Box>
                                                <Box className="flex justify-center border rounded-md px-2 py-1 ">
                                                    <Rating name="read-only" value={movie.rating} precision={0.1} readOnly />
                                                </Box>
                                                <Box className=" flex justify-center ">
                                                    <Typography className='text-xs text-gray-400 my-1'>
                                                        {movie.ratingCount} votes ,
                                                        {movie.rating}
                                                        <FavoriteIcon className='text-red-500 size-4'></FavoriteIcon>
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box className="w-1/2 my-1 mx-1">
                                                <img src={movie.imageUrl} alt="" className='rounded-md object-cover w-full h-full' />
                                            </Box>
                                        </Box>
                                    )
                                })
                                :
                                <Box className="flex justify-center items-center w-full h-full">
                                    <CircularProgress className='text-green-600'></CircularProgress>
                                </Box>

                        }
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}
