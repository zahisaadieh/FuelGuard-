const Confirm = ({ text, setShowDialog, callbackFunction }) => {
    const handleConfrim = () => {
        callbackFunction()
        setShowDialog(false)
    }

    const handleCancel = () => {
        setShowDialog(false)
    }
    return (
        <div className="w-[90%] sm:w-[500px] z-50 p-[0.5rem] py-[1rem] rounded-[5px] items-center fw-bold flex flex-column bg-white border-solid border-[0.5px] border-[#0000FF] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="flex items-center text-[1rem] w-[100%]">
                <h1>{text}</h1>
            </div>
            <div className="mt-3 flex w-[100%] justify-end gap-[0.5rem] ">
                <button onClick={handleCancel} className="text-[0.8rem] border shadow shadow-#0000FF-500 text-[#0000FF] bg-[white] py-[0.25rem] px-[0.5rem] rounded-[5px]">Cancel</button>
                <button onClick={handleConfrim} className="text-[0.8rem] border text-[white] bg-[#0000FF] border-[white] py-[0.25rem] px-[0.5rem] rounded-[5px]">Confirm</button>
            </div>
        </div>
    )
}

export default Confirm