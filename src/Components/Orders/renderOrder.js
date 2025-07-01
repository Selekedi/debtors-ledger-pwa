import React from "react";
import { useNavigate } from "react-router-dom";
import formateDate from "../../utils/formateDate";
import { useAudit } from "../../contexts/AuditContext";
import "./RenderOrder.css"

export default function RenderOrder({order}){
    const { isAuditMode } = useAudit()
    const navigate = useNavigate()
    
    return (
        <div id={`order-${order.id}`} onClick={(e) => {e.stopPropagation();
            sessionStorage.setItem("timelineScrollY",window.scrollY);
            navigate("/view-order/" + order.id,{
            state:{fromTimeLine:true}
        })}}
            className={isAuditMode? `order-card ${order.voided && 'voided'} ${order.replaces && 'replaces'}`:"order-card"}>

                {isAuditMode && 
                    <>
                        {(order.replaces || order.voided) && <div>
                            {order.replaces && <button onClick={(e) => {
                                e.stopPropagation();
                                sessionStorage.setItem("timelineScrollY",window.scrollY);
                                navigate(`/view-order/${order.replaces}`,{
                                    state:{fromTimeLine:true}
                                })
                            }}>Replaces {order.replaces.split("-")[0]}</button>}

                            {(order.voided && order.replacedBy) && <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        sessionStorage.setItem("timelineScrollY",window.scrollY);
                                        navigate(`/view-order/${order.replacedBy}`, {
                                            state:{fromTimeLine:true}
                                        })
                                    }}
                                >
                                    Replaced by {order.replacedBy.split("-")[0]}
                                </button>}
                        </div>}
                    </>
                }
        
            <p className="order-tag">Order</p>
            <p className="order-id">#{order.id}</p>
            
            <div className="order-info">
                <p className="order-info-group"><span>Name</span><span>{order.customerName}</span></p>
                <p className="order-info-group"><span>Date</span><span>{formateDate(order.createdAt.toMillis())}</span></p>
                <p className="order-info-group"><span>Total</span><span>R{order.total}</span></p>
            </div>

            
            {isAuditMode && 
                <p>Status : <span>{!order.voided? "active": order.voidedReason}</span></p>
            }
        </div>
    )
}