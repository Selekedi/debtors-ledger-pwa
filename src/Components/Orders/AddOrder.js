import React,{ useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Modal from "../Modal/Modal";
import AddOrderItem from "./AddOrderItem";
import CustomerFusySearchBar from "../Customers/CustomerFusySeachBar";
import { getCustomerById } from "../Customers/CustomerService";
import { addOrder } from "./OrderService";
import FullScreenLoader from "../Loaders/FullScreenLoader";
import "./AddOrder.css"


export default function AddOrder(){
    const {id} = useParams()
    const [customer,setCustomer] = useState(null)
    const [orderItems,setOrderItems] = useState([])
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [isProductSetModalOpen, setIsProductModalOpen] = useState(false)
    const [error,setError] = useState("")
    const [success,setSuccess] = useState("")
    const [loading,setLoading] = useState(false)

    const orderTotal = orderItems.length > 0 ? orderItems.reduce((val,cur) => val + cur.totalPrice,0) : 0

    const navigate = useNavigate()

    

    useEffect(() => {
  
        (async () => {
            if(id){
                const customerFromDb = await getCustomerById(id)
                setCustomer(customerFromDb)
            }else{

            }

            
        })()
    },[id])


    const openAddItemModal = () => setIsProductModalOpen(true)
    const closeAddItemModal = () => {
        setIsProductModalOpen(false)
    }

    const handleOrderItemSubmit = (item) => {
        setOrderItems(prevItems => {
            const existingIndex = prevItems.findIndex(i => i.id === item.id);

            if (existingIndex !== -1) {
            // Update the existing item
            const updatedItems = [...prevItems];
            const existingItem = updatedItems[existingIndex];

            const newQuantity = existingItem.quantity + item.quantity;
            const newTotalPrice = item.unitPrice * newQuantity;

            updatedItems[existingIndex] = {
                ...existingItem,
                quantity: newQuantity,
                totalPrice: newTotalPrice,
            };

            return updatedItems;
            }

            // Otherwise, add it as a new item
            return [...prevItems, item];
        });
    }

    const handleOrderItemDelete = (index) => {
        setOrderItems((previous) => previous.filter((_, i) => i !== index));
    }

    const handleOrderSubmit = async (e) => {
        e.preventDefault()
        setSubmitButtonDisabled(true)
        setError("")
        setSuccess("")
		
		setLoading(true)
        try {
            await addOrder(
                customer.id,
                orderItems,
                orderTotal
            )
            if(!id){
                setCustomer(null)
                setSuccess("Order Successfully created")
                setError("")
                setOrderItems([])
                setSubmitButtonDisabled(false)
                setLoading(false)
                setTimeout(() => setSuccess(""),4000)
            }else {
            	setLoading(false)
                navigate("/view-customer/" + id)
            }
            
        } catch (error) {
            setError("something went wrong, try again or check your network settings")
            setSubmitButtonDisabled(false)
            setLoading(false)
        }
    }

    return (
        <div>
        	{ loading && <FullScreenLoader/>}
            <h1>Add Order</h1>
            <div>
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
            { customer &&
            <div>
                <h3>OrderItems</h3>
                <div className="order-buttons">
				  <button onClick={openAddItemModal} className="add-item-button">
					Add Item
				  </button>

				  <Link to="/add-product" className="add-product-link">
					Add New Product
				  </Link>
				</div>
                {isProductSetModalOpen && <Modal onClose={closeAddItemModal}>
                    <AddOrderItem
                        onSubmit={handleOrderItemSubmit}
                        onSuccess={closeAddItemModal}
                    />
                </Modal>}
                <div className="order-items-list">
		  {orderItems.length === 0 ? (
		    <p>No items added yet.</p>
		  ) : (
		    <ul>
		      {orderItems.map((item, index) => (
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
			  <button className="remove-btn" onClick={() => handleOrderItemDelete(index)}>🗑️</button>
			</li>
		      ))}
		    </ul>
		  )}
		</div>
		
		<div className="order-total">
			<strong>Total:</strong> R{orderTotal.toFixed(2)}
        </div>

            </div>
            }
            { orderItems.length > 0 &&
            <button disabled={submitButtonDisabled} onClick={handleOrderSubmit}>Submit</button>
            }
            {error && <div> {error} </div>}
            {success && <div> {success} </div>}
        </div>
    )
}
