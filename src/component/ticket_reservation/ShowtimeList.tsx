import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress'
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios, { AxiosResponse } from 'axios';
import { movie, reservation, reserve, showtime } from './CinemaHome';
import Backdrop from '@mui/material/Backdrop';

interface showtimeListProps {
    setSelectedShowtimeID: React.Dispatch<React.SetStateAction<number>>,
    btnArr: reserve[],
    setBtnArr: React.Dispatch<React.SetStateAction<reserve[]>>,
    movieInfo: movie[],
    showtimes: showtime[]
}

export const ShowtimeList = ({ setSelectedShowtimeID, btnArr, setBtnArr, movieInfo, showtimes }: showtimeListProps) => {

    // Opens a modal that indicates list of showtimes
    const [isOpenShowtime, setIsOpenShowtime] = useState<boolean>(false)

    const SelectMovie = async (ID: number): Promise<void> => {
        let tempArr: reserve[] = [...btnArr];
        for (let i: number = 0; i < btnArr.length; i++) {
            tempArr[i].isReserve = false
            tempArr[i].isSelected = false
        }
        setBtnArr(tempArr);
        setIsOpenShowtime(!isOpenShowtime)
        setSelectedShowtimeID(ID)
        const res: AxiosResponse<any, any, {}> = await axios.get(`https://super-web-application-backend-production.up.railway.app/reservation/${ID}`)
        const data: reservation[] = res.data
        tempArr = [...btnArr];
        for (let index = 0; index < res.data.length; index++) {
            tempArr[data[index].seat_number - 1].isReserve = true
        }
        setBtnArr(tempArr)
    }

    const GetMovieById = (ID: number): movie | undefined => {

        for (let index = 0; index < movieInfo.length; index++) {
            if (movieInfo[index].id === ID) {
                return movieInfo[index]
            }
        }

    }

    return (
        <>
            <Box className='flex justify-center'>
                <Button variant="text" onClick={() => setIsOpenShowtime(!isOpenShowtime)} className='flex justify-center gap-2 bg-[#607d8b] text-white hover:bg-[#455a64]' >
                    <Typography variant="body1" > List of showtimes </Typography>
                    <LocalActivityIcon ></LocalActivityIcon>
                </Button>
            </Box>

            <Modal
                open={isOpenShowtime}
                onClose={() => { setIsOpenShowtime(!isOpenShowtime) }}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={isOpenShowtime} >
                    <Box className="w-full md:w-5/6 lg:w-3/4 xl:w-3/5 h-4/5 lg:h-[90%]  absolute top-1/2 left-1/2 px-2 bg-cyan-100 -translate-y-1/2 -translate-x-1/2  flex flex-col items-center  overflow-y-scroll " >
                        {
                            showtimes.length > 0 ?
                                showtimes.map((showtime) => {
                                    return (
                                        <Box onClick={() => SelectMovie(showtime.id)} className="flex  w-full my-1 hover:bg-red-300 px-2 py-3 border border-black rounded-md gap-y-3 cursor-pointer">
                                            <Box className='flex flex-col h-full justify-center w-1/2 sm:w-1/3 md:w-1/4 xl:w-1/4 my-1 sm:my-0'>
                                                <img src={GetMovieById(showtime.movie_id)?.imageUrl} alt="" className='h-2/3 min-h-1/2 sm:h-full w-full object-cover rounded-md' />
                                                <Box className="flex justify-center w-full h-auto sm:hidden rounded-md mt-1 mb-3">
                                                    <Box className=" relative flex-wrap flex-row justify-center w-full bg-amber-300 rounded-md my-1 py-6">
                                                        <Box className="font-bold w-full text-center absolute top-0">
                                                            information
                                                        </Box>
                                                        <Box className="text-sm w-full text-center">
                                                            Available Seats : {showtime.available_seats}
                                                        </Box>
                                                        <Box className="text-sm w-full text-center">
                                                            Date : {showtime.date}
                                                        </Box>
                                                        <Box className="text-sm w-full text-center">
                                                            Start At : {showtime.start_time}
                                                        </Box>
                                                        <Box className="text-sm w-full text-center">
                                                            End At : {showtime.end_time}
                                                        </Box>
                                                        <Box className="text-sm w-full text-center">
                                                            Price : {showtime.price}$
                                                        </Box>

                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Box className="flex flex-col justify-center  items-center w-2/3 md:w-4/5 h-full">
                                                <Box> <Typography className='text-base font-bold mt-1 text-center' >{GetMovieById(showtime.movie_id)?.title}</Typography></Box>
                                                <Box className='flex flex-col justify-center md:flex-row w-full h-full'>
                                                    <Box className="w-full  md:w-2/3 bg-cyan-300 rounded-md mx-1 my-1 flex flex-col items-center ">
                                                        <Box className="w-full "> <Typography variant="body2" className='px-5 py-2 text-justify  sm:text-sm' >{GetMovieById(showtime.movie_id)?.description}</Typography></Box>
                                                        <Box className="flex flex-wrap w-full items-center justify-center ">
                                                            <Typography variant="body2" className='px-5 py-2 w-full sm:w-1/2 sm:text-sm text-center' >Genre : {GetMovieById(showtime.movie_id)?.genre}</Typography>
                                                            <Typography variant="body2" className='px-5 py-2 w-full sm:w-1/2 sm:text-sm text-center' >Realease Year : {GetMovieById(showtime.movie_id)?.releaseYear}</Typography>
                                                        </Box>
                                                        <Box className="flex justify-center border rounded-md px-2 py-1 ">
                                                            <Rating name="read-only" value={GetMovieById(showtime.movie_id)?.rating} precision={0.1} readOnly />
                                                        </Box>
                                                        <Box className=" flex justify-center ">
                                                            <Typography className='text-xs text-gray-400 my-1'>
                                                                {GetMovieById(showtime.movie_id)?.ratingCount} votes ,
                                                                {GetMovieById(showtime.movie_id)?.rating}
                                                                <FavoriteIcon className='text-red-500 size-4'></FavoriteIcon>
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box className="hidden items-center justify-center w-full md:w-1/3 sm:flex rounded-md mx-1 ">
                                                        <Box className=" relative flex-wrap flex-row justify-center items-center md:flex-col w-1/2 md:w-full bg-amber-300 rounded-md mx-1 my-1 py-1">
                                                            <Box className="font-bold w-full text-center absolute top-0">
                                                                information
                                                            </Box>
                                                            <Box className="text-sm w-full text-center mt-7">
                                                                Available Seats : {showtime.available_seats}
                                                            </Box>
                                                            <Box className="text-sm w-full text-center">
                                                                Date : {showtime.date}
                                                            </Box>
                                                            <Box className="text-sm w-full text-center">
                                                                Start At : {showtime.start_time}
                                                            </Box>
                                                            <Box className="text-sm w-full text-center">
                                                                End At : {showtime.end_time}
                                                            </Box>
                                                            <Box className="text-sm w-full text-center">
                                                                Price : {showtime.price}$
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )
                                })

                                : <Box className="w-full h-full flex justify-center items-center"><CircularProgress></CircularProgress></Box>
                        }
                    </Box>
                </Fade>
            </Modal >
        </>
    )
}
