import { useCallback, useState } from "react";
const handleApiError = ()=>{
  const [globalError, setGlobalError] = useState(""); 
  const [fieldErrors, setFieldErrors] = useState({}); 
  const handleError = useCallback((error, context = "default")=>{
    setGlobalError("");
    setFieldErrors({});
    if(error.response){
      const status = error.response?.status
      const message = error.response.data?.message
      switch (status) {

        //Incorrect credentials
        case 400:
          if(context === "login"){
            setGlobalError("Nieprawidłowe hasło");
            setFieldErrors({
              password: "Podano niepoprawne dane logowania",
              username: "Podano niepoprawne dane logowania"
            });
          }
          else{
            setGolobalError(message);
          }
        break


        //User unauthorized
        case 403:
          if(context === "product"){
            setGlobalError("Brak uprawnień do wykonania tej akcji");
          }
          else{
            setGlobalError(message);
          }


        //User not found
        case 404:
          if(context == "login"){
            setGlobalError("Użytkownik nie istnieje");
            setFieldErrors({username: "Niepoprawna nazwa użytkownika"})
          }
          else{
            setGolobalError("Nie znaleziono zasobu");
          }
          break;

        // Conflict 
        case 409: 
          if(context === "product"){
            setGlobalError("Taki produkt już istnieje" );
          }
          else{
            setGlobalError(message);
          }
          
          break;

        // Server Error
        case 500: 
          setGlobalError("Błąd serwera. Spróbuj ponownie później.");
          break;

        default:
          setGlobalError("Wystąpił nieoczekiwany błąd.");
      }
     
    }
    else if (error.request) {
      setGlobalError("Brak połączenia z serwerem.");
    } else {
      setGlobalError("Wystąpił błąd aplikacji.");
      console.error(error);
    }

  }, [])

  //Clear errors
  const clearErrors = ()=>{
    setFieldErrors({});
    setGlobalError("");
  }

  return {clearErrors, handleError, fieldErrors, globalError}
}

export default handleApiError;