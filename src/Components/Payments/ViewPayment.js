import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getPaymentById, reversePayment } from "./PaymentService";
import formateDate from "../../utils/formateDate";
import { useAudit } from "../../contexts/AuditContext";
import FullScreenLoader from "../Loaders/FullScreenLoader";

export default function ViewPayment(){
    const {id} = useParams()
    const [payment, setPayment] = useState({})
    const navigate = useNavigate()
    const location = useLocation()
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const { isAuditMode } = useAudit()
    const fromTimeLine = location.state?.fromTimeLine || false
    const [loading,setLoading] = useState(false)

    useEffect(() => {
            (async () => {
                const paymentDB = await getPaymentById(id)
                console.log(paymentDB)


                setPayment(paymentDB)
            })()
        },[id])
    
        const handleReverse = async (e) => {
            setSubmitButtonDisabled(true)
            e.preventDefault()
            setLoading(true)
            try {
                await reversePayment(id)
                setLoading(false)
                navigate("/view-customer/" + payment.customerId)
                setSubmitButtonDisabled(false)
            } catch (error) {
                console.error(error)
                setSubmitButtonDisabled(false)
                setLoading(false)
            }
        }
    
    return (
        <div>
        	{ loading && <FullScreenLoader/>}
            <div className="customer-details">
                <p>Customer : <Link className="customer-link" to={"/view-customer/" + payment.customerId}>{payment.customerName}</Link></p>
            </div>
            <div>
                <p>
                    Date: {formateDate(payment.createdAt?.toMillis())}
                </p>
                <p>
                    Amount : {payment.amount}
                </p>
            </div>
            {isAuditMode && <>
                <p>Status : <span>{payment.voided? payment.voidedReason:"active"}</span></p>
            </>}
            <div className="actions">
                {isAuditMode && <>
                    {payment.replaces && <button onClick={(e) => {
                        navigate(`/view-payment/${payment.replaces}`, {
                            state:fromTimeLine
                        })
                    }}>
                        Replaces payment {payment.replaces.split("-")[0]}    
                    </button>}
                    {payment.replacedBy && <button onClick={(e) => {
                        navigate(`/view-payment/${payment.replacedBy}`, {
                            state:fromTimeLine
                        })
                    }}>
                        Replaced by payment {payment.replacedBy.split("-")[0]}    
                    </button>}
                </>}
                
                {payment.voided === false && <>
                    <button onClick={(e) => {
                        navigate(`/edit-payment/${payment.id}`)
                    }}>
                        Edit payment
                    </button>
                    <button disabled={submitButtonDisabled} onClick={handleReverse}>
                        Reverse payment
                    </button>
                </>}
                {fromTimeLine && <button onClick={(e) => navigate(`/view-customer/${payment.customerId}`)}>
                    Bact to Timeline
                </button>}
            </div>
        </div>
    )
}
