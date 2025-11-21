import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { reserve } from './CinemaHome';
import axios, { AxiosResponse } from 'axios';
import Fade from '@mui/material/Fade';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

interface BuyProps {
    seatSelectArr: number[],
    btnArr: reserve[],
    setBtnArr: React.Dispatch<React.SetStateAction<reserve[]>>,
    selectedShowtimeID: number,
    setSeatSelectArr: React.Dispatch<React.SetStateAction<number[]>>
    setNumberSelectedSeat: React.Dispatch<React.SetStateAction<number>>,
}

export const BuyButton = ({ seatSelectArr, btnArr, setBtnArr, selectedShowtimeID, setSeatSelectArr, setNumberSelectedSeat }: BuyProps) => {

    //static images url for random selection 
    const images: string[] = [
        process.env.PUBLIC_URL + '/shopping1.gif',
        process.env.PUBLIC_URL + '/shopping2.gif',
        process.env.PUBLIC_URL + '/shopping3.gif',
        process.env.PUBLIC_URL + '/shopping4.gif',
        process.env.PUBLIC_URL + '/Failed1.gif',
        process.env.PUBLIC_URL + '/Failed2.gif',
    ]

    // Opens a modal that indicates whether the shop was successful or not
    const [isOpenResult, setIsOpenResult] = useState<boolean>(false)

    // a boolean for the shop was successful or not
    const [isSuccessShop, setIsSuccessShop] = useState<boolean>(false)

    // name and password and ID user who want buy movie
    const [userID, setUserID] = useState<number>(-1)
    const [userName, setUserName] = useState<string>("")
    const [userPassword, setUserPassword] = useState<string>("")


    const [isWaitRegister, setIsWaitRegister] = useState<boolean>(false)

    useEffect(() => {
        if (userID >= 0) {
            BuyHandler()
        }
    }, [userID])

    const BuyHandler = async (): Promise<void> => {
        setIsOpenResult(true)
        if (seatSelectArr.length === 0 || userID < 0) {
            console.log(`${seatSelectArr}  ${userID}`);
            setIsSuccessShop(false);
            return;
        }
        seatSelectArr.forEach(async (i) => {
            const now = new Date();
            const formData = new FormData();
            formData.append("user_id", userID.toString());
            formData.append("showtime_id", selectedShowtimeID.toString());
            formData.append("seat_number", (i).toString());
            formData.append("booking_time", now.toString());
            await axios.post("https://super-web-application-backend-production.up.railway.app/reservation", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        })
        const tempArr: reserve[] = [...btnArr]
        seatSelectArr.forEach((i) => {
            tempArr[i - 1].isReserve = true;
            tempArr[i - 1].isSelected = false;
        })
        setBtnArr(tempArr);
        setNumberSelectedSeat(0)
        setIsSuccessShop(true);
        setSeatSelectArr([])
    }
    const RegisterHandler = async (): Promise<void> => {

        if (userName === "" || userPassword === "") {
            return alert("Username and password are requaierd")
        }
        setIsWaitRegister(true)
        const res: AxiosResponse<any, any, {}> = await axios.post(
            "https://super-web-application-backend-production.up.railway.app/userID",
            { name: userName, password: userPassword }
        )
        if (res.data) {
            const id = res.data.id
            setUserID(id)
            console.log(`${userID}`);
        } else {
            alert("The username or password is incorrect.")
        }
        setIsWaitRegister(false)
    }

    return (
        <>
            <Box className='w-full flex justify-center'>
                <Button variant="text" className='flex justify-center gap-2 bg-[#ff9800] text-white hover:bg-[#e68900] ' onClick={BuyHandler}>
                    <Typography variant="body1" >BUY</Typography>
                    <AddShoppingCartIcon ></AddShoppingCartIcon>
                </Button>
            </Box>
            <Modal
                open={isOpenResult}
                onClose={() => { setIsOpenResult(!isOpenResult) }}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={isOpenResult}>
                    <Box className={`${isSuccessShop ? 'bg-green-200' : 'bg-red-200'} w-11/12 md:w-3/5 lg:w-1/2 xl:w-1/3 h-2/3 md:h-2/3  absolute top-1/2 left-1/2 bg-gray-300 -translate-y-1/2 -translate-x-1/2 px-14 py-6 `} >
                        {
                            isWaitRegister ?
                                <Box className="flex justify-center items-center w-full h-full">
                                    <CircularProgress className='text-red-500'></CircularProgress>
                                </Box>
                                :
                                <>
                                    <Box className=" flex justify-center">
                                        <img src={isOpenResult ? (isSuccessShop ? images[Math.floor(Math.random() * 4)] : images[Math.floor(Math.random() * 2) + 4]) : ""} alt="" />
                                    </Box>
                                    <Alert className="my-2" color={isSuccessShop ? 'success' : 'error'} >
                                        {isSuccessShop ? "Your ticket purchase was successful!" : "Your purchase failed! "}
                                    </Alert>
                                    <Alert className="my-1" color={isSuccessShop ? 'success' : 'error'}>
                                        {isSuccessShop ? "Enjoy your movie!" : "Please select at least a seat or register !"}
                                    </Alert>
                                    <TextField label="Username" variant="outlined" value={userName} onChange={(e) => setUserName(e.target.value)} className={`w-full my-1 ${userID >= 0 ? "hidden" : ""}`} />
                                    <TextField label="Password" variant="outlined" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} className={`w-full my-1 ${userID >= 0 ? "hidden" : ""}`} />
                                    <Box className={`flex justify-center my-1 ${userID >= 0 ? "hidden" : ""}`}>
                                        <Button variant="contained" className='bg-red-500 hover:bg-red-600' onClick={RegisterHandler} >register</Button>
                                    </Box>
                                </>
                        }
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}