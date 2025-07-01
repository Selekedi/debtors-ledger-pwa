import React, { useEffect, useState } from "react";
import FabMenu from "../FAB/FabMenu";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";
import { recalculateTotalOwed } from "../Customers/CustomerService";

export default function Home(){
    const [totalOwed,setTotalOwed] = useState(0)
    const navigate = useNavigate();
    const [reCalculateError, setRecalculateError] = useState("")

    useEffect(() => {
        const unsub = onSnapshot(doc(db,"meta","balances"), (doc) => {
            if(doc.exists()){
                setTotalOwed(doc.data().totalOwed)
            }
        })

        return () => {
            unsub()
        }
    },[])

    const handleRecalculateTotalOwed = async (e) => {
        setRecalculateError("")
        e.preventDefault()
        try {
            await recalculateTotalOwed()
        } catch (error) {
            setRecalculateError(error.message)
        }
    }

    const fabItems = [
        {
        label: "Add Customer",
        icon: "👤",
        onClick: () => navigate("/add-customer")
        },
        {
        label: "Add Product",
        icon: "📦",
        onClick: () => navigate("/add-product")
        },
        {
        label: "Add Order",
        icon: "🛒",
        onClick: () => navigate("/add-order")
        },
        {
        label: "Add Payment",
        icon: "💵",
        onClick: () => navigate("/add-payment")
        }
    ];
    return (
        <div>
            <div>
                <h3>Total Owed: {totalOwed}</h3>
                <button
                    onClick={handleRecalculateTotalOwed}
                >recalculate total owed</button>
                {reCalculateError && <div>{reCalculateError}</div>}
            </div>
            <FabMenu
                items={fabItems}
            />
        </div>
    )
}