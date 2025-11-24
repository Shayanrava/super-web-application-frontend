import React, { JSX, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import axios, { AxiosResponse } from 'axios';
import CinemaHeader from './CinemaHeader';
import { CinemaSeats } from './CinemaSeats';
import { BuyButton } from './BuyButton';
import { ShowtimeList } from './ShowtimeList';
import { ShowtimeConfig } from './ShowtimeConfig';
import { MovieConfig } from './MovieConfig';

export class reserve {
  row: number;
  number: number;
  isReserve: boolean;
  isSelected: boolean

  constructor() {
    this.row = -1;
    this.number = -1;
    this.isReserve = false;
    this.isSelected = false;
  }
}

export interface showtime {
  id: number,
  movie_id: number,
  date: string,
  start_time: string,
  end_time: string,
  available_seats: number,
  price: number
}

export interface movie {
  id: number,
  title: string,
  description: string,
  genre: string,
  releaseYear: number,
  rating: number
  ratingCount: number,
  imageUrl: string
}
export interface reservation {
  id: number
  user_id: number
  showtime_id: number
  seat_number: number
  booking_time: string
}

export default function CinemaHome(): JSX.Element {

  // All the seat buttons are in this array
  const [btnArr, setBtnArr] = useState<reserve[]>([])

  // Number of seats selected by the user
  const [numberSelectedSeat, setNumberSelectedSeat] = useState<number>(0)

  // array of buttons selected by the user
  const [seatSelectArr, setSeatSelectArr] = useState<number[]>([])

  //User selected showtime ID
  const [selectedShowtimeID, setSelectedShowtimeID] = useState<number>(-1)

  // total showtimes in DataBase
  const [showtimes, setShowtimes] = useState<showtime[]>([])

  // total movie in DB
  const [movieInfo, setMovieInfo] = useState<movie[]>([])

  // i & j for seats
  const rows: number = 5;
  const col: number = 8;

  // initial btnArr
  useEffect(() => {
    // initial btnArr
    const tempArr: reserve[] = [];
    for (let i: number = 0; i < rows; i++) {
      for (let j: number = 0; j < col; j++) {
        const temp: reserve = new reserve();
        temp.number = j;
        temp.row = i;
        tempArr.push(temp);
      }
    }
    setBtnArr(tempArr);
    GetShowtimes()
    GetMovies()
  }, [])
  const GetShowtimes = async () => {
    const res: AxiosResponse<any, any, {}> = await axios.get("https://super-web-application-backend-production.up.railway.app/showtimes")
    setShowtimes(res.data)
  }
  const GetMovies = async (): Promise<void> => {
    const res: AxiosResponse<any, any, {}> = await axios.get(`https://super-web-application-backend-production.up.railway.app/movies`)
    setMovieInfo(res.data)
  }
  return (
    <div className='bg-[#1c1c1c] w-full min-h-screen max-h-full flex flex-col items-center '>
      <CinemaHeader></CinemaHeader>

      <CinemaSeats
        btnArr={btnArr}
        setBtnArr={setBtnArr}
        col={col}
        selectedShowtimeID={selectedShowtimeID}
        seatSelectArr={seatSelectArr}
        setSeatSelectArr={setSeatSelectArr}
        numberSeat={numberSelectedSeat}
        setNumberSeat={setNumberSelectedSeat}
      ></CinemaSeats>

      <Box className='flex flex-col items-center w-full my-8 '>
        <BuyButton
          seatSelectArr={seatSelectArr}
          btnArr={btnArr}
          setBtnArr={setBtnArr}
          selectedShowtimeID={selectedShowtimeID}
          setSeatSelectArr={setSeatSelectArr}
          setNumberSelectedSeat={setNumberSelectedSeat}
        ></BuyButton>

        <ShowtimeList
          setSelectedShowtimeID={setSelectedShowtimeID}
          btnArr={btnArr}
          setBtnArr={setBtnArr}
          movieInfo={movieInfo}
          showtimes={showtimes}
        ></ShowtimeList>

        <ShowtimeConfig movieInfo={movieInfo} showtimes={showtimes}></ShowtimeConfig>

        <MovieConfig movieInfo={movieInfo}></MovieConfig>
      </Box>
    </div >
  )
}
