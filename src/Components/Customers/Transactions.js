import React from "react";
import Renderpayment from "../Payments/renderPayment";
import RenderOrder from "../Orders/renderOrder";


export default function Transactions({transactions}){
    if(!transactions) return <div>loading ...</div>
    if(!transactions.length) return <div>customer has no transactions</div>
    return (
        <div className="transaction">
            {transactions.map(trans => {
                if(trans.type === "order"){
                    return <RenderOrder
                    key={trans.id.split("-")[0]}
                    order={trans}
                    />
                }else if(trans.type === "payment"){
                    return <Renderpayment
                    key={trans.id.split("-")[0]}
                    payment={trans}
                    />
                }else return null
            })}
        </div>
    )
}