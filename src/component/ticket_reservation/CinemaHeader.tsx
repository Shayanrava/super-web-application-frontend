import Typography from '@mui/material/Typography'
import { JSX } from 'react'

export default function CinemaHeader(): JSX.Element {
    return (
        <>
            <Typography variant='h3' className='mt-28 mb-5 text-yellow-300'> Book Ticket </Typography>
            <div className='w-full md:w-3/4 lg:w-3/5 xl:w-1/2 flex flex-col items-center px-2'>
                <Typography className='bg-[#444] w-full text-center text-white rounded-md py-3'>Screen</Typography>
                <div className="relative w-full h-[50px] bg-black">
                    <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,.6),_transparent_80%)] animate-glow z-[1]"></div>
                </div>
            </div>
        </>
    )
}
