// src/context/SettingsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

export const SettingsProvider = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [staffPermissions, setStaffPermissions] = useState({});
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  // Always fetch permissions for the current pharmacy (both admin and staff)
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await api.get('/staff-permissions');
        console.log('Loaded permissions:', res.data); // debug
        setStaffPermissions(res.data);
      } catch (error) {
        console.error('Failed to load staff permissions:', error);
      } finally {
        setLoadingPermissions(false);
      }
    };
    fetchPermissions();
  }, []);

  const toggleStaffPermission = async (staffId) => {
    if (!isAdmin) return;
    const newValue = !staffPermissions[staffId];
    setStaffPermissions((prev) => ({ ...prev, [staffId]: newValue }));
    try {
      await api.post('/staff-permissions', {
        staffId,
        canEditDelete: newValue,
      });
    } catch (error) {
      setStaffPermissions((prev) => ({ ...prev, [staffId]: !newValue }));
      console.error('Failed to update permission:', error);
      alert('Failed to update permission. Please try again.');
    }
  };

  const canEditDelete = () => {
    if (isAdmin) return true;
    // Staff: check their own permission (default false if not found)
    const hasPermission = staffPermissions[user?.id] === true;
    console.log(`User ${user?.id} canEditDelete:`, hasPermission); // debug
    return hasPermission;
  };

  return (
    <SettingsContext.Provider
      value={{
        staffPermissions,
        toggleStaffPermission,
        canEditDelete,
        isAdmin,
        loadingPermissions,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
