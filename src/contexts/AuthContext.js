import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import UserServices from "../services/user.services"
import CompanyServices from "../services/company.services"

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
          if (!decodedToken.companyId) {
            const response = await UserServices.getUsersWithId(decodedToken.userId)
            const userData = response.data;
            console.log("this:",userData)
            setUser(userData);
          }
          else {
            const response = await CompanyServices.getCompanyWithId(decodedToken.companyId)
            const userData = response.data;
            console.log("this:",userData)
            setUser(userData);
          }
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

      // Nếu tồn tại `companyId` trong token, tức là đây là một công ty
      if (decodedToken.companyId) {
        const response = await CompanyServices.getCompanyWithId(decodedToken.companyId);
        const companyData = response.data;
        setUser(companyData); // Cập nhật dữ liệu của công ty
      } 
      // Nếu tồn tại `userId` trong token, tức là đây là một người dùng
      else if (decodedToken.userId) {
        const response = await UserServices.getUsersWithId(decodedToken.userId);
        const userData = response.data;
        setUser(userData); // Cập nhật dữ liệu của người dùng
      }
    }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser}}>
      {children}
    </AuthContext.Provider>
  );
};


const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
