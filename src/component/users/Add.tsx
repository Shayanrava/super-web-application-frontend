import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from "@mui/material/CircularProgress";
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState, FormEvent } from "react";
import axios from "axios";


export default function Add() {

    const [name, setName] = useState<string>()
    const [passwors, setPassword] = useState<string>()
    const [age, setAge] = useState<string>()
    const [url, setUrl] = useState<string>()
    const [nationality, setNationality] = useState<string>()
    const [open, setOpen] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [passwordType, setPasswordType] = useState<string>("password")
    const [errors, setErrors] = useState<boolean[]>([false, false, false, false])

    const submitHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        const formData = new FormData();

        if (!name) {
            setErrors([true, false, false, false])
            return alert("Name is required.")
        }
        if (!passwors) {
            setErrors([false, true, false, false])
            return alert("Password is required.")
        }
        if (!age) {
            setErrors([false, false, true, false])
            return alert("Age is required.")
        }
        if (!nationality) {
            setErrors([false, false, false, true])
            return alert("Nationality is required.")
        }
        formData.append("name", name);
        formData.append("password", passwors);
        formData.append("age", age);
        formData.append("nationality", nationality);
        if (url) {
            formData.append("url", url);
        }
        setOpen(!open)
        const res: any = await axios.post("https://super-web-application-backend-production.up.railway.app/users", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        if (res.data.msg === "Validation error") {
             alert("This name has already been used.")
             setErrors([true, false, false, false])
             setOpen(false)
        } else {
            window.location.reload()
        }
    }
    const visiblePassword = () => {
        if (isVisible) {
            setPasswordType("password")
        } else {
            setPasswordType("text")
        }
        setIsVisible(!isVisible)
    }

    return (
        <div className="w-full flex justify-center my-28 ">
            <div className="w-full md:w-5/6 lg:w-3/4 border border-black flex-col item-center bg-gray-300">
                <form action="" className='flex flex-col items-center' onSubmit={(e) => submitHandler(e)} >
                    <TextField error={errors[0]} label="Name" value={name} onChange={(e) => setName(e.target.value)} className='w-5/6 mx-1 my-3 lg:w-2/3 lg:my-7 lg:mx-10' />
                    <TextField error={errors[1]} label="Password" type={passwordType} value={passwors} onChange={(e) => setPassword(e.target.value)} className='w-5/6  my-3 lg:w-2/3 lg:my-7 lg:mx-10'
                        slotProps={{
                            input: {
                                endAdornment:
                                    <Button className='text-black ' onClick={() => visiblePassword()}>
                                        {
                                            isVisible ?
                                                <VisibilityOffIcon></VisibilityOffIcon>
                                                :
                                                <VisibilityIcon></VisibilityIcon>
                                        }
                                    </Button>,
                            },
                        }}
                    />
                    <TextField error={errors[2]} label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className='w-5/6 my-3 lg:w-2/3 lg:my-7 lg:mx-10' />
                    <TextField error={errors[3]} label="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} className='w-5/6 mx-1 my-3 lg:w-2/3 lg:my-7 lg:mx-10' />
                    <TextField label="Profile URL" value={url} onChange={(e) => setUrl(e.target.value)} className='w-5/6 mx-1 my-3 lg:w-2/3 lg:my-7 lg:mx-10' />

                    <div className="flex justify-center w-full">
                        <Button
                            className="w-1/5 border-0 bg-sky-400 text-white rounded-md px-5 py-3 my-3 hover:shadow-lg hover:bg-[rgba(56,189,248,.9)]"
                            type="submit"
                        >
                            ADD
                        </Button>
                    </div>
                </form>
                <Box className="w-full flex justify-center my-7">
                    <Card className="w-4/5 bg-blue-200 rounded-lg overflow-visible relative sm:w-1/2 lg:w-1/3 xl:w-1/4">
                        <CardHeader
                            avatar={
                                <Avatar aria-label="" >
                                    {
                                        url ?
                                            <img src={url} className=" object-cover w-full h-full" alt="" />
                                            :
                                            name && <Typography className="bg-black text-white w-full h-full flex items-center justify-center">{name ? name[0].toUpperCase() : ""}</Typography>
                                    }
                                </Avatar>
                            }
                            title={
                                <Typography variant="h5" component="div" className="text-lg">
                                    {name}
                                </Typography>
                            }
                            subheader={
                                <Typography variant="body2" color="text.secondary">
                                    {nationality}
                                </Typography>
                            }

                        />
                        <CardContent sx={{ height: '100%' }} >
                            {
                                age &&
                                <Typography variant="body2" className="bg-cyan-300 rounded-2xl inline-block px-3 py-1 absolute -top-3 -left-3  z-50">
                                    {age} years
                                </Typography>
                            }

                            <Box className="flex flex-col md:flex-row gap-3 ">
                                <Button variant="contained" color="success" >edit</Button>
                                <Button variant="contained" color="error" >delete</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>


                <Modal
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className='w-11/12 md:w-1/2  xl:w-1/3 h-2/5 bg-blue-400 px-5 flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border'>
                        <Typography variant="body1" className="text-center text-white">Please wait… the Railway server might be sleeping.</Typography>
                        <CircularProgress className="text-cyan-200 my-6" />
                    </Box>
                </Modal>
            </div >
        </div >

    )
}
