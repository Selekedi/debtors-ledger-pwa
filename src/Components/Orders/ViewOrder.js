import React, {useEffect, useState} from "react";
import { useLocation, useNavigate, useParams, Link} from "react-router-dom";
import { getOrderById, reverseOrder } from "./OrderService";
import { useAudit } from "../../contexts/AuditContext";
import FullScreenLoader from "../Loaders/FullScreenLoader";
import "./ViewOrder.css"


export default function ViewOrder(){
    const {id} = useParams()
    const [order, setOrder] = useState({})
    const navigate = useNavigate()
    const location = useLocation()
    const fromTimeLine = location.state?.fromTimeLine || false
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const { isAuditMode } = useAudit()
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            const orderDB = await getOrderById(id)
            setOrder(orderDB)
            console.log(orderDB)
        })()
    },[id])

    const handleReverse = async (e) => {
        setSubmitButtonDisabled(true)
        setLoading(true)
        try {
            await reverseOrder(id)
            setLoading(false)
            setSubmitButtonDisabled(false)
            navigate("/view-customer/" + order.customerId)
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
                <p>Customer :<Link className = "customer-link" to ={"/view-customer/" + order.customerId}> {order.customerName}</Link></p>
            </div>
            <div className="order-items-list">
		  {order.items?.length === 0 ? (
		    <p>No items added yet.</p>
		  ) : (
		    <ul>
		      {order.items?.map((item, index) => (
			<li key={index} className="order-item">
			  <div className="details">
			    <strong>{item.name}</strong>
			    <span className="meta">{item.brand} • {item.unit}</span>
			  </div>
			  <div className="qty-price">
			    <span>Qty: {item.quantity}</span>
			    <span>Unit: R{item.unitPrice.toFixed(2)}</span>
			    <span>Subtotal: R{(item.totalPrice).toFixed(2)}</span>
			  </div>
			</li>
		      ))}
		    </ul>
		  )}
		</div>
		
		<div className="order-total">
			<strong>Total:</strong> R{order.total?.toFixed(2)}
        </div>

            {isAuditMode && <>
                <p>Status : <span> {order.voided ? order.voidedReason : "active"} </span></p>
            </>}
            <div className="actions">
                {isAuditMode && <>
                    {order.replaces && <button onClick={(e) => {
                    navigate(`/view-order/${order.replaces}`, {
                        state:fromTimeLine
                    })
                }}>
                    Replaces order {order.replaces.split("-")[0]}    
                </button>}
                {order.replacedBy && <button onClick={(e) => {
                    navigate(`/view-order/${order.replacedBy}`, {
                        state:fromTimeLine
                    })
                }}>
                    Replaced by order {order.replacedBy.split("-")[0]}    
                </button>}
                </>}
                
                {!order.voided && <>
                    <button onClick={(e) => {
                        navigate(`/edit-order/${order.id}`)
                    }}>
                        Edit order
                    </button>
                    <button 
                        disabled={submitButtonDisabled}
                        onClick={handleReverse}>
                        Reverse order
                    </button>
                </>}
                {fromTimeLine && <button onClick={(e) => navigate(`/view-customer/${order.customerId}`)}>
                    Bact to Timeline
                </button>}
            </div>
        </div>
    )

}
