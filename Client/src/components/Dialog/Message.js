import { useEffect } from "react"
import { BsCheck2Circle } from 'react-icons/bs'

const Message = ({ status, text, setShowMessage }) => {
    useEffect(() => {
        setTimeout(() => {
            setShowMessage(false)
        }, 4000)
    })
    return (
        status === "ok" ?
            (
                <div className="p-[0.5rem] fw-bold flex justify-center items-center bg-[green] rounded-[2px] fixed right-[10px] top-[10px]">
                    <h1 className="text-white text-[0.8rem] flex gap-[0.2rem] items-center">{text} <BsCheck2Circle /></h1>
                </div>
            ) :
            (
                <div className="p-[0.5rem] fw-bold flex justify-center items-center bg-[red] rounded-[2px] fixed right-[10px] top-[10px]">
                    <h1 className="text-white text-[0.8rem] flex gap-[0.2rem] items-center">{text} <BsCheck2Circle /></h1>
                </div>
            )
    )
}

export default Message