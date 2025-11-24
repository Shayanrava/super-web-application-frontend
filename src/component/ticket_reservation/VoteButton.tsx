import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React from 'react'

export const VoteButton = () => {
    return (
        <Box className='flex w-full justify-center my-5'>
            <Button variant="text" /*onClick={() => setIsOpenMovie(!isOpenMovie)}*/ className='flex justify-center gap-2 bg-[#607d8b] text-white hover:bg-[#455a64]' >
                <Typography variant="body1" > Movie Config </Typography>
            </Button>
        </Box>
    )
}
