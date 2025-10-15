import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '@/components/ui/use-toast';
import { ReloadIcon } from "@radix-ui/react-icons";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { addSite, fetchOwners, resetAddSiteStatus } from '@/store/reducers/sites/sitesSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Loading from '@/users/Loading';
import LocationPicker from './LocationPicker';
import { fetchSites } from '@/store/reducers/reports/reportsSlice';
import {
  validateSiteName,
  validateManagerEmail,
  validateManagerName,
  validateManagerPhone,
  validateLatitude,
  validateLongitude,
  validateEmail,
} from '@/pages/validations/Validation';

export default function AddSite() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { owners, ownersStatus, addSiteStatus } = useSelector(state => state.sites);
  const { user } = useSelector(state => state.authentication);
  const [showMap, setShowMap] = useState(false);
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { from, orgId, orgName, franchiseId } = location.state || {};
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({
    siteName: '',
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    latitude: '',
    longitude: ''
  });
  
  const [formData, setFormData] = useState({
    siteName: '',
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    ownerOrgId:from === 'franchise' ? orgId :  Number(user?.roleId) === 4 ? user?.orgId : '',
    address: '',
    latitude: '',
    longitude: '',
    parking: false,
    wifi: false,
    food: false,
    restrooms: false,
    openingTime: '09:00',
    closeTime: '18:00',
    siteStatus: 'Active',
    timezone: 'IST'
  });

  useEffect(() => {
    dispatch(fetchOwners());
  }, [dispatch]);

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
    
    const latitudeError = validateLatitude(formData.latitude);
    if (latitudeError) errors.latitude = latitudeError;

    const longitudeError = validateLongitude(formData.longitude);
    if (longitudeError) errors.longitude = longitudeError;

    setFormErrors(errors);
  }, [formData]);

  useEffect(() => {
    dispatch(fetchOwners());
  }, [dispatch]);

  //added this clean up
  useEffect(() => {
  return () => {
    dispatch(resetAddSiteStatus());
  };
}, [dispatch]);
  
  useEffect(() => {
    // If the site was successfully added, navigate back to the sites list
  if (addSiteStatus === 'succeeded') {
      if (from === 'franchise' && franchiseId && orgId && orgName) {
      navigate(`/franchiseOwners/${franchiseId}/${orgId}/${encodeURIComponent(orgName)}`, {
        replace: true
      });
    } else {
      navigate('/sites', { replace: true });
    }
    dispatch(fetchSites());
  }
  }, [addSiteStatus, navigate, dispatch, from, franchiseId, orgId, orgName]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  console.log(formData);
  // Validate all required fields
  const errors = {};
  
  // Required fields
  if (!formData.siteName.trim()) errors.siteName = 'Site name is required';
  if (!formData.managerName.trim()) errors.managerName = 'Manager name is required';
  if (!formData.managerEmail.trim()) errors.managerEmail = 'Manager email is required';
  if (!formData.managerPhone.trim()) errors.managerPhone = 'Manager phone is required';
  if (!formData.address.trim()) errors.address = 'Address is required';
  if (!formData.latitude.trim()) errors.latitude = 'Latitude is required';
  if (!formData.longitude.trim()) errors.longitude = 'Longitude is required';
  if (!formData.ownerOrgId) errors.ownerOrgId = 'Owner organization is required';

  // Field-specific validations
  const siteNameError = validateSiteName(formData.siteName);
  if (siteNameError) errors.siteName = siteNameError;
  
  const managerNameError = validateManagerName(formData.managerName);
  if (managerNameError) errors.managerName = managerNameError;

  const managerEmailError = validateManagerEmail(formData.managerEmail);
  if (managerEmailError) errors.managerEmail = managerEmailError;

  const managerPhoneError = validateManagerPhone(formData.managerPhone);
  if (managerPhoneError) errors.managerPhone = managerPhoneError;
  
  const latitudeError = validateLatitude(formData.latitude);
  if (latitudeError) errors.latitude = latitudeError;

  const longitudeError = validateLongitude(formData.longitude);
  if (longitudeError) errors.longitude = longitudeError;

  setFormErrors(errors);

  if (Object.keys(errors).length > 0) {
  toast({
    title: "Validation Error",
    description: Object.values(errors).filter(Boolean).join(", "),
    variant: "destructive",
  });
  return;
}
 
  try {
    setIsSubmitting(true);
     await dispatch(addSite(formData));
   
    toast({
      title: "Success",
      description: "Site added successfully!",
    });
  } catch (error)  {
    let errorMessage = "Failed to add site";
    
    // Check for unique constraint violation (site name already exists)
    if (error.response?.data.includes('ConstraintViolationException') || 
        error.response?.data.includes('could not execute statement')) {
      errorMessage = "Site name already exists. Please choose a different name.";
    } else if (error.response?.data) {
      errorMessage = error.response.data;
    }

    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

const handleCancel = () => {
    if (from === 'franchise' && franchiseId && orgId && orgName) {
      navigate(`/franchiseOwners/${franchiseId}/${orgId}/${encodeURIComponent(orgName)}`);
    } else {
      navigate('/sites');
    }
  };
  return (
    <div className="container mx-auto p-4">
     
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Site</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Site Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    placeholder="Enter site name"
                    value={formData.siteName}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.siteName && (  <p className="text-xs text-red-500 mt-1">{formErrors.siteName}</p>)}
                </div>
                <div className="space-y-2">
                  {(Number(user?.roleId)!=4)?(<Label htmlFor="ownerOrgId">Owner Organization</Label>):null}
                  {from === 'franchise' && orgId ? (
                    <Input
                      id="ownerOrgId"
                      value={orgName}
                      disabled
                    />
                  ) :(Number(user?.roleId)==4)?(<Input
                    type="hidden"
                    id="ownerOrgId"
                    name="ownerOrgId"
                    value={user?.orgId}
                    disabled
                    />): (
                    <Select
                      value={formData.ownerOrgId}
                      onValueChange={(value) => handleSelectChange('ownerOrgId', value)}
                    >
                      <SelectTrigger id="ownerOrgId">
                        <SelectValue placeholder="Select an owner" />
                      </SelectTrigger>
                      <SelectContent>
                        {ownersStatus === 'loading' ? (
                          <SelectItem value="loading" disabled><Loading/></SelectItem>
                        ) : owners?.map((owner) => (
                          <SelectItem key={owner.id} value={owner.id.toString()}>
                            {owner.orgName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Manager Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="managerName">Manager Name</Label>
                  <Input
                    id="managerName"
                    name="managerName"
                    placeholder="Enter manager name"
                    value={formData.managerName}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.managerName && (  <p className="text-xs text-red-500 mt-1">{formErrors.managerName}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerEmail">Manager Email</Label>
                  <Input
                    id="managerEmail"
                    name="managerEmail"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.managerEmail}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.managerEmail && (  <p className="text-xs text-red-500 mt-1">{formErrors.managerEmail}</p>)}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="managerPhone">Manager Phone</Label>
                <Input
                  id="managerPhone"
                  name="managerPhone"
                  placeholder="Enter phone number"
                  value={formData.managerPhone}
                  onChange={handleChange}
                  required
                />
                  {formErrors.managerPhone && (  <p className="text-xs text-red-500 mt-1">{formErrors.managerPhone}</p>)}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Location</h3>
              <Button type="button" onClick={() => setShowMap(!showMap)}>
                {showMap ? 'Hide Map' : 'Pick From Map'}
              </Button>
              {
                showMap && (
                  <LocationPicker
                    formData={formData}
                      setFormData={setFormData}
                  />
                )}
                
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    placeholder="Enter latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                  />
                    {formErrors.latitude && (  <p className="text-xs text-red-500 mt-1">{formErrors.latitude}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    placeholder="Enter longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                  />
                   {formErrors.longitude && (  <p className="text-xs text-red-500 mt-1">{formErrors.longitude}</p>)}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Facilities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parking"
                    checked={formData.parking}
                    onCheckedChange={(checked) => handleCheckboxChange('parking', checked)}
                  />
                  <Label htmlFor="parking">Parking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wifi"
                    checked={formData.wifi}
                    onCheckedChange={(checked) => handleCheckboxChange('wifi', checked)}
                  />
                  <Label htmlFor="wifi">WiFi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="food"
                    checked={formData.food}
                    onCheckedChange={(checked) => handleCheckboxChange('food', checked)}
                  />
                  <Label htmlFor="food">Food</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="restrooms"
                    checked={formData.restrooms}
                    onCheckedChange={(checked) => handleCheckboxChange('restrooms', checked)}
                  />
                  <Label htmlFor="restrooms">Restrooms</Label>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Operations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingTime">Opening Time</Label>
                  <Input
                    id="openingTime"
                    name="openingTime"
                    type="time"
                    value={formData.openingTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeTime">Closing Time</Label>
                  <Input
                    id="closeTime"
                    name="closeTime"
                    type="time"
                    value={formData.closeTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => handleSelectChange('timezone', value)}
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
              </div>
              <div className="flex items-center space-x-2">
               <Checkbox
                    id="siteStatus"
                    checked={formData.siteStatus === 'Active'}
                    onCheckedChange={(checked) => {
                      handleCheckboxChange('siteStatus', checked ? 'Active' : 'Inactive');
                    }}
                  />
                  <Label htmlFor="siteStatus">Site Active</Label>
              </div>
            </div>
         <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={addSiteStatus === 'loading'}
              >
                {addSiteStatus === 'loading' ? 'Saving...' : 'Save Site'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
