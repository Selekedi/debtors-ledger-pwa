import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { editCustomer, getCustomerById } from "./CustomerService";
import FloatingLabelInput from "../FloatingInput/FloatingLabelInput";
import FullScreenLoader from "../Loaders/FullScreenLoader";


export default function UpdateCustomer(){
    const { id } = useParams()
    const [customer, setCustomer] = useState({})
    const [newSurname,setNewSurname] = useState("")
    const [newName,setNewName] = useState("")
    const [newCell,setNewCell] = useState("")
    const [newIdNo,setNewIdNo] = useState("")
    const [error,setError] = useState("")
    const [success,setSuccess] = useState("")
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
            (async () => {
                try {
                    const dbCustomer =  await getCustomerById(id)
                    setCustomer(dbCustomer)
                    setNewSurname(dbCustomer.surname)
                    setNewName(dbCustomer.name)
                    setNewIdNo(dbCustomer.idNo)
                    setNewCell(dbCustomer.cell)
                } catch (error) {
                    setError(error.message)
                }
            })()
        },[id])

    const handleFormSubmit = async (e) => {
        setSubmitButtonDisabled(true)
        e.preventDefault()
        const updatedCustomer = {}
        if(newName && newName !== customer.name) updatedCustomer.name = newName
        if(newSurname && newSurname !== customer.surname) updatedCustomer.surname = newSurname
        if(newIdNo && newIdNo !== customer.idNo) updatedCustomer.idNo = newIdNo
        if(newCell && newCell !== customer.cell) updatedCustomer.cell = newCell
        console.log(updatedCustomer)

        if(Object.keys(updatedCustomer).length > 0){
        	setLoading(true)
            try {
                await editCustomer(id,updatedCustomer)
                setSuccess("Customer updated successfully")
                setSubmitButtonDisabled(false)
            } catch (error) {
                setError(error.message)
                setSubmitButtonDisabled(false)
            }
            finally {
            	setLoading(false)
            }
        }else {
            setSuccess("Customer updated successfully")
            setSubmitButtonDisabled(false)
        }
    }

    return (
        <div>
        {loading && <FullScreenLoader/>}
            <h1>
                Edit Customer
                {error && <div>{error}</div>}
                <form onSubmit={handleFormSubmit}>
                    <FloatingLabelInput
                        id={"customer-new-name"}
                        label={"New name"}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <FloatingLabelInput
                        id={"customer-new-surname"}
                        label={"New surname"}
                        value={newSurname}
                        onChange={(e) => setNewSurname(e.target.value)}
                    />
                    <FloatingLabelInput
                        id={"customer-new-cell"}
                        label={"New cell No"}
                        value={newCell}
                        onChange={(e) => setNewCell(e.target.value)}
                    />
                    <FloatingLabelInput
                        id={"customer-new-idNo"}
                        label={"New ID Number"}
                        value={newIdNo}
                        onChange={(e) => setNewIdNo(e.target.value)}
                    />
                    <button disabled={submitButtonDisabled} type="submit">Update</button>

                    {success && <div> {success} </div>}
                </form>
            </h1>
        </div>
    )
}
