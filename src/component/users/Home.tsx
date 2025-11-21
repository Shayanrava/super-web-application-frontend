import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography'
import List from "./List";
import { useEffect, useState } from "react";
import Add from "./Add";
import axios, { AxiosResponse } from "axios";
import Box from "@mui/material/Box";

export interface People {
    name: string,
    password: string,
    nationality: string,
    age: string,
    url?: string,
    id: number
};


export default function Home() {

    useEffect(() => {
        getUsers()
    }, [])
    const [people, setPeople] = useState<People[]>([])
    const getUsers = async (): Promise<void> => {
        const res: AxiosResponse<any, any, {}> = await axios.get("https://super-web-application-backend-production.up.railway.app/users")
        setPeople(res.data)
    }
    return (
        people.length > 0 ?
            (
                <div className='bg-gray-400  h-full'>
                    <div className='w-full flex flex-col items-center '>
                        <Alert icon={false} className='w-5/6  flex flex-row justify-center my-20 bg-[rgb(237, 247, 237)] md:w-3/4 lg:w-2/3' >
                            <Typography variant="h4" color="info" >
                                manage People
                            </Typography>
                        </Alert>
                        <List people={people}></List>
                        <Add></Add>
                    </div>
                </div>
            )
            :
            (
                <Box className="flex  flex-col justify-center items-center mt-36 w-full">
                    <CircularProgress className="" />
                    <Typography className="text-center text-sky-600 my-2">Please wait… the Railway server might be sleeping or you may need to VPN</Typography>
                </Box>
            )
    )
}



