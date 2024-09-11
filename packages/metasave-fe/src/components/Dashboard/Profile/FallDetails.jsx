import React from 'react'
import { useMainContext } from '../../../context/MainContext'
import DataPopup from '../DataPopup'

const Detail = ({detail}) => {
    const [close, setClose] = React.useState(true)
    return (
        <div className='my-10'>
            <div className='flex justify-between'>
                <h3 className='text-xl'>Severe</h3>
                <button onClick={() => setClose(false)} className='text-blue-500 ext-xl'><u>View Image</u></button>
                <div>
                    <h3 className='text-xl'>{detail.date}</h3>
                    <p className='text-gray-600 font-bold'>{detail.timestamp}</p>
                </div>
            </div>
            <hr className='border-[1.5px]' />
            {!close && <DataPopup data={detail} setClose={setClose} />}
        </div>
    )
}

const FllDetails = () => {
    const {fallDetails} = useMainContext()
    return (
        <div className='grid grid-cols-1 justify-center my-10'>
            <div className='flex justify-between'>
                <h3 className='font-bold text-xl'>Severity</h3>
                <h3 className='font-bold text-xl'>Image</h3>
                <h3 className='font-bold text-xl'>Time</h3>
            </div>
            <div className='my-10'>
                {fallDetails.length > 0 && fallDetails.map((detail, i) => (
                    <Detail key={i} detail={detail} />
                ))}
                
            </div>
        </div>
    )
}

export default FllDetails