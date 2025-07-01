import { useLocation, useNavigate, useParams } from "react-router-dom";
import React,{ useState , useEffect} from "react";
import Transactions from "./Transactions";
import FabMenu from "../FAB/FabMenu";
import { getCustomerById, restoreCustomer, softDeleteCustomer } from "./CustomerService";
import { getOrdersByCustomerId } from "../Orders/OrderService";
import { getPaymentByCustomerId } from "../Payments/PaymentService";
import { useAudit } from "../../contexts/AuditContext";
import InfoGrid from "../InfoGrid/InfoGrid"
import FullScreenLoader from "../Loaders/FullScreenLoader";

export default function ViewCustomer(){
    const { id } = useParams()
    const [customer,setCustomer] = useState({})
    const [error,setError] = useState("")
    const [transactions, setTransactions] = useState([])
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuditMode } = useAudit()
    const fromTimeLine = location.state?.fromTimeLine || false
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                const dbCustomer =  await getCustomerById(id)
                setCustomer(dbCustomer)
                const orders = await getOrdersByCustomerId(id,isAuditMode)
                const finalOrders = orders.map(order => {
                    return {
                        ...order,
                        type:"order"
                    }
                })
                const payments = await getPaymentByCustomerId(id,isAuditMode)
                const finalPayments = payments.map(payment => {
                    return {
                        ...payment,
                        type:"payment"
                    }
                })
                const intialTransactions = [...finalOrders,...finalPayments].sort((a,b) => b.createdAt - a.createdAt)
                setTransactions(intialTransactions)
                if(fromTimeLine){
                    const offsetY = sessionStorage.getItem("timelineScrollY")
                    if(offsetY){
                        window.scrollTo({
                            top:parseFloat(offsetY,10),
                            left:0,
                            behavior:"smooth"
                        })
                        sessionStorage.removeItem("timelineScrollY")
                    }
                }else {
                    sessionStorage.removeItem("timelineScrollY")
                }
            } catch (error) {
                setError(error.message)
            }
        })()

    },[id,fromTimeLine,isAuditMode])
    
    const handleSoftDelete = async (e) => {
        setSubmitButtonDisabled(true)
        e.preventDefault()
        setLoading(true)
        try {
            await softDeleteCustomer(id)
            setSubmitButtonDisabled(false)
        } catch (error) {
            setError("something went wrong")
            setSubmitButtonDisabled(false)
        }finally{
        	setLoading(false)
        }

    
        
    }

    const handleRestoreCustomer = async (e) => {
        e.preventDefault()
        if(!customer.deleted){
            setError("customer is not deleted")
            return
        }

        try {
            await restoreCustomer(id)
            window.location.reload()
        } catch (error) {
            setError(error.message)
        }
    }

    const fabItems = [
        {
        label: "Add Order",
        icon: "🛒",
        onClick: () => navigate("/add-order/" + id)
        },
        {
        label: "Add Payment",
        icon: "💵",
        onClick: () => navigate("/add-payment/" + id)
        }
    ];

    return (
        <div>
        	{ loading && <FullScreenLoader/>}
            <FabMenu
                items={fabItems}
            />
            { error && <div> {error} </div> }
            
            <InfoGrid
            	fields = {[
            		["Name", customer.name],
					["Surname", customer.surname],
					["Cell", customer.cell],
					["ID Number", customer.idNo],
					["Balance", `R${Number(customer.balance).toFixed(2)}`]
            	]}
            />
            {!customer.deleted ? 
                <div className="actions">
                    <button 
                        onClick={() => navigate(`/update-customer/${id}`)}
                    >
                        Edit
                    </button>
                    <button 
                        disabled={submitButtonDisabled}
                        onClick={handleSoftDelete}
                    >
                        Delete customer
                    </button>
                </div> :
                <div className="actions" onClick={handleRestoreCustomer}><button >Restore Customer</button></div>
            }
            
            {transactions.length > 0 && <Transactions
                transactions={transactions}
            />}

            
        </div>
    )
}
