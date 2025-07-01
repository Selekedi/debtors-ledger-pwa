import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import FloatingLabelInput from "../FloatingInput/FloatingLabelInput";
import FloatingLabelPasswordInput from "../FloatingInput/FloatingLabelPasswordInput";

export default function LogIn(){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const navigate = useNavigate()

    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth,email,password)
            navigate("/")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
    
                <FloatingLabelInput
                    id={"login-email"}
                    label={"Email"}
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                />
                <FloatingLabelPasswordInput
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <button type={"submit"}>Log In</button>
            </form>
        </div>
    )
}