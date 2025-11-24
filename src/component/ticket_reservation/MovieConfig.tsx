import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Fade from '@mui/material/Fade'
import Modal from '@mui/material/Modal'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'
import FavoriteIcon from '@mui/icons-material/Favorite';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import React, { FormEvent, useState } from 'react'
import axios from 'axios'
import { movie } from './CinemaHome'
import Backdrop from '@mui/material/Backdrop'
import TextField from '@mui/material/TextField'

interface movieListProps {
    movieInfo: movie[],
}

export const MovieConfig = ({ movieInfo }: movieListProps) => {


    // open a modal that indicates list of movies
    const [isOpenMovie, setIsOpenMovie] = useState<boolean>(false);

    // open a modal that give info about a showtime
    const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);

    // wait for response
    const [isWait, setIsWait] = useState<boolean>(false)


    // selected movie ID
    const [selectedID, setSelectedID] = useState<number>(-1)


    // errors for inputs
    const [errors, setErrors] = useState<boolean[]>([false, false, false, false, false])

    // edit or add ?
    const [operation, setOperation] = useState<string>("")

    // user input
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [genre, setGenre] = useState<string>("")
    const [releaseYear, setReleaseYear] = useState<number>(0)
    const [file, setFile] = useState<File | null>(null)

    const GetMovieById = (ID: number): movie | undefined => {

        for (let index = 0; index < movieInfo.length; index++) {
            if (movieInfo[index].id === ID) {
                return movieInfo[index]
            }
        }

    }


    const AddMovieHandler = () => {
        setIsOpenMovie(!isOpenMovie)
        setIsOpenInfo(!isOpenInfo)
        setOperation("ADD")
    }

    const EditHandler = async (movieID: number): Promise<void> => {
        setSelectedID(movieID)
        setIsOpenMovie(!isOpenMovie)
        setIsOpenInfo(!isOpenInfo)
        setOperation("EDIT")

        const movieSelectedInfo = GetMovieById(movieID)

        setTitle(movieSelectedInfo?.title || "")
        setDescription(movieSelectedInfo?.description || "")
        setGenre(movieSelectedInfo?.genre || "")
        setReleaseYear(movieSelectedInfo?.releaseYear || 2000)
    }

    const SubmitHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        const formData = new FormData();
        if (!title) {
            setErrors([true, false, false, false, false])
            return alert("Title is required.")
        }
        if (!description) {
            setErrors([false, true, false, false, false])
            return alert("Description is required.")
        }
        if (!genre) {
            setErrors([false, false, true, false, false])
            return alert("Gender is required.")
        }
        if (releaseYear === 0) {
            setErrors([false, false, false, true, false])
            return alert("Release year is required.")
        }
        if (operation === "ADD") {
            if (!file) {
                setErrors([false, false, false, false, true])
                return alert("Poster image is required.")
            } else {
                formData.append("file", file);
            }
        }

        setIsOpenInfo(!isOpenInfo)
        setIsWait(!isWait)

        formData.append("title", title);
        formData.append("description", description);
        formData.append("genre", genre);
        formData.append("releaseYear", releaseYear.toString());

        if (operation === "ADD") {
            await axios.post("https://super-web-application-backend-production.up.railway.app/movies", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

        }
        else {
            if (file) {
                formData.append("file", file);
            }
            if (operation === "EDIT") {
                await axios.put(`https://super-web-application-backend-production.up.railway.app/movies/${selectedID}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            }
        }
        setIsWait(!isWait)
        window.location.reload()
    }

    const DeleteHandler = async (movieID: number): Promise<void> => {
        setIsOpenMovie(!isOpenMovie)
        setIsWait(!isWait)
        await axios.delete(`https://super-web-application-backend-production.up.railway.app/movies/${movieID}`)
        setIsWait(!isWait)
        window.location.reload()
    }


    return (
        <>
            <Box className='flex justify-center'>
                <Button variant="text" onClick={() => setIsOpenMovie(!isOpenMovie)} className='flex justify-center gap-2 bg-sky-500 text-white hover:bg-sky-600' >
                    <Typography variant="body1" > Movie Config </Typography>
                    <LiveTvIcon></LiveTvIcon>
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

                    <Box className="flex flex-col items-center w-11/12 md:w-3/5 lg:w-1/2 xl:w-1/2 h-2/3 md:h-3/4 xl:h-4/5 absolute top-1/2 left-1/2 bg-teal-100 -translate-y-1/2 -translate-x-1/2   ">
                        <Box className="w-full h-full flex flex-col items-center overflow-y-scroll px-1 py-2  md:px-7 md:py-6">
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
                                                    <Box className="flex justify-center w-full ">
                                                        <Button variant="contained" className='bg-green-700 hover:bg-green-800 my-2 mx-1' onClick={() => EditHandler(movie.id)}   > Edit </Button>
                                                        <Button variant="contained" className=' bg-rose-600  hover:bg-rose-700 my-2 mx-1' onClick={() => DeleteHandler(movie.id)} > Delete </Button>
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
                        <Box className="w-full flex justify-center py-3 bg-slate-400">
                            <Button onClick={AddMovieHandler} variant="contained" className='bg-fuchsia-600 hover:bg-fuchsia-700'>
                                Add Movie
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>


            <Modal
                open={isOpenInfo}
                onClose={() => {
                    setIsOpenInfo(!isOpenInfo)
                    setTitle("")
                    setDescription("")
                    setGenre("")
                    setReleaseYear(0)
                    setErrors([false, false, false, false, false])
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
                            <TextField
                                error={errors[0]}
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10'
                            />

                            <TextField
                                error={errors[1]}
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10'
                            />

                            <TextField
                                error={errors[2]}
                                label="Genre"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10'
                            />

                            <TextField
                                type="number"
                                error={errors[3]}
                                label="Release Year"
                                value={releaseYear}
                                onChange={(e) => setReleaseYear(Number(e.target.value))}
                                className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10'
                            />

                            <TextField
                                type="file"
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: { accept: "image/*" }
                                }}
                                error={errors[4]}
                                label="Poster Image"
                                onChange={(e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) setFile(file);
                                }}
                                className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10'
                            />


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
        </>)
}


