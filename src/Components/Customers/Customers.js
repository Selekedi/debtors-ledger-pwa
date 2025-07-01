import React,{useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import FabLink from "../FAB/FabLink";
import { getCustomers } from "./CustomerService";
import CustomerFusySearchBar from "./CustomerFusySeachBar";
import Pagination from "../Pagination/Pagination";
import CustomerCard from "./CustomerCard";

function renderCustomer(customer) {
  return <CustomerCard key={customer.idNo} customer={customer} />;
}


export default function Customers(){
    const [customers, setCustomers] = useState([])
    const [pagCurrentPage, setPagCurrentPage] = useState(1)
    const itemsPerPage = 10
    const totalItems = customers.length
    const totalPages = Math.ceil(totalItems/itemsPerPage)
    const [activeCustomers, setActiveCustomers] = useState(true)


    const startIndex = (pagCurrentPage - 1) * itemsPerPage
    const endIndex = Math.min(totalItems,startIndex + itemsPerPage)
    const customersToShow = customers.slice(startIndex,endIndex)
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            try {
                const dbCustomers = await getCustomers(!activeCustomers)
                setCustomers(dbCustomers.map(({surname,id, name, idNo, cell,balance}) => {
                    return {
                        id,
                        surname,
                        name,
                        idNo,
                        cell,
                        balance
                    }
                })
                    .sort((a,b) => a.name.localeCompare(b.name)))
            } catch (error) {
                console.error(error)
            }
        })()
    },[activeCustomers])

    const handlePageChange = (page) => {
        setPagCurrentPage(page)
    }

    return (
        <div>
            <FabLink
                to={"/add-customer"}
                label="add-customer"
            />
            <h1>
                Customers
            </h1>
            <select 
                value={String(activeCustomers)} // convert boolean to string for controlled input
                onChange={(e) => setActiveCustomers(e.target.value === "true")}
                >
                <option value="true">Active</option>
                <option value="false">Deleted</option>
            </select>

            <CustomerFusySearchBar
                onSelect={(item) => navigate(`/view-customer/${item.id}`)}
                customers={customers}
            />
            <div>
                {customersToShow.map(renderCustomer)}
                <Pagination
                    currentPage={pagCurrentPage}
                    onPageChange={handlePageChange}
                    totalPages={totalPages}
                />

            </div>
        </div>
    )
}
