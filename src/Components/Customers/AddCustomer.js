import React,{ useState } from "react";
import { addCustomer } from "./CustomerService";
import FloatingLabelInput from "../FloatingInput/FloatingLabelInput";
import FullScreenLoader from "../Loaders/FullScreenLoader";

export default function AddCustomer(){
    const [surname,setSurname] = useState("")
    const [name,setName] = useState("")
    const [cell,setCell] = useState("")
    const [idNo,setIdNo] = useState("")
    const [error,setError] = useState("")
    const [success,setSuccess] = useState("")
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [loading,setLoading] = useState(false)
    

    const handleSubmit = async(e) => {
    	e.preventDefault()
        setSubmitButtonDisabled(true)
        setLoading(true)
        setError("")
        setSuccess("")

        if(cell && idNo && surname && name){
            try {
                 await addCustomer({
                    surname,
                    name,
                    cell,
                    idNo
                })
                setSurname("")
                setName("")
                setCell("")
                setIdNo("")
                setSuccess("Added New Customer")
                setSubmitButtonDisabled(false)
            } catch (error) {
                console.error("add customer error:",error)
                setError(error.message || "Something went wrong")
                setSubmitButtonDisabled(false
                )
            }finally {
            	setLoading(false)
            }
           
        }else {
            setError("Some of the values provided are invalid or missing")
            setSubmitButtonDisabled(false)
            setLoading(false)
        }
        
    }
    return (
        <div>
        	{ loading && <FullScreenLoader/>}
            <h1>Add Customer</h1>
            <form onSubmit={handleSubmit}>
                <FloatingLabelInput
                    id={"customer-name"}
                    label={"name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <FloatingLabelInput
                    id={"customer-surname"}
                    label={"surname"}
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
                <FloatingLabelInput
                    id={"customer-cell"}
                    label={"Cell No"}
                    value={cell}
                    onChange={(e) => setCell(e.target.value)}
                />
                <FloatingLabelInput
                    id={"customer-idNo"}
                    label={"ID Number"}
                    value={idNo}
                    onChange={(e) => setIdNo(e.target.value)}
                />
                <button disabled={submitButtonDisabled} type="submit">add customer</button>
                {success && <p>{success} <button onClick={(e) => setSuccess("")} >X</button></p> }
                {error && <p>{error} <button onClick={(e) => setError("")} >X</button></p> }
            </form>
        </div>
    )
}
