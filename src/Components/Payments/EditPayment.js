import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editPayment, getPaymentById } from "./PaymentService";
import { getCustomerById } from "../Customers/CustomerService";
import FloatingLabelInput from "../FloatingInput/FloatingLabelInput";
import validateAmount from "../../utils/validateAmount";
import FullScreenLoader from "../Loaders/FullScreenLoader";

export default function EditPayment(){
    const { id } = useParams()
    const [customer, setCustomer] = useState({})
    const [oldPayment, setOldPayment] = useState({})
    const [newAmount,setNewAmount] = useState(0)
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    
    useEffect(() => {
        (async () => {
            try {
                const dbPayment = await getPaymentById(id)
                const dbCustomer = await getCustomerById(dbPayment.customerId)
                setCustomer(dbCustomer)
                setOldPayment(dbPayment)
                setNewAmount(dbPayment.amount)
            } catch (error) {
                setError(error.message)
            }
        })()
    },[id])

    const handleSubmit = async (e) => {
        setSubmitButtonDisabled(true)
        e.preventDefault()
        if(!Object.keys(oldPayment).length){
            setError("No customer")
            setSubmitButtonDisabled(false)
            return
        }
        if(!Object.keys(customer).length){
            setError("No payment")
            setSubmitButtonDisabled(false)
            return
        }

        const validAmount = validateAmount(newAmount)

        if(!validAmount.valid){
            setError(validAmount.reason)
            setSubmitButtonDisabled(false)
            return
        }
        console.log(oldPayment.amount === newAmount)

        if(oldPayment.amount === validAmount.value){
            setError("The amounts are similar")
            setSubmitButtonDisabled(false)
            return
        }
        setLoading(true)

        try {
            const newPaymentid =  await editPayment({oldId:id,customerId:customer.id,newAmount: validAmount.value})
            setSubmitButtonDisabled(false)
            setLoading(false)
            navigate("/view-payment/" + newPaymentid)
    
        } catch (error) {
            setError(error.message)
            setSubmitButtonDisabled(false)
            setLoading(false)
        }
    }

    return (
        <div>
            { loading && <FullScreenLoader/>}
            <div>
                <h3>
                    Customer
                </h3>
                {Object.keys(customer).length && <>
                    <p>Name : {customer?.surname} {customer?.name}</p>
                    <p>Id No: {customer?.idNo}</p>
                    <p>cell no : {customer?.cell}</p>
                </>}
            </div>

            <form onSubmit={handleSubmit}>
                <FloatingLabelInput
                    id={"edit-payment-amount"}
                    value={newAmount}
                    label={"New amount"}
                    type="number"
                    onChange={(e) => setNewAmount(e.target.value)}
                />
                <button 
                    type="submit"
                    disabled={submitButtonDisabled}
                > edit payment</button>
                {error && <div>{error}</div>}
            </form>
        </div>
    )
}
