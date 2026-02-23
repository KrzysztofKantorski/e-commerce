import React from 'react'
import {Form, Input, Button} from "@heroui/react";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import {useState} from "react"
import "../styles/Login.css";
import TextGlitchAnimation from '@/components/TextGlitchAnimation';
import {useData} from "../Context/UserDataContext"
import { useNavigate } from "react-router";
import handleApiError from "../api/handleApiError"
import auth from '../api/auth';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [action, setAction] = useState("")
  const { checkAuth } = useData();
  const {clearErrors, handleError, fieldErrors} = handleApiError()
  const navigate = useNavigate();
  const loginAuth = async (e)=>{
    e.preventDefault();
    clearErrors();
    if(!username || username === ""){
        setErrors({username: "Nazwa użytkownika jest wymagana"});
        return
      }
      try{
        await auth.login(username, password)
        const success = await checkAuth();
        if (success) {
              navigate("/"); 
        }
      }
      catch(err){
        handleError(err, "login")
    }
  }
return (
  <>  
  <TextGlitchAnimation text={"Zaloguj się"}></TextGlitchAnimation>

    <div className="w-[100%] min[100vh] flex column items-center justify-center"> 
      
      <div className="flex flex-col items-center justify-start py-[5rem]">
      
        <NeonGradientCard className="items-center justify-center text-center min-h-[20rem] max-w-sm z-[10] mt-[2rem]">
          <Form
          validationErrors={fieldErrors}
          className="w-[30rem] max-w-xs flex flex-col gap-5 min-h-[20rem] text-left  justify-center"
          onReset={() => setAction("reset")}
          onSubmit={loginAuth}
          >

            <Input
              isRequired
              label="Nazwa użytkownika"
              labelPlacement="outside"
              placeholder="Nazwa użytkownika"
              name="username"
              type="text"
              className="border-2 border-primary rounded-lg"
              value={username}
              onChange = {(e)=> setUsername(e.target.value)}    
            />
        
        
            <Input
              isRequired
              label="Hasło"
              labelPlacement="outside"
              name="password"
              placeholder="hasło"
              type="password"
              className="border-2 border-primary rounded-lg"
              value={password}
              onChange = {(e)=> setPassword(e.target.value)}
            />


            <div className="flex items-center justify-center gap-2 text-center w-full mt-[1rem]">
              <Button color="primary" type="submit" className="px-[1rem] px-[1rem]">
                Zaloguj
              </Button>
              <Button type="reset" variant="flat" className="px-[1rem] px-[1rem]" onPress={()=>{clear()}}>
                Wyczyść
              </Button>
            </div>


          </Form>
        </NeonGradientCard>
      </div>
    </div>
  </>
)}

export default Login