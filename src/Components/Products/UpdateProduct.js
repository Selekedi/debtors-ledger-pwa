import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { editProduct, getProductById } from "./ProductService";
import FloatingLabelInput from "../FloatingInput/FloatingLabelInput";
import validateAmount from "../../utils/validateAmount";
import FullScreenLoader from "../Loaders/FullScreenLoader";

export default function UpdateProduct(){
    const { id } = useParams()
    const [product, setProduct] = useState({})
    const [newBrand,setNewBrand] = useState("")
    const [newName,setNewName] = useState("")
    const [newUnit,setNewunit] = useState("")
    const [newUnitPrice,setNewUnitPrice] = useState("")
    const [newBarCode, setNewBarCode] = useState("")
    const [error,setError] = useState("")
    const [success,setSuccess] = useState("")
    const navigate = useNavigate()
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
            (async () => {
                try {
                    const dbProduct =  await getProductById(id)
                    setProduct(dbProduct)
                    setNewBrand(dbProduct.brand)
                    setNewName(dbProduct.name)
                    setNewunit(dbProduct.unit)
                    setNewUnitPrice(dbProduct.unitPrice)
                    setNewBarCode(dbProduct.barCode)
                } catch (error) {
                    setError(error.message)
                }
            })()
        },[id])

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setSubmitButtonDisabled(true)
        const updatedProduct = {}
        const validAmount = validateAmount(newUnitPrice)
        if(validAmount.valid){
            if(validAmount.valid === product.unitPrice) updatedProduct.unitPrice = validAmount.value
        }
        if(newName && newName !== product.name) updatedProduct.name = newName
        if(newBrand && newBrand !== product.brand) updatedProduct.brand = newBrand
        if(newUnit && newUnit !== product.unit) updatedProduct.unit = newUnit
        if(newBarCode && newBarCode !== product.barCode) updatedProduct.barCode = newBarCode

        if(Object.keys(updatedProduct).length > 0){
            setLoading(true)
            try {
                await editProduct(id,updatedProduct)
                setSuccess("Product updated successfully")
                setSubmitButtonDisabled(false)
                setLoading(false)
                navigate("/view-product/" + id)
            } catch (error) {
                setError(error.message)
                setSubmitButtonDisabled(false)
                setLoading(false)
            }
        }else {
            setSuccess("Product updated successfully 1")
            setSubmitButtonDisabled(false)
            setLoading(false)
        }
    }

    return (
        <div>
        	{ loading && <FullScreenLoader/>}
            <h1>
                Edit Customer
                {error && <div>{error}</div>}
                <form onSubmit={handleFormSubmit}>
                    <FloatingLabelInput
                        id={"new-name"}
                        value={newName}
                        label={"New name"}
                        onChange={(e) => setNewName(e.target.value)}
                    />

                    <FloatingLabelInput
                        id={"new-brand"}
                        value={newBrand}
                        label={"New brand"}
                        onChange={(e) => setNewBrand(e.target.value)}
                    />
                    <FloatingLabelInput
                        id={"new-unit"}
                        value={newUnit}
                        label={"New unit"}
                        onChange={(e) => setNewunit(e.target.value)}
                    />
                    <FloatingLabelInput
                        id={"new-unit-price"}
                        value={newName}
                        type="number"
                        label={"New unit price"}
                        onChange={(e) => {
                            const value = e.target.value
                            setNewName(value === ""? "": parseFloat(value,2))
                        }}
                    />
                    <FloatingLabelInput
                        id={"new-barcode"}
                        value={newBarCode}
                        label={"New barcode"}
                        onChange={(e) => setNewBarCode(e.target.value)}
                    />
                    <button disabled={submitButtonDisabled} type="submit">Update</button>

                    {success && <div> {success} </div>}
                    {error && <div>{error}</div>}
                </form>
            </h1>
        </div>
    )
}
