import React,{ useState } from "react";
import { addProduct } from "./ProductService";
import FloatingLabelInput from "../FloatingInput/FloatingLabelInput";
import validateAmount from "../../utils/validateAmount";
import FullScreenLoader from "../Loaders/FullScreenLoader";

export default function AddProduct(){
    const [name,setName] = useState("")
    const [brand,setBrand] = useState("")
    const [unit,setUnit] = useState("")
    const [unitPrice,setUnitPrice] = useState(0)
    const [barCode,setBarCode] = useState("")
    const [error,setError] = useState("")
    const [success,setSuccess] = useState("")
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [loading,setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitButtonDisabled(true)
        setError("")
        setSuccess("")

        if(!name){
            setError("Name is required")
            setSubmitButtonDisabled(false)
            return
        }

        const validAmount = validateAmount(unitPrice)
        if(!validAmount.valid){
            setError(validAmount.reason)
            setSubmitButtonDisabled(false)
            return
        }

        setLoading(true)
        try {
            await addProduct({name,brand,unit,unitPrice:validAmount.value,barCode})
            setUnitPrice(0)
            setName("")
            setUnit("")
            setBarCode("")
            setBrand("")
            setSuccess("Product Added")
            
            
        } catch (error) {
            console.error("error adding product", error)
            setError(error.message || "Something went wrong")
        }
        finally{
            setSubmitButtonDisabled(false)
            setLoading(false)
        }
    }
    return (
        <div>
        	{ loading && <FullScreenLoader/>}
            <h1>Add Product</h1>
            <form onSubmit={handleSubmit}>
                <FloatingLabelInput
                    id={"product-name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label={"Name"}
                />
                <FloatingLabelInput
                    id={"product-brand"}
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    label={"Brand"}
                />
                
                <FloatingLabelInput
                    id={"product-unit"}
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    label={"Unit"}
                />
                <FloatingLabelInput
                    id={"product-unit-price"}
                    value={unitPrice}
                    type="number"
                    onChange={(e) => {
                        const value = e.target.value
                        setUnitPrice(value === ""? "" : parseFloat(value,2))
                    }}
                    label={"Unit price"}
                />
                <FloatingLabelInput
                    id={"product-barcode"}
                    value={barCode}
                    onChange={(e) => setBarCode(e.target.value)}
                    label={"Barcode"}
                />
                <button disabled={submitButtonDisabled} type="submit">Add Product</button>

                {success && <p> {success} <button onClick={(e) => setSuccess("")}>X</button></p>}
                {error && <p> {error} <button onClick={(e) => setError("")}>X</button></p>}
            </form>   
        </div>
    )
}
