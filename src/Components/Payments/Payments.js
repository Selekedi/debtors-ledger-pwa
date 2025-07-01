import React, { useEffect, useState } from "react";
import RenderPayment from "./renderPayment";
import { getPayments } from "./PaymentService";
import FabLink from "../FAB/FabLink";
import { useAudit } from "../../contexts/AuditContext";

export default function Payments(){
    const [payments,setPayments] = useState([])
    const { isAuditMode } = useAudit()
    useEffect(() => {
        (async () => {
            const dbPayments = await getPayments(isAuditMode)
            const orderedPayments = dbPayments.sort((a,b) => b.createdAt - a.createdAt)
            setPayments(orderedPayments)
        })()
    },[isAuditMode])
    return (
        <section>
            <h1>
                payments
            </h1>
            <div>
                {payments.length > 0 && payments.map(payment => <RenderPayment key={payment.id} payment={payment}/>)
                }
            </div>
            <FabLink
                to={"/add-payment"}
                label="add payment"
            />
        </section>
    )
}