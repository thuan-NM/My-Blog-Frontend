import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; // import trực tiếp jwt-decode
import UserServices from "../services/user.services";
import CompanyServices from "../services/company.services";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [role, setRole] = useState(null); // Thêm state cho role
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
          const decodedToken = jwtDecode(storedToken);
          console.log(decodedToken);

          if (!decodedToken.companyId) {
            const response = await UserServices.getUsersWithId(decodedToken.userId);
            const userData = response.data;
            console.log("this:", userData);
            setUser(userData);
            setRole('user'); // Đặt role là 'user'
          } else {
            const response = await CompanyServices.getCompanyWithId(decodedToken.companyId);
            const userData = response.data;
            console.log("this:", userData);
            setUser(userData);
            setRole('company'); // Đặt role là 'company'
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
    updateUser();
  };

  const logout = (ws) => {
    setUser(null);
    setRole(null); // Reset role khi logout
    localStorage.removeItem('token');
    navigate("/auth");
  };

  const updateUser = async () => {
    try {
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        const decodedToken = jwtDecode(storedToken);

        if (decodedToken.companyId) {
          const response = await CompanyServices.getCompanyWithId(decodedToken.companyId);
          const companyData = response.data;
          setUser(companyData);
          setRole('company'); // Cập nhật role là 'company'
        } else if (decodedToken.userId) {
          const response = await UserServices.getUsersWithId(decodedToken.userId);
          const userData = response.data;
          setUser(userData);
          setRole('user'); // Cập nhật role là 'user'
        }
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };