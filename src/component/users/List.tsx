import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal';
import CardHeader from '@mui/material/CardHeader'
import Avatar from '@mui/material/Avatar'
import  CircularProgress  from '@mui/material/CircularProgress';
import { People } from "./Home";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Edit from "./Edit";
import axios from "axios";
import { useState } from 'react';

interface Props {
  people: People[],
}


export default function List({ people }: Props) {

  const [openWait , setOpenWait] = useState<boolean>(false)

  const DeleteUser = async (ID: number): Promise<void> => {
    setOpenWait(!openWait)
    try {
      await axios.delete(`https://super-web-application-backend-production.up.railway.app/users/${ID}`)
    } catch (error) {
      console.log(error);
    }
    window.location.reload()
  }

  return (
    <div className="w-full flex">
      <Box className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 px-5">
        {people.map((person) => {
          return (
            <Card key={person.id} className="bg-blue-200 hover:shadow-[0px_0px_50px_20px_rgba(255,255,255,1)] rounded-lg hover:bg-blue-400 overflow-visible relative ">
              <CardHeader
                avatar={
                  <Avatar aria-label="" >
                    {
                      person.url ?
                        <img src={person.url} className=" object-cover w-full h-full" alt="" />
                        :
                        <Typography className="bg-black text-white w-full h-full flex items-center justify-center">{person.name[0].toUpperCase()}</Typography>
                    }
                  </Avatar>
                }
                title={
                  <Typography variant="h5" component="div">
                    {person.name}
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    {person.nationality}
                  </Typography>
                }

              />
              <CardContent sx={{ height: '100%' }} >
                <Typography variant="body2" className="bg-cyan-300 rounded-2xl inline-block px-3 py-1 absolute -top-3 -left-3 ">
                  {person.age} years
                </Typography>
                <Typography variant="h5" color="initial" className="text-center">
                  {person.id}
                </Typography>

                <Box className="flex flex-col md:flex-row my-3">
                  <Edit people={people} ID={person.id}></Edit>
                  <Button variant="contained" color="error" className="" onClick={() => DeleteUser(person.id)}>delete <DeleteForeverIcon className="mx-1"></DeleteForeverIcon> </Button>
                </Box>
              </CardContent>
            </Card>

          )
        })}

      </Box>
      <Modal
        open={openWait}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='w-11/12 md:w-1/2  xl:w-1/3 h-2/5 bg-red-400 px-5 flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border'>
          <Typography variant="body1" className="text-center text-white">Please wait… the Railway server might be sleeping.</Typography>
          <CircularProgress className="text-red-700 my-6" />
        </Box>
      </Modal>
    </div>
  );
}
