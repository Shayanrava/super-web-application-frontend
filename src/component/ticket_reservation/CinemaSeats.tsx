import Button from '@mui/material/Button'
import React from 'react'
import { reserve } from './CinemaHome'

interface cinemaSeatProp {
    btnArr: reserve[],
    setBtnArr: React.Dispatch<React.SetStateAction<reserve[]>>
    col: number,
    selectedShowtimeID: number,
    seatSelectArr: number[],
    setSeatSelectArr: React.Dispatch<React.SetStateAction<number[]>>
    numberSeat: number,
    setNumberSeat: React.Dispatch<React.SetStateAction<number>>,

}

export const CinemaSeats = ({
    btnArr,
    setBtnArr,
    col,
    selectedShowtimeID,
    seatSelectArr,
    setSeatSelectArr,
    numberSeat,
    setNumberSeat
}: cinemaSeatProp) => {

    const ClickHandler = (row: number, number: number): void => {
        if (selectedShowtimeID < 0) {
            return alert("please select a showtime")
        }
        const tempArr: reserve[] = [...btnArr];
        var tempSeatArr: number[] = [...seatSelectArr]
        const index: number = (row * col) + number;
        if (!tempArr[index].isSelected) {
            setNumberSeat(numberSeat + 1);
            tempSeatArr.push(index + 1);
        } else {
            setNumberSeat(numberSeat - 1);
            tempSeatArr = tempSeatArr.filter((value: number) => value !== index + 1);
        }
        tempArr[index].isSelected = !tempArr[index].isSelected;
        setBtnArr(tempArr);
        setSeatSelectArr(tempSeatArr);
    }
    return (
        <>
            <div className='w-full grid grid-cols-8 gap-x-1 gap-y-4 my-10 px-2 md:w-3/4 lg:w-3/5 xl:w-1/2  sm:gap-x-4 sm:gap-y-4'>
                {
                    btnArr.map((btn) => {
                        return (
                            <>
                                <Button variant="contained" key={(btn.row * col) + btn.number}
                                    className={` ${btn.isSelected ? "bg-red-400" : btn.isReserve ? "bg-gray-500" : "bg-fuchsia-700"} ${btn.isSelected ? "hover:bg-red-500" : btn.isReserve ? "" : "hover:bg-fuchsia-800"} transition duration-500 hidden sm:flex`}
                                    disabled={btn.isReserve}
                                    onClick={() => ClickHandler(btn.row, btn.number)}>

                                    {(btn.row * col) + btn.number + 1}
                                </Button>

                                <button key={(btn.row * col) + btn.number}
                                    className={` ${btn.isSelected ? "bg-red-400" : btn.isReserve ? "bg-gray-500" : "bg-fuchsia-700"} ${btn.isSelected ? "hover:bg-red-500" : btn.isReserve ? "" : "hover:bg-fuchsia-800"} transition duration-500 flex justify-center size-11 text-white rounded-lg items-center sm:hidden `}
                                    disabled={btn.isReserve}

                                    onClick={() => ClickHandler(btn.row, btn.number)}>{(btn.row * col) + btn.number + 1}
                                </button>

                            </>
                        )
                    })
                }
            </div>
        </>
    )
}
