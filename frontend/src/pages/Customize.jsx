import React from 'react'
import styled from 'styled-components';
import LoadingData from '@/components/handleData/LoadingData';
import {useState, useEffect, useRef} from "react"
import axios from "axios"
import Cookies from "universal-cookie"
import {useNavigate} from "react-router"
const cookies = new Cookies();

function Customize() {
    const [selectedFile, setSelectedFile] = useState(null);
   const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    
    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };
    const onFileUpload = async () => {
        if (!selectedFile) return;
		const formData = new FormData();
		formData.append('file', selectedFile);
		try{
            setLoading(true);
            const token = cookies.get("TOKEN");
            if(!token){
                alert("Musisz być zalogowany aby zarządzać ulubionymi produktami");
                navigate("/Login");
                return;
            }
            const url = `http://localhost:3000/auth/uploadImage`;
            const response = await axios.post(url, formData,{
            headers: {
            Authorization: `Bearer ${token}`,
            }
            });
            console.log('Upload successful:', response.data);
            alert('Plik przesłany pomyślnie!');
        }
     
        catch(error){
             console.error('Upload error:', error);
            alert('Błąd podczas przesyłania pliku');
        }
        finally{
            setLoading(false)
        }
	};
  return (
        <div className="w-full flex items-center justify-center flex-col h-[100vh]">
            <input 
                ref={fileInputRef}
                type="file" 
                onChange={onFileChange} 
                style={{ display: 'none' }} // Całkowicie ukrywamy input
            />
            
            <button onClick={triggerFileInput}>
                Wybierz plik
            </button>
            
            <button onClick={onFileUpload} disabled={loading || !selectedFile}>
                {loading ? 'Uploadowanie...' : 'Upload!'}
            </button>

            {selectedFile && (
                <p style={{ marginTop: '10px' }}>
                    Wybrano: {selectedFile.name}
                </p>
            )}
        </div>
                
  )
}



export default Customize