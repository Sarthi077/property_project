import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const API_URL = 'http://localhost:4000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (authToken) => {
    try {
      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUserProfile(token);
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // ─── Auth ────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/user/login`, {
        userEmail: email,
        userPass: password
      });
      if (response.data.status === 'success') {
        setToken(response.data.token);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      if (user?.user_id && token) {
        await axios.get(`${API_URL}/user/logout/${user.user_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/user/signin`, userData);
      if (response.data.status === 'success') {
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  // ─── Profile ─────────────────────────────────────────────────────────
  // FIX: backend reads req.body.userName (not user_name)
  const editUserProfile = async (updates) => {
    try {
      if (!user?.user_id) return { success: false, message: 'User not found' };

      const payload = {
        userName: updates.userName || updates.user_name || updates.name,
        userId: user.user_id
      };

      const response = await axios.post(
        `${API_URL}/user/edit-user-profile/${user.user_id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === true) {
        // Re-fetch updated profile
        await fetchUserProfile(token);
        return { success: true, message: 'Profile updated successfully' };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Profile update failed' };
    }
  };

  // FIX: backend reads userId, oldPassword, newPassword; returns status:true
  const changePassword = async (oldPassword, newPassword) => {
    try {
      if (!user?.user_id) return { success: false, message: 'User not found' };

      const response = await axios.post(
        `${API_URL}/user/change-password-user-profile/${user.user_id}`,
        { userId: user.user_id, oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Backend returns { status: true, message: "..." }
      if (response.data.status === true) {
        return { success: true, message: 'Password changed successfully' };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Password change failed' };
    }
  };

  // FIX: backend returns { status: true, ... } not { success: true }
  const deleteUserProfile = async () => {
    try {
      if (!user?.user_id) return { success: false, message: 'User not found' };

      const response = await axios.get(
        `${API_URL}/user/profile/delete/${user.user_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === true) {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        return { success: true, message: 'Account deleted successfully' };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Account deletion failed' };
    }
  };

  // ─── Properties ──────────────────────────────────────────────────────
  const listMyProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}/property/list-property/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        return { success: true, properties: response.data.properties };
      }
      return { success: false, properties: [] };
    } catch (error) {
      return { success: false, properties: [], message: error.response?.data?.message || 'Failed to fetch properties' };
    }
  };

  const createProperty = async (formData) => {
    try {
      const response = await axios.post(
        `${API_URL}/property/create-property`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      if (response.data.status === true) {
        return { success: true, message: 'Property created successfully' };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to create property' };
    }
  };

  const updateProperty = async (propertyId, formData) => {
    try {
      const response = await axios.post(
        `${API_URL}/property/update-property/${propertyId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      if (response.data.status === true) {
        return { success: true, message: 'Property updated successfully' };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update property' };
    }
  };

  const deleteProperty = async (propertyId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/property/delete-property/${propertyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Backend returns { status: false, message: "property delete successfully" } - note: status is false on success (backend bug)
      if (response.status === 200) {
        return { success: true, message: 'Property deleted successfully' };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete property' };
    }
  };

  // ─── Password Reset ───────────────────────────────────────────────────
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${API_URL}/password/forget-password`, { userEmail: email });
      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to send reset email' };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/password/reset-password`, { token, newPassword });
      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Password reset failed' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      editUserProfile,
      changePassword,
      deleteUserProfile,
      listMyProperties,
      createProperty,
      updateProperty,
      deleteProperty,
      forgotPassword,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
