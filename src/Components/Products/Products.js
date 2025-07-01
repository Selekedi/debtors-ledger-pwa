import React,{useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import FabLink from "../FAB/FabLink";
import { getProducts } from "./ProductService";
import ProductFusySearchBar from "./ProductFusySearchBar";
import "./Products.css"


export default function Products(){
    const [products, setProducts] = useState([])
    const [pagCurrentPage, setPagCurrentPage] = useState(1)
    const itemsPerPage = 10
    const totalItems = products.length
    const totalPages = Math.ceil(totalItems/itemsPerPage)

    const startIndex = (pagCurrentPage - 1) * itemsPerPage
    const endIndex = Math.min(totalItems,startIndex + itemsPerPage)
    const productsToShow = products.slice(startIndex,endIndex)
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            try {
                const dbProducts = await getProducts()
                setProducts(dbProducts.map(({brand,id, name, unit, barCode,unitPrice}) => {
                    return {
                        id,
                        brand,
                        name,
                        unit,
                        barCode,
                        unitPrice
                    }
                })
                )
            } catch (error) {
                console.error(error)
            }
        })()
    },[])

    const handlePageChange = (page) => {
        setPagCurrentPage(page)
    }

    return (
        <div className = "products-page">
            <h1>
                Products
            </h1>
            <ProductFusySearchBar
                onSelect={(item) => navigate(`/view-product/${item.id}`)}
                products={products}
            />
            <div>
                {productsToShow.map((product) => (
				  <div key={product.id} className="product-card" onClick = {(e) => {
						e.stopPropagation()
						navigate("/view-product/" + product.id)
					}}>
					<div className="card-header">
					  <strong>{product.name}</strong>
					  <span className="brand">{product.brand}</span>
					</div>
					<div className="card-meta">
					  <span>Unit: {product.unit}</span>
					  <span className="price">R{product.unitPrice.toFixed(2)}</span>
					</div>
				  </div>
				))}

                <Pagination
                    currentPage={pagCurrentPage}
                    onPageChange={handlePageChange}
                    totalPages={totalPages}
                />
            </div>
            <FabLink
                to={"/add-product"}
                label="add-product"
            />

        </div>
    )
}
