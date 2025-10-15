import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ValidationRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(state => state.authentication);
  const roleId = Number(user?.roleId);

  console.log('ValidationRoute - roleId:', roleId); // Debug log

  // Public routes
  const publicRoutes = ['/login', '/register', '/evdashboard', '/evdashboard/*'];

  // Check public routes
  const isPublicRoute = publicRoutes.some(route => {
    if (route.endsWith('*')) {
      return location.pathname.startsWith(route.slice(0, -1));
    }
    return location.pathname === route;
  });

  if (isPublicRoute) {
    return children;
  }

  if (!isAuthenticated||!(Number(user?.roleId))||(Number(user?.roleId))==null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Define allowed routes for each role
  const rolePermissions = {
    1: ['/', '/sites', '/add-site', '/site/*', '/editsite/*', '/stations', 
        '/add-stations', '/stations/*', '/whitelabels', '/whitelabels/*',
        '/franchiseOwners', '/franchiseOwners/*', '/evusers', '/evusers/*',
        '/profiles/*', '/rfid', '/issues-tracker', '/issues/*', '/reports',
        '/adminProfile', '/ocpp', '/manufacturers', '/manufacturers/*',
        '/addcharger/*', '/referral-codes', '/referral-codes/*', '/loading',
        '/customer-support','/customer-support/:id','/customer-support/*',
        '/1loading1','/charger-installation-team','/charger-installation-team/add',
        '/charger-installation-team/edit/:id','/charger-installation-team/*',
        '/fleetManagement','/fleet/add','/fleet/revenue','/fleet/*',
        '/vehicle/add','/vehicle/*','/technician-dashboard','/technician-dashboard/:id','/FranchiseRequests'],
    3: ['/', '/sites', '/add-site', '/site/*', '/editsite/*', '/stations',
        '/add-stations', '/stations/*',
        '/franchiseOwners', '/franchiseOwners/*', '/evusers', '/evusers/*',
        '/profiles/*', '/rfid', '/issues-tracker', '/issues/*', '/reports',
        '/adminProfile', '/ocpp', 
        '/addcharger/*', '/referral-codes', '/referral-codes/*', '/loading',
        '/1loading1'],
    4: ['/', '/sites', '/add-site', '/site/*', '/editsite/*', '/stations',
        '/add-stations', '/stations/*','/issues-tracker', '/issues/*', '/reports',
        '/adminProfile', '/loading','/1loading1'],
    6: (() => {
    const designation = user?.designation?.toLowerCase();
    if (designation?.includes("customer support")) {
return [
  '/employee-profile',
    '/customer-support/tasks',
    '/customer-support/tasks/:id',
    '/customer-support/tasks*',
        '/customer-support/solved' // <-- Add this

  ];    }
    if (designation?.includes("charger installer")) {
      return ['/technician-dashboard','/technician-profile','completed-tasks','/technician/tasks/*',];
    }
    return [];
  }
)() 
  };

  // Check if current route is allowed for user's role
  const isAllowed = rolePermissions[roleId]?.some(route => {
    if (route.endsWith('*')) {
      return location.pathname.startsWith(route.slice(0, -1));
    }
    return location.pathname === route;
  });

  if (!isAllowed) {
    return <Navigate to='/*' replace />;
  }

  return children;
}