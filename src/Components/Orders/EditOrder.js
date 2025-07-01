import React,{ useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddOrderItem from "./AddOrderItem";
import Modal from "../Modal/Modal";
import { editOrder, getOrderById } from "./OrderService";
import { getCustomerById } from "../Customers/CustomerService";
import FullScreenLoader from "../Loaders/FullScreenLoader";

function areOrdersDifferent(oldTotal,newTotal,oldItems, newItems) {
  // Step 1: Compare total prices
  if (oldTotal !== newTotal) return true;

  // Step 2: Compare item lengths
  const itemsA = oldItems;
  const itemsB = newItems;

  if (itemsA.length !== itemsB.length) return true;

  // Step 3: Create maps for quick lookup
  const mapA = new Map(itemsA.map(item => [item.id, item]));
  const mapB = new Map(itemsB.map(item => [item.id, item]));

  // Step 4: Compare product IDs
  for (let id of mapA.keys()) {
    if (!mapB.has(id)) return true;
  }

  // Step 5: Compare quantities
  for (let [id, itemA] of mapA.entries()) {
    const itemB = mapB.get(id);
    if (itemA.quantity !== itemB.quantity) return true;
  }

  // No differences found
  return false;
}


export default function EditOrder(){
    const { id } = useParams()
    const [customer, setCustomer] = useState({})
    const [olderOrder, setOldOrder] = useState({})
    const [items, setItems] = useState([])
    const [error, setError] = useState("")
    const [success,setSuccess] = useState("")
    const navigate = useNavigate()
    const [isProductSetModalOpen, setIsProductModalOpen] = useState(false)
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const total = items.reduce((val,cur) => val + cur.totalPrice,0)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        ( async () => {
            try {
                const order = await getOrderById(id)
                setOldOrder(order)
                const  customerDb = await getCustomerById(order.customerId)
                setCustomer(customerDb)
                setItems(order.items)
            } catch (error) {
                setError(error.message)
            }
        })()
    },[id])

    const openAddItemModal = () => setIsProductModalOpen(true)
    const closeAddItemModal = () => {
        setIsProductModalOpen(false)
    }

    const handleOrderItemSubmit = (item) => {
        setItems(prevItems => {
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
        setItems((previous) => previous.splice(index,1))
    }

    const handleOrderSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setSubmitButtonDisabled(true)
        if(!items.length){
            setError("The list of items is empty")
            setSubmitButtonDisabled(false)
            return
        }
        if(!areOrdersDifferent(olderOrder.total,total,olderOrder.items,items)){
            setError("The older and new order are equal")
            setSubmitButtonDisabled(false)
            return
        }
        setLoading(true)
        try{
            const newOrderId = await editOrder({
                oldId:id,
                customerId:customer.id,
                items,
                total,
            })
            setLoading(false)
            setSuccess("order updated successful")
            navigate("/view-order/" + newOrderId)
            setSubmitButtonDisabled(false)
        } catch (error) {
            setError("something went wrong, try again or check your network settings")
            setSubmitButtonDisabled(false)
            setLoading(false)
        }
    }
    
    return (
        <div>
        	{ loading && <FullScreenLoader/>}
            {Object.keys(customer).length !== 0 &&  <div className="selected-customer">
		<div>
		  <strong>{customer.name} {customer.surname}</strong><br />
		  <span>{customer.idNo}</span>
		</div>
	  </div>}
            <div>
                <div>
                    <button
                        onClick={openAddItemModal}
                    >
                        add item
                    </button>
                </div>
                {isProductSetModalOpen && <Modal onClose={closeAddItemModal}>
                    <AddOrderItem
                        onSubmit={handleOrderItemSubmit}
                        onSuccess={closeAddItemModal}
                    />
                </Modal>}
                <div className="order-items-list">
		  {items.length === 0 ? (
		    <p>No items added yet.</p>
		  ) : (
		    <ul>
		      {items.map((item, index) => (
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
	        <strong>Total:</strong> R{total.toFixed(2)}
	    </div>
            </div>
            <button
                disabled={submitButtonDisabled}
                onClick={handleOrderSubmit}>
                Edit order
            </button>
            {error && <div> {error} </div>}
            {success && <div> {success} </div>}
        </div>
    )
}
