import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../Header/Header";
import AddCustomer from "../Customers/AddCustomer";
import AddProduct from "../Products/AddProduct";
import Customers from "../Customers/Customers";
import ViewCustomer from "../Customers/ViewCustomer";
import UpdateCustomer from "../Customers/UpdateCustomer";
import Products from "../Products/Products";
import ViewProduct from "../Products/ViewProduct";
import UpdateProduct from "../Products/UpdateProduct";
import AddPayment from "../Payments/AddPayment";
import EditPayment from "../Payments/EditPayment";
import ViewPayment from "../Payments/ViewPayment";
import Home from "../Home/Home";
import LogIn from "../Login/Login";
import ProtectedRoute from "../../utils/ProtectedRoute";
import { auth } from "../../services/firebase";
import { debounce } from "../../utils/debouce";
import AddOrder from "../Orders/AddOrder";
import ViewOrder from "../Orders/ViewOrder";
import EditOrder from "../Orders/EditOrder";
import { onAuthStateChanged } from "firebase/auth";
import Payments from "../Payments/Payments";
import Orders from "../Orders/Orders";
import SplashScreen from "../Loaders/SplashScreen"
import NotFound from "../NotFound/NotFound"
import RedirectHandler from "../../utils/RedirectHandler"
import { AuditProvider } from "../../contexts/AuditContext";


export default function Main(){
    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [user,setUser] = useState(undefined)

    useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    const debouncedUpdate = debounce(updateHeight, 100);
    
    // Initial height
    
    

    // Add resize listener
    window.addEventListener("resize", debouncedUpdate);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // could be null if not logged in
      console.log(headerRef.current)
      setTimeout(updateHeight,100)
    });

    // Cleanup
    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      unsubscribe()
    };
  }, []);

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
  }
  }, []);


    if(user === undefined) return <SplashScreen/>

    return (
        <div>
            <AuditProvider>
              <Router basename= "debtors-ledger-pwa">
              	<RedirectHandler/>
                <Header ref={headerRef}/>
                <main style={{padding:"24px",paddingTop:`${headerHeight + 10}px`}}>
                <Routes>
                    <Route path="/login" element={<LogIn/>}/>
                    <Route element={<ProtectedRoute user={user}/>}>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/add-customer" element={<AddCustomer/>}/>
                        <Route path="/add-product" element={<AddProduct/>}/>
                        <Route path="/customers" element={<Customers/>}/>
                        <Route path="/view-customer/:id" element={<ViewCustomer/>}/>
                        <Route path="/update-customer/:id" element={<UpdateCustomer/>}/>
                        <Route path="/products" element={<Products/>}/>
                        <Route path="/view-product/:id" element={<ViewProduct/>}/>
                        <Route path="/update-product/:id" element={<UpdateProduct/>}/>
                        <Route path="/orders" element={<Orders/>} />
                        <Route path="/add-order" element={<AddOrder/>}/>
                        <Route path="/add-order/:id" element={<AddOrder/>}/>
                        <Route path="/view-order/:id" element={<ViewOrder/>}/>
                        <Route path="/edit-order/:id" element={<EditOrder/>}/>
                        <Route path="/add-payment" element={<AddPayment/>}/>
                        <Route path="/payments" element={<Payments/>}/>
                        <Route path="/add-payment/:id" element={<AddPayment/>}/>
                        <Route path="/edit-payment/:id" element={<EditPayment/>}/>
                        <Route path="/view-payment/:id" element={<ViewPayment/>}/>
                        <Route path="*" element={<NotFound />} />
                    </Route> 
                </Routes>
                </main>
            </Router>
          </AuditProvider>  
        </div>
    )
}
