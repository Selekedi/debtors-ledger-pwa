import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { addPayment } from "./PaymentService";
import { getCustomerById } from "../Customers/CustomerService";
import CustomerFusySearchBar from "../Customers/CustomerFusySeachBar";
import FloatingLabelInput from "../FloatingInput/FloatingLabelInput";
import validateAmount from "../../utils/validateAmount";
import FullScreenLoader from "../Loaders/FullScreenLoader";
import "./AddPayment.css"

export default function AddPayment(){
    const {id} = useParams()
    const [customer,setCustomer] = useState(null)
    const [error,setError] = useState("")
    const [success,setSuccess] = useState("")
    const [amount, setAmount] = useState(0)
    const navigate = useNavigate()
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
            (async () => {
                if(id){
                    try {
                        const customerFromDb = await getCustomerById(id)
                        setCustomer(customerFromDb)
                    }
                    catch (error) {
                        setError("Error getting the customer, reload the page or check your network settings")
                    }
                }else{
                    
                }
            })()
        },[id])

    const handleSubmit = async (e) => {
        setSubmitButtonDisabled(true)
        setError("")
        setSuccess("")
        e.preventDefault()
        if (!Object.keys(customer).length) {
            setError("Customer is required");
            setSubmitButtonDisabled(false);
            return;
        }

        const validAmount = validateAmount(amount)
        if(!validAmount.valid){
            setError(validAmount.reason)
            setSubmitButtonDisabled(false)
            return
        }
        setLoading(true)

        try {
            await addPayment(customer.id, validAmount.value)
            if(!id){
                setCustomer(null)
                setAmount(0)
                setSubmitButtonDisabled(false)
                setSuccess("payment added successfully")
                setLoading(false)
            }else {
            	setLoading(false)
                navigate("/view-customer/" + id)
            }
            
            
        } catch (error) {
            setError(error.message)
            setSubmitButtonDisabled(false)
            setLoading(false)
        }
    }

    return (<div>
    	{ loading && <FullScreenLoader/>}
        <div className="customer">
            {customer ? (
			  <div className="selected-customer">
				<div>
				  <strong>{customer.name} {customer.surname}</strong><br />
				  <span>{customer.idNo}</span>
				</div>
				{!id &&
					<button
					  onClick={() => setCustomer(null)}
					  className="change-btn"
					>
					  ✎ Change
					</button>
				}
			  </div>
			) : (
			  <div className="customer-section">
				<label>Search for a customer</label>
				<CustomerFusySearchBar onSelect = {(item) => setCustomer(item)}/>
				<div className="or-divider">or</div>
				<Link to="/add-customer" className="add-customer-link">
				  + Add New Customer
				</Link>
			  </div>
			)}                      
        </div>
		{customer &&
		    <form onSubmit={handleSubmit}>
		            <FloatingLabelInput
		                id={"payment-amount"}
		                value={amount}
		                label={"Amount"}
		                type="number"
		                onChange={(e) => setAmount(e.target.value)}
		            />
		            <button
		                disabled={submitButtonDisabled} 
		                type="submit">
		                add payment
		            </button>
		            {error && <div>{error}</div>}
		            {success && <div>{success}</div>}
		    </form>
		}
    </div>)
}
