import React from "react";
import { useNavigate } from "react-router-dom";
import formateDate from "../../utils/formateDate";
import { useAudit } from "../../contexts/AuditContext";
import "./RenderPayment.css"


export default function Renderpayment({payment}){
    const { isAuditMode } = useAudit()
    const navigate = useNavigate()
    
    return (
        <div id={`payment-${payment.shortCode}`} onClick={(e) => {e.stopPropagation();
            sessionStorage.setItem("timelineScrollY",window.scrollY);
            navigate("/view-payment/" + payment.id,{
            state:{fromTimeLine:true}
        })}}
            
            className={"payment-card"}>
        
            <p className="payment-tag">Payment</p>    
            <p className="payment-id"> #{payment.id}</p>
            <div className="payment-info">
                <p className="payment-info-group"><span>Name</span> <span>{payment.customerName}</span></p>
                <p className="payment-info-group"><span>Date</span> <span>{formateDate(payment.createdAt.toMillis())}</span></p>
                <p className="payment-info-group"><span>Total</span><span>R{payment.amount}</span></p>
            </div>
            
            {isAuditMode && <>
              <p className="status">Status : <span className={!payment.voided ? "active":"voided"}>{!payment.voided ? "active": "void"}</span></p>
            </>}
        </div>
    )
}