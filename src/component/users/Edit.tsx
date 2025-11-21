import { useState, FormEvent, useEffect } from 'react'
import Button from '@mui/material/Button'
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import { People } from "./Home";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress'
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from "axios";

interface Props {
    people: People[],
    ID: number

}

export default function Edit({ people, ID }: Props) {

    const targetPerson: People | undefined = people.find(person => person.id === ID);
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [name, setName] = useState<string>(targetPerson ? targetPerson.name : "")
    const [password, setPassword] = useState<string>(targetPerson ? targetPerson.password : "")
    const [age, setAge] = useState<string>(targetPerson ? targetPerson.age : "")
    const [url, setUrl] = useState<string>(targetPerson && targetPerson.url ? targetPerson.url : "")
    const [nationality, setNationality] = useState<string>(targetPerson ? targetPerson.nationality : "")
    const [errors, setErrors] = useState<boolean[]>([false, false, false, false])
    const [openWait, setOpenWait] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [passwordType, setPasswordType] = useState<string>("password")

    useEffect(() => {
        if (targetPerson) {
            setName(targetPerson.name);
            setPassword(targetPerson.password)
            setAge(targetPerson.age);
            setUrl(targetPerson.url || "");
            setNationality(targetPerson.nationality);
        }
    }, [targetPerson]);

    const submitHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        if (!name) {
            setErrors([true, false, false, false])
            return alert("Name is required.")
        }
        if (!password) {
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
        const formData: FormData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        formData.append("age", age);
        formData.append("nationality", nationality);
        if (url) {
            formData.append("url", url);
        }
        setOpenWait(!openWait)
        const res: any = await axios.put(`https://super-web-application-backend-production.up.railway.app/users/${ID}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        if (res.data.msg === "Validation error") {
            alert("This name has already been used.")
            setErrors([true, false, false, false])
            setOpenWait(false)
        } else {
            window.location.reload()
        }
    }

    const ClickHandler = (): void => {
        setIsOpen(!isOpen)
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
        <>
            <Button variant="contained" color="success" className="w-full my-2 mx-0 md:my-0 md:mx-3 md:w-auto " onClick={ClickHandler}>edit <EditDocumentIcon className="mx-1"></EditDocumentIcon> </Button>

            <Modal
                open={isOpen}
                onClose={() => setIsOpen(!isOpen)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className='w-11/12 md:w-3/4 lg:w-2/3 h-4/5 overflow-scroll flex-col item-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border'>
                    <form action="" className='flex flex-col items-center px-4' onSubmit={(e) => submitHandler(e)} >
                        <TextField error={errors[0]} label="Name" value={name} onChange={(e) => setName(e.target.value)} className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10' />
                        <TextField error={errors[1]} label="Password" type={passwordType} value={password} onChange={(e) => setPassword(e.target.value)} className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10'
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
                        <TextField error={errors[1]} label="Age" value={age} onChange={(e) => setAge(e.target.value)} className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10' />
                        <TextField error={errors[2]} label="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10' />
                        <TextField label="Profile URL" value={url} onChange={(e) => setUrl(e.target.value)} className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 my-7 mx-10' />
                        <div className="flex justify-center w-full">
                            <Button
                                className="w-1/3 md:w-1/4 xl:w-1/5 border-0 bg-sky-400 text-white rounded-md px-5 py-3 my-3 hover:shadow-lg hover:bg-[rgba(56,189,248,.9)]"
                                type="submit"
                            >
                                edit
                            </Button>
                        </div>
                    </form>
                    <Box className="w-full flex justify-center my-7 px-1">
                        <Card className="w-11/12 sm:w-3/5 lg:w-1/2 xl:w-2/5 bg-blue-200 rounded-lg overflow-visible relative ">
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
                                    <Typography className='text-lg' variant="h5" component="div">
                                        {name}
                                    </Typography>
                                }
                                subheader={
                                    <Typography className='text-sm' variant="body2" color="text.secondary">
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

                                <Box className="flex flex-col md:flex-row gap-3">
                                    <Button className="w-full md:w-auto" variant="contained" color="success" >edit <EditDocumentIcon className="mx-1"></EditDocumentIcon></Button>
                                    <Button className="w-full md:w-auto" variant="contained" color="error" >delete <DeleteForeverIcon className="mx-1"></DeleteForeverIcon></Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={openWait}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className='w-11/12 md:w-1/2  xl:w-1/3 h-2/5 bg-green-300 px-5 flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border'>
                    <Typography variant="body1" className="text-center text-white">Please wait… the Railway server might be sleeping.</Typography>
                    <CircularProgress className="text-emerald-600 my-6" />
                </Box>
            </Modal>
        </>
    )
}
