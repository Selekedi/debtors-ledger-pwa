import React,{ useState } from "react";
import ProductFusySearchBar from "../Products/ProductFusySearchBar";
import "./AddOrderItem.css"

export default function AddOrderItem({onSubmit, onSuccess}){
    const [product, setProduct] = useState(null)
    const [quantity,setQuantity] = useState(1)
    const [isProductSet,setIsProductSet] = useState(false)
    const [inputValue, setInputValue] = useState("1")
    const [error, setError] = useState("")
    const totalPrice = quantity * (product?.unitPrice ?? 0);



    const handleQuantityInputChange = (e) => {
        const value = Number(e.target.value)
        const safeValue = isNaN(value) || value < 0 ? 0 : Math.floor(value)
        setQuantity(safeValue)
        setInputValue(safeValue.toString())

    }


    const onSelect = (item) => {
        setProduct(item)
        setQuantity(1)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setError("")
        if(quantity <= 0){
            setError("You cant add item if quantity is zero")
            return
        }
        const item = {
            ...product,
            quantity,
            totalPrice
        }
        

        onSubmit(item)
        setProduct(null)
    }

    return (
        <div>
            <div>
            	{ !product ? 
                <ProductFusySearchBar
                    onSelect={onSelect}
                />
                :
                <div className= "selected-product-details">
                  <h3>{product.name}</h3>
					<p>Brand: <strong>{product.brand}</strong></p>
					<p>Unit: <strong>{product.unit}</strong></p>
					<p>Price: R{product.unitPrice}</p>
					<button className="change-btn" onClick={() => setProduct(null)}>
					  ← Change Product
					</button>
                    <div>
                    	<label>
                    		Quantity :
                        <input
                            value={inputValue}
                            placeholder="quantity"
                            type="number"
                            onChange={handleQuantityInputChange}
                        />
                        </label>
                    <div>
                        <span>
                            total price : {totalPrice}
                        </span>
                    </div>
                    <button className="add-btn"
                        onClick={handleSubmit}
                    >Add Item</button>
                    </div>
                    {error && <div>{error}</div>}
                </div>
               }
            </div>
        </div>
    )
}
