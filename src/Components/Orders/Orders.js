import React, { useEffect, useState } from "react";
import RenderOrder from "./renderOrder";
import { getOrders } from "./OrderService";
import FabLink from "../FAB/FabLink";
import { useAudit } from "../../contexts/AuditContext";
import "./Orders.css"

export default function Orders(){
    const [orders,setOrders] = useState([])
    const {isAuditMode} = useAudit()
    useEffect(() => {
        (async () => {
            const dbOrders = await getOrders(isAuditMode)
            const sortedOrders = dbOrders.sort((a,b) => b.createdAt - a.createdAt)
            setOrders(sortedOrders)
        })()
    },[isAuditMode])
    return (
        <section>
            <h1>
                Orders
            </h1>
            <div className="orders">
                {orders.length > 0 && orders.map(order => <RenderOrder key={order.id} order={order} />)

                }
            </div>
            <FabLink
                to={"/add-order"}
                label="add order"
            />
        </section>
    )
}