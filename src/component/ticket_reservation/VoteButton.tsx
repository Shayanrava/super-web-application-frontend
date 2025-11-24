import { FormEvent, useState } from 'react'
import axios from 'axios';
import { movie, showtime } from "./CinemaHome"
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import Modal from '@mui/material/Modal';
import { Backdrop, CircularProgress, Fade, Rating, TextField } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RadioGroupRating from './RadioGroupRating';



interface voteProp {
    movieInfo: movie[]
}

export const VoteButton = ({ movieInfo }: voteProp) => {



    // open a modal that indicates list of showtimes that users reserve
    const [isOpenShowtimes, setIsOpenShowtimes] = useState<boolean>(false);

    // open a modal that give info about a showtime
    const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);


    // open a modal for vote registration
    const [isOpenVote, setIsOpenVote] = useState<boolean>(false)

    // wait for response
    const [isWait, setIsWait] = useState<boolean>(false)

    // selected showtime and movie
    const [selectedShowtimeID, setSelectedShowtimeID] = useState<number>(-1)
    const [selectedMovieID, setSelectedMovieID] = useState<number>(-1)


    // what movies user reserve ? 
    const [showtimes, setShowtimes] = useState<showtime[]>([])

    // errors for inputs
    const [errors, setErrors] = useState<boolean[]>([false, false])

    // user input
    const [name, setName] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    // number vote
    const [value, setValue] = useState<number>(3)



    const GetShowtimes = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        const formData = new FormData();
        if (!name) {
            setErrors([true, false])
            return alert("Name is required.")
        }
        if (!password) {
            setErrors([false, true])
            return alert("Password is required.")
        }
        setIsOpenInfo(false)
        setIsWait(true)
        formData.append("name", name);
        formData.append("password", password);
        const res = await axios.post("https://super-web-application-backend-production.up.railway.app/users-showtimes", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        setShowtimes(res.data)
        setIsWait(false)
        setIsOpenShowtimes(true)

    }

    const GetMovieById = (ID: number): movie | undefined => {

        for (let index = 0; index < movieInfo.length; index++) {
            if (movieInfo[index].id === ID) {
                return movieInfo[index]
            }
        }
    }

    const SelectMovie = (showTimeID: number, movieID: number): void => {
        setSelectedShowtimeID(showTimeID)
        setSelectedMovieID(movieID)
        setIsOpenVote(true)
        setIsOpenShowtimes(false)
    }

    const SendVote = async (): Promise<void> => {
        const formData = new FormData();
        if (!name) {
            setErrors([true, false])
            return alert("Name is required.")
        }
        if (!password) {
            setErrors([false, true])
            return alert("Password is required.")
        }
        setIsOpenVote(false)
        setIsWait(true)
        formData.append("name", name);
        formData.append("password", password);
        formData.append("vote", value.toString());
         await axios.post(`https://super-web-application-backend-production.up.railway.app/reservation/${selectedShowtimeID}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        setIsWait(false)
        window.location.reload()
    }
    return (
        <>
            <Box className='flex justify-center bg-red '>
                <Button variant="text" onClick={() => setIsOpenInfo(!isOpenInfo)} className='flex justify-center gap-2 bg-red-500 text-white hover:bg-red-600' >
                    <Typography variant="body1" > Vote Now </Typography>
                    <HowToVoteIcon></HowToVoteIcon>
                </Button>
            </Box>

            <Modal
                open={isOpenInfo}
                onClose={() => {
                    setIsOpenInfo(!isOpenInfo)
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
                        <form action="" className='flex flex-col items-center px-4' onSubmit={(e) => GetShowtimes(e)}>
                            <TextField
                                error={errors[0]}
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10'
                            />

                            <TextField
                                error={errors[1]}
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10'
                            />


                            <div className="flex justify-center w-full">
                                <Button
                                    className="w-1/3 md:w-1/4 xl:w-1/5 border-0 bg-sky-400 text-white rounded-md px-5 py-3 my-3 hover:shadow-lg hover:bg-[rgba(56,189,248,.9)]"
                                    type="submit"
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    }
                </Box>
            </Modal>

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
                                            <Box onClick={() => { SelectMovie(showtime.id, showtime.movie_id) }} className="flex flex-col  w-full  my-1 hover:bg-neutral-500 px-2 py-3 border border-black rounded-md gap-y-3 cursor-pointer">
                                                <Box className="flex  w-full  gap-y-3">
                                                    <Box className='flex flex-col h-full justify-center w-1/2 sm:w-1/3 md:w-1/4 xl:w-1/4 my-1 sm:my-0'>
                                                        <img src={GetMovieById(showtime.movie_id)?.imageUrl} alt="" className='h-2/3 min-h-1/2 sm:h-full w-full object-cover rounded-md' />
                                                        <Box className="flex justify-center w-full h-auto sm:hidden rounded-md mt-1 mb-3">
                                                            <Box className=" relative flex-wrap flex-row justify-center w-full bg-amber-300 rounded-md my-1 py-6">
                                                                <Box className="font-bold w-full text-center absolute top-0">
                                                                    information
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
                                            </Box>
                                        )
                                    })
                                    :
                                    <Box className="flex justify-center items-center w-full h-full">
                                        <CircularProgress className='text-green-600'></CircularProgress>
                                    </Box>
                            }
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            <Modal
                open={isOpenVote}
                onClose={() => { setIsOpenVote(!isOpenVote) }}
                closeAfterTransition

                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={isOpenVote}>
                    <Box className="flex flex-col items-center w-full md:w-3/5 lg:w-1/2 xl:w-1/2 h-2/3 md:h-3/4 xl:h-4/5 absolute top-1/2 left-1/2 bg-teal-100 -translate-y-1/2 -translate-x-1/2  ">
                        <Box className="flex flex-col items-center overflow-y-scroll w-full h-full    px-1 py-2 md:px-7 md:py-6 ">
                            {
                                movieInfo.length > 0 ?

                                    <Box className="w-full flex justify-center hover:bg-red-300 my-1 border border-black rounded-md ">
                                        <Box className="w-1/2   bg-cyan-300 rounded-md mx-1 my-1 flex flex-col items-center justify-center">
                                            <Box><Typography variant="body2" color="initial" className='text-center font-bold mb-3'>{GetMovieById(selectedMovieID)?.title}</Typography> </Box>
                                            <Box className="w-full "> <Typography variant="body2" className='px-5 py-2 text-justify  sm:text-sm' >{GetMovieById(selectedMovieID)?.description}</Typography></Box>
                                            <Box className="flex flex-col w-full items-center justify-center ">
                                                <Typography variant="body2" className='px-5 py-2 w-full  sm:text-sm text-center' >Genre : {GetMovieById(selectedMovieID)?.genre}</Typography>
                                                <Typography variant="body2" className='px-5 py-2 w-full  sm:text-sm text-center' >Realease Year : {GetMovieById(selectedMovieID)?.releaseYear}</Typography>
                                            </Box>
                                            <Box className="flex justify-center border rounded-md px-2 py-1 ">
                                                <Rating name="read-only" value={GetMovieById(selectedMovieID)?.rating} precision={0.1} readOnly />
                                            </Box>
                                            <Box className=" flex justify-center ">
                                                <Typography className='text-xs text-gray-400 my-1'>
                                                    {GetMovieById(selectedMovieID)?.ratingCount} votes ,
                                                    {GetMovieById(selectedMovieID)?.rating}
                                                    <FavoriteIcon className='text-red-500 size-4'></FavoriteIcon>
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box className="w-1/2 my-1 mx-1">
                                            <img src={GetMovieById(selectedMovieID)?.imageUrl} alt="" className='rounded-md object-cover w-full h-full' />
                                        </Box>
                                    </Box>

                                    :
                                    <Box className="flex justify-center items-center w-full h-full">
                                        <CircularProgress className='text-green-600'></CircularProgress>
                                    </Box>
                            }

                        </Box>
                        <Box className=" w-full bg-gray-300 flex flex-col justify-center items-center py-2 px-1 gap-y-3">
                            <RadioGroupRating value={value} setValue={setValue}></RadioGroupRating>
                            <Button variant="contained" onClick={SendVote}> Register Vote </Button>
                        </Box>
                    </Box>
                </Fade>
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
