import React, { useEffect, useState } from "react";
import FuzeSearchBar from "../SearchBar/FuzeSearchBar";
import { getCustomers } from "./CustomerService";
import "./CustomerFusySearchBar.css"

const renderCustomer = (item, { isHighlighted }) => (
  <div className={`search-result-item customer-result ${isHighlighted ? "highlighted" : ""}`}>
    <div className="customer-name">{item.name} {item.surname}</div>
    <div className="customer-meta">
      <span className="cell">{item.cell}</span>
      <span className="id">{item.idNo}</span>
    </div>
  </div>
);


export default function CustomerFusySearchBar({onSelect, customers:externalCustomers}){
    const [customers,setCustomers] = useState(externalCustomers||[])
    const [error, setError] = useState("")
    const [success,setSuccess] = useState("")
    const searchFileds = ["name", "surname", "idNo", "cell"]

    useEffect(() => {
        if(!externalCustomers){
            (async () => {
                try {
                    const fbCustomers = await getCustomers()
                    setCustomers(fbCustomers)
                    setSuccess("got it")
                } catch (error) {
                    console.error(error)
                    setError(error.message)
                }
            })()
        }else {
            setCustomers(externalCustomers)
            setSuccess("got it")
        }
        
    },[externalCustomers])

    if(error) return <div>{error}</div>

    if(!success) return <div>loading...</div>

    return (
        <FuzeSearchBar
            data={customers}
            placeholder={"search customer"}
            onSelect={onSelect}
            searchFeilds={searchFileds}
            renderItem={renderCustomer}
        />
    )
}
