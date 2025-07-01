import { useNavigate, useParams } from "react-router-dom";
import React,{ useState , useEffect} from "react";
import { getProductById, softDeleteProduct } from "./ProductService";
import InfoGrid from "../InfoGrid/InfoGrid"
import FullScreenLoader from "../Loaders/FullScreenLoader";

export default function ViewProduct(){
    const { id } = useParams()
    const [product,setProduct] = useState({})
    const [error,setError] = useState("")
    const navigate = useNavigate()
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                const dbProduct =  await getProductById(id)
                setProduct(dbProduct)
            } catch (error) {
                setError(error.message)
            }
        })()
    },[id])
    
    const handleSoftDelete = async (e) => {
        setSubmitButtonDisabled(true)
        e.preventDefault()
        setLoading(true)
        try {
            await softDeleteProduct(id)
        } catch (error) {
            setError(error.message)
        }
        finally {
            setSubmitButtonDisabled(false)
            setLoading(false)
        }
        
    }

 

    return (
        <div>
        	{ loading && <FullScreenLoader/>}
            { error && <div> {error} </div> }
            <InfoGrid
            	fields ={[
            		["Name",product.name],
					["Brand",product.brand],
					["Unit",product.unit],
					["Unit Price",product.unitPrice],
					["Barcode", product.barCode]
            	]}
            />
            <div className="actions" style = {{marginLeft:"16px"}}>
                <button 
                    onClick={() => navigate(`/update-product/${id}`)}
                >
                    Edit
                </button>
                <button 
                    disabled={submitButtonDisabled}
                    onClick={handleSoftDelete}
                >
                    Delete Product
                </button>
            </div>
        </div>
    )
}
