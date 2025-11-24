import React, { FormEvent, useState } from 'react'
import { movie, showtime } from './CinemaHome';
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
import TextField from '@mui/material/TextField';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';


interface showtimeProps {
    movieInfo: movie[],
    showtimes: showtime[]
}

export const ShowtimeConfig = ({ movieInfo, showtimes }: showtimeProps) => {

    // open a modal that indicates list of showtimes
    const [isOpenShowtimes, setIsOpenShowtimes] = useState<boolean>(false)

    // open a modal that indicates list of movies
    const [isOpenMovie, setIsOpenMovie] = useState<boolean>(false);

    // open a modal that give info about a showtime
    const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);

    // wait for respose
    const [isWait, setIsWait] = useState<boolean>(false)

    // save movie ID that select for new showtime
    const [selectedMovieID, setSelectedMovieID] = useState<number>(-1)

    // save showtime ID that select for edit
    const [selectedShowtimeID, setSelectedShowtimeID] = useState<number>(-1)


    // errors for inputs
    const [errors, setErrors] = useState<boolean[]>([false, false, false, false])

    // edit or add ?
    const [operation, setOperation] = useState<string>("")

    // user input
    const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10))
    const [startTime, setStartTime] = useState<string>(new Date().toISOString().slice(11, 19))
    const [endTime, setEndTime] = useState<string>(new Date().toISOString().slice(11, 19))
    const [price, setPrice] = useState<number>(0)


    const GetMovieById = (ID: number): movie | undefined => {

        for (let index = 0; index < movieInfo.length; index++) {
            if (movieInfo[index].id === ID) {
                return movieInfo[index]
            }
        }

    }

    const GetShowtimesById = (ID: number): showtime | undefined => {

        for (let index = 0; index < showtimes.length; index++) {
            if (showtimes[index].id === ID) {
                return showtimes[index]
            }
        }
    }

    const AddMovieHandler = () => {
        setIsOpenMovie(!isOpenMovie)
        setIsOpenShowtimes(!isOpenShowtimes)
        setOperation("ADD")
    }

    const EditHandler = async (showtimeID: number): Promise<void> => {

        setIsOpenShowtimes(!isOpenShowtimes)
        setIsOpenMovie(!isOpenMovie)
        setOperation("EDIT")
        setSelectedShowtimeID(showtimeID)

        setDate(GetShowtimesById(showtimeID)?.date.toString() || "2000-01-01")
        setStartTime(GetShowtimesById(showtimeID)?.start_time.toString() || "00:00:00")
        setEndTime(GetShowtimesById(showtimeID)?.end_time.toString() || "00:00:00")
        setPrice(GetShowtimesById(showtimeID)?.price || 0)
    }

    const SelectMovie = (movieID: number): void => {
        setIsOpenMovie(!isOpenMovie)
        setIsOpenInfo(!isOpenInfo)
        setSelectedMovieID(movieID)
    }

    const SubmitHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        const formData = new FormData();
        if (!date) {
            setErrors([true, false, false, false])
            return alert("Date is required.")
        }
        if (!startTime) {
            setErrors([false, true, false, false])
            return alert("Start time is required.")
        }
        if (!endTime) {
            setErrors([false, false, true, false])
            return alert("End time is required.")
        }
        if (price === 0) {
            setErrors([false, false, false, true])
            return alert("Price is required.")
        }
        setIsOpenInfo(!isOpenInfo)
        setIsWait(!isWait)

        formData.append("date", date);
        formData.append("start_time", startTime);
        formData.append("end_time", endTime);
        formData.append("price", price.toString());
        formData.append("movie_id", selectedMovieID.toString());

        if (operation === "ADD") {
            await axios.post("https://super-web-application-backend-production.up.railway.app/showtimes", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

        }
        else {
            if (operation === "EDIT") {
                await axios.put(`https://super-web-application-backend-production.up.railway.app/showtimes/${selectedShowtimeID}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            }
        }

        setIsWait(!isWait)
        window.location.reload()
    }

    const DeleteHandler = async (showtimeID: number): Promise<void> => {
        setIsOpenShowtimes(!isOpenShowtimes)
        setIsWait(!isWait)

        await axios.delete(`https://super-web-application-backend-production.up.railway.app/showtimes/${showtimeID}`)

        setIsWait(!isWait)
        window.location.reload()
    }




    return (
        <>
            <Box className='flex justify-center '>
                <Button variant="text" onClick={() => setIsOpenShowtimes(!isOpenShowtimes)} className='flex justify-center gap-2 bg-green-500 text-white hover:bg-green-600' >
                    <Typography variant="body1" > showtimes config </Typography>
                    <MovieIcon ></MovieIcon>
                </Button>
            </Box>

            <Modal
                open={isOpenShowtimes}
                onClose={() => { setIsOpenShowtimes(!isOpenShowtimes) }}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={isOpenShowtimes} >
                    <Box className="w-full md:w-5/6 lg:w-3/4 xl:w-3/5 h-4/5 lg:h-[90%]  absolute top-1/2 left-1/2 bg-teal-100 -translate-y-1/2 -translate-x-1/2  flex flex-col items-center ">
                        <Box className="w-full h-full px-2  flex flex-col items-center overflow-y-scroll " >
                            {
                                showtimes.length > 0 ?
                                    showtimes.map((showtime) => {
                                        return (
                                            <Box className="flex flex-col  w-full  my-1 hover:bg-neutral-500 px-2 py-3 border border-black rounded-md gap-y-3 cursor-pointer">
                                                <Box className="flex  w-full  gap-y-3">
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
                                                <Box className="flex justify-center w-full gap-x-2">
                                                    <Button variant="contained" className='bg-green-700 hover:bg-green-800' onClick={() => EditHandler(showtime.id)}> Edit </Button>
                                                    <Button variant="contained" className=' bg-rose-600  hover:bg-rose-700' onClick={() => DeleteHandler(showtime.id)}> Delete </Button>
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
                        <Box className="w-full flex justify-center py-3 bg-slate-400">
                            <Button onClick={AddMovieHandler} variant="contained" className='bg-fuchsia-600 hover:bg-fuchsia-700'>
                                Add Showtime
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

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
                                        <Box onClick={() => SelectMovie(movie.id)} className="w-full flex justify-center hover:bg-red-300 my-1 border border-black rounded-md ">
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

            <Modal
                open={isOpenInfo}
                onClose={() => {
                    setIsOpenInfo(!isOpenInfo)
                    setDate(new Date().toISOString().slice(0, 10))
                    setStartTime(new Date().toISOString().slice(11, 19))
                    setPrice(0)
                    setErrors([false,false,false,false])
                }
                }
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className='w-11/12 md:w-3/4 lg:w-1/2 h-auto overflow-y-scroll flex-col item-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-100 border'>
                    {isWait ?
                        <Box className="flex justify-center items-center w-full h-full">
                            <CircularProgress className='text-black'></CircularProgress>
                        </Box>
                        :
                        <form action="" className='flex flex-col items-center px-4' onSubmit={(e) => SubmitHandler(e)} >
                            <TextField type="date" error={errors[0]} label="Date" value={date} onChange={(e) => setDate(e.target.value)} className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10' />
                            <TextField type="time" error={errors[1]} label="Start Time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10' />
                            <TextField type="time" error={errors[2]} label="End Time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10' />
                            <TextField type="number" error={errors[3]} label="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10' />
                            <div className="flex justify-center w-full">
                                <Button
                                    className="w-1/3 md:w-1/4 xl:w-1/5 border-0 bg-sky-400 text-white rounded-md px-5 py-3 my-3 hover:shadow-lg hover:bg-[rgba(56,189,248,.9)]"
                                    type="submit"
                                >
                                    {
                                        operation === "ADD" ?
                                            "Submit"
                                            :
                                            operation === "EDIT" ?
                                                "Edit"
                                                :
                                                ""
                                    }
                                </Button>
                            </div>
                        </form>
                    }
                </Box>
            </Modal>

            <Modal
                open={isWait}
                onClose={() => setIsWait(!isWait)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className='w-1/2 md:w-1/3 lg:w-1/4 h-1/4  flex-col item-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-100 border'>
                    <Box className="flex flex-col gap-y-2 justify-center items-center w-full h-full">
                        <CircularProgress className='text-black'></CircularProgress>
                        <Typography variant="body2" color="initial">
                            please wait ...
                        </Typography>
                    </Box>
                </Box>
            </Modal>


        </>
    )
}
