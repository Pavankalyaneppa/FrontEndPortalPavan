import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchSiteDetails, updateSite } from '@/store/reducers/sites/sitesSlice';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { unwrapResult } from '@reduxjs/toolkit';
import Loading from '@/users/Loading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  validateSiteName,
  validateName,
  validateManagerEmail,
  validateManagerName,
  validateManagerPhone,
  validateLatitude,
  validateLongitude,
  validateTimezone,
  validateEmail,
} from '@/pages/validations/Validation';

export default function EditSite() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  const validateForm = () => {
    const newErrors = {
      siteName: validateSiteName(formData.siteName),
      managerName: validateManagerName(formData.managerName),
      managerEmail: validateManagerEmail(formData.managerEmail),
      managerPhone: validateManagerPhone(formData.managerPhone),
      address: formData.location.address.trim() ? '' : 'Address is required',
      latitude: validateLatitude(formData.location.latitude),
      longitude: validateLongitude(formData.location.longitude),
      timezone: validateTimezone(formData.operations.timezone),
      openingTime: formData.operations.openingTime ? '' : 'Opening time is required',
      closeTime: formData.operations.closeTime ? '' : 'Closing time is required'
    };

    setFormErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const { currentSite, siteDetailsStatus, siteDetailsError, updateSiteStatus } = useSelector((state) => state.sites);
  const [formErrors, setFormErrors] = useState({});
  const[update,setUpdate]=useState('');
  const [formData, setFormData] = useState({
    siteName: '',
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    location: {
      address: '',
      latitude: '',
      longitude: ''
    },
    operations: {
      openingTime: '',
      closeTime: '',
      timezone: '',
      siteStatus: true
    },
    facilities: {
      parking: false,
      wifi: false,
      food: false,
      restrooms: false
    }
  });

  useEffect(() => {
    const errors = {};
    const siteNameError = validateSiteName(formData.siteName);
    if (siteNameError) errors.siteName = siteNameError;
    
    const managerNameError = validateManagerName(formData.managerName);
    if (managerNameError) errors.managerName = managerNameError;

    const managerEmailError = validateManagerEmail(formData.managerEmail);
    if (managerEmailError) errors.managerEmail = managerEmailError;

    const managerPhoneError = validateManagerPhone(formData.managerPhone);
    if (managerPhoneError) errors.managerPhone = managerPhoneError;
    
    const latitudeError = validateLatitude(formData.location.latitude);
    if (latitudeError) errors.latitude = latitudeError;

    const longitudeError = validateLongitude(formData.location.longitude);
    if (longitudeError) errors.longitude = longitudeError;

    const timezoneError = validateTimezone(formData.operations.timezone);
    if (timezoneError) errors.timezone = timezoneError;

    setFormErrors(errors);
  }, [formData]);

  useEffect(() => {
    if (!id || isNaN(id)) {
      navigate('/sites');
      return;
    }
    dispatch(fetchSiteDetails(id));
  }, [dispatch, id, navigate]);

  useEffect(() => {
    if (currentSite) {
      setFormData({
        siteName: currentSite.siteName || '',
        managerName: currentSite.managerName || '',
        managerEmail: currentSite.managerEmail || '',
        managerPhone: currentSite.managerPhone || '',
        location: {
          address: currentSite.address || '',
          latitude: currentSite.latitude || '',
          longitude: currentSite.longitude || ''
        },
        operations: {
          openingTime: currentSite.openingTime || '',
          closeTime: currentSite.closeTime || '',
          timezone: currentSite.timezone || '',
          siteStatus: currentSite.siteStatus ?? true
        },
        facilities: {
          parking: currentSite.parking || false,
          wifi: currentSite.wifi || false,
          food: currentSite.food || false,
          restrooms: currentSite.restrooms || false
        }
      });
    }
  }, [currentSite]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, e) => {
    if (typeof e === 'string') {
      // Handle Select component case
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          timezone: e,
        },
      }));
    } else {
      // Handle regular input case
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    }
  };

  const handleCheckboxChange = (section, name, checked) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = validateForm();
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdate('loading');
      const updateData = {
        siteName: formData.siteName,
        managerName: formData.managerName,
        managerEmail: formData.managerEmail,
        managerPhone: formData.managerPhone,
        address: formData.location.address,
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
        openingTime: formData.operations.openingTime,
        closeTime: formData.operations.closeTime,
        timezone: formData.operations.timezone,
        siteStatus: formData.operations.siteStatus,
        parking: formData.facilities.parking,
        wifi: formData.facilities.wifi,
        food: formData.facilities.food,
        restrooms: formData.facilities.restrooms
      };

      await dispatch(updateSite(id, updateData));
      
      toast({
        title: "Success",
        description: "Site updated successfully",
        variant: "default",
      });
 setUpdate('');
      navigate(`/site/${id}`);
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update site",
        variant: "destructive",
      });
    }
  };

  if (siteDetailsStatus === 'loading') {
    return <div className="flex justify-center items-center h-64"><Loading /></div>;
  }

  if (siteDetailsStatus === 'failed') {
    return <div className="p-4 text-red-500">Error: {typeof siteDetailsError === 'string' ? siteDetailsError : 'An error occurred'}</div>;
  }

  if (!currentSite) {
    return <div className="p-4">No site data found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{currentSite.siteName}</h1>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium py-4">Site Information</h3>
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Manager Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="managerName">Name</Label>
                  <Input
                    id="managerName"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.managerName && <p className="text-xs text-red-500 mt-1">{formErrors.managerName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerEmail">Email</Label>
                  <Input
                    id="managerEmail"
                    name="managerEmail"
                    type="email"
                    value={formData.managerEmail}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.managerEmail && <p className="text-xs text-red-500 mt-1">{formErrors.managerEmail}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerPhone">Phone</Label>
                  <Input
                    id="managerPhone"
                    name="managerPhone"
                    type="tel"
                    value={formData.managerPhone}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.managerPhone && <p className="text-xs text-red-500 mt-1">{formErrors.managerPhone}</p>}
                </div>
              </div>
            </div>
            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Location</h3>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.location.address}
                  onChange={(e) => handleNestedChange('location', e)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.location.latitude}
                    onChange={(e) => handleNestedChange('location', e)}
                    required
                  />
                  {formErrors.latitude && <p className="text-xs text-red-500 mt-1">{formErrors.latitude}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.location.longitude}
                    onChange={(e) => handleNestedChange('location', e)}
                    required
                  />
                  {formErrors.longitude && <p className="text-xs text-red-500 mt-1">{formErrors.longitude}</p>}
                </div>
              </div>
            </div>
            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Operations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingTime">Opening Time</Label>
                  <Input
                    id="openingTime"
                    name="openingTime"
                    type="time"
                    value={formData.operations.openingTime}
                    onChange={(e) => handleNestedChange('operations', e)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeTime">Closing Time</Label>
                  <Input
                    id="closeTime"
                    name="closeTime"
                    type="time"
                    value={formData.operations.closeTime}
                    onChange={(e) => handleNestedChange('operations', e)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.operations.timezone}
                    onValueChange={(value) => handleNestedChange('operations', value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IST">IST (Indian Standard Time)</SelectItem>
                      <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                      <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                      <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.timezone && <p className="text-xs text-red-500 mt-1">{formErrors.timezone}</p>}
                </div>
              </div>
            </div>
            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Facilities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['parking', 'wifi', 'food', 'restrooms'].map((facility) => (
                  <div key={facility} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={facility}
                      checked={formData.facilities[facility]}
                      onChange={(e) => handleCheckboxChange('facilities', facility, e.target.checked)}
                    />
                    <Label htmlFor={facility} className="capitalize">{facility}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/site/${id}`)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateSiteStatus === 'loading'|| update=='loading'}
              >
                {updateSiteStatus === 'loading'|| update=='loading' ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}