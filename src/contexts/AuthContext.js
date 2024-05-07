import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem('token');
  
        if (storedToken) {
          const decodedToken = jwtDecode(storedToken);
          console.log(decodedToken)
          if(!decodedToken.companyId){
          const response = await axios.get(`http://localhost:3001/users/${decodedToken.userId}`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          const userData = response.data.data;
          setUser(userData);}
          else{
            const response = await axios.get(`http://localhost:3001/companies/${decodedToken.companyId}`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          const userData = response.data.data;
          setUser(userData);}
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    updateUser()
  };

  const logout = (ws) => {
    setUser(null);
    localStorage.removeItem('token');
    navigate("/auth");
  };

  const updateUser = async () => {
    try {
      const storedToken = localStorage.getItem('token');
  
      if (storedToken) {
        const decodedToken = jwtDecode(storedToken);
        const response = await axios.get(`http://localhost:3001/users/${decodedToken.userId}`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
  
        const userData = response.data.data;
        setUser(userData);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout,updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};


const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
