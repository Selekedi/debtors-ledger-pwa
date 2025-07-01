import React, { useEffect, useState } from "react";
import FuzeSearchBar from "../SearchBar/FuzeSearchBar";
import { getProducts } from "./ProductService";
import "./ProductFusySearchBar.css"

const renderProduct = (item, { isHighlighted }) => {
  return (
    <div className={`search-result-item ${isHighlighted ? "highlighted" : ""}`}>
      <div className="product-name">{item.name}</div>
      <div className="product-meta">
        <span>{item.brand}</span>
        <span>{item.unit}</span>
        <span className="price">R{item.unitPrice}</span>
      </div>
    </div>
  );
};


export default function ProductFusySearchBar({onSelect, products:externalProducts}){
    const [products,setProducts] = useState([])
    const [error, setError] = useState("")
    const [success,setSuccess] = useState("")
    const searchFileds = ["name", "brand", "barCode"]

    useEffect(() => {
        if(!externalProducts){
            (async () => {
                try {
                    const fbProducts = await getProducts()
                    setProducts(fbProducts)
                    setSuccess("got it")
                } catch (error) {
                    console.error(error)
                    setError(error.message)
                }
            })()
        }else {
            setProducts(externalProducts)
            setSuccess("got it")
        }
        
    },[externalProducts])

    if(error) return <div>{error}</div>

    if(!success) return <div>loading...</div>

    return (
        <FuzeSearchBar
            data={products}
            placeholder={"search product"}
            onSelect={onSelect}
            searchFeilds={searchFileds}
            renderItem={renderProduct}
        />
    )
}
