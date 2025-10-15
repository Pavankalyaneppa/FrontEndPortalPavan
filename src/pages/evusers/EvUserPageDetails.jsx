import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { InfoIcon,PencilIcon,Trash } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  validateName,
  validateMobileNumber,
  // validatePassword,
  // validateConfirmPassword,
  validateCity,
  validateZipCode,
  validateEmail,
  validateConnectorType,
  validateMake,
  validateModel,
  validateVIN,
  validateUsername,
  validateVehicleType,
  validateRegistrationNo,
   validateForm as validateFormHelper,
   validateEditForm as validateEditFormHelper
} from '@/pages/validations/Validation';
import Loading from '@/users/Loading';
import BackButton from '@/users/BackButton';
import StatusButton from '@/users/StatusButton';
import { ReloadIcon } from '@radix-ui/react-icons';
import DeleteOtp from '@/users/DeleteOtp';
import AxiosServices, { getVehicles } from '@/services/AxiosServices';
import { useSelector } from 'react-redux';
const MAX_RFID_REQUESTS = 5;

const EvUserPageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [rfidRequests, setRfidRequests] = useState([]);
  const [isRfidDialogOpen, setIsRfidDialogOpen] = useState(false);
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const[isSubmitting,setIsSubmitting]=useState(false);
  const [vehicleList, setVehicleList] = useState([]);
  
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const[isEditVehicleDialogOpen,setIsEditVehicleDialogOpen]=useState(false);
  const[isAddVehicleDialogOpen,setIsAddVehicleDialogOpen]=useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vechileId,setVechileId]= useState(null);
  const [editFormErrors, setEditFormErrors] = useState({});
  console.log(currentUser);
 const { user } = useSelector(state => state.authentication);
  console.log("user",user.orgId);
  const [formErrors, setFormErrors] = useState({});

 const [editFormData, setEditFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    mobileNumber: "",
    rolename: "Driver",
    // password: "",
    // confirmPassword: "",
    address: "",
    city: "",
    country: "",
    state: "",
    zipCode: "",
    // passwordChange: false,
    connectorType:"",
    model:"",
    vin:"",
    registrationNo:"",
    make:"",
    vehicleType:"", 
  });

  useEffect(() => {
  const errors = {};

  const fullNameError = validateName(editFormData.fullname);
  if (fullNameError) errors.fullname = fullNameError;

  const usernameError = validateUsername(editFormData.username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(editFormData.email);
  if (emailError) errors.email = emailError;

  const mobileError = validateMobileNumber(editFormData.mobileNumber);
  if (mobileError) errors.mobileNumber = mobileError;

  const zipError = validateZipCode(editFormData.zipCode);
  if (zipError) errors.zipCode = zipError;

  const cityError = validateCity(editFormData.city);
  if (cityError) errors.city = cityError;

  const connectorTypeError = validateConnectorType(editFormData.connectorType);
  if (connectorTypeError) errors.connectorType = connectorTypeError;

  const makeError = validateMake(editFormData.make);
  if (makeError) errors.make = makeError;

  const modelError = validateModel(editFormData.model);
  if (modelError) errors.model = modelError;

  const vinError = validateVIN(editFormData.vin);
  if (vinError) errors.vin = vinError;

  const vehicleTypeError = validateVehicleType(editFormData.vehicleType);
  if (vehicleTypeError) errors.vehicleType = vehicleTypeError;

  const registrationNoError = validateRegistrationNo(editFormData.registrationNo);
  if (registrationNoError) errors.registrationNo = registrationNoError;

  setFormErrors(errors);
}, [editFormData]);

 const [vehicleFormData, setVehicleFormData] = useState({
  connectorType: "",
  description: "",
  vin: "",
  registrationNo: "",
  model: "",
  year: "",  // Changed from Year to year (lowercase)
  make: "",   // Added make field
  vehicleType: "", // Changed from vechileType to vehicleType
});


  useEffect(() => {
  const errors = {};
  const connectorTypeError = validateConnectorType(vehicleFormData.connectorType);
  if (connectorTypeError) errors.connectorType = connectorTypeError;

  const makeError = validateMake(vehicleFormData.make);
  if (makeError) errors.make = makeError;

  const modelError = validateModel(vehicleFormData.model);
  if (modelError) errors.model = modelError;

  const vinError = validateVIN(vehicleFormData.vin);
  if (vinError) errors.vin = vinError;

  const vehicleTypeError = validateVehicleType(vehicleFormData.vehicleType);
  if (vehicleTypeError) errors.vehicleType = vehicleTypeError;

  const registrationNoError = validateRegistrationNo(vehicleFormData.registrationNo);
  if (registrationNoError) errors.registrationNo = registrationNoError;

  setFormErrors(errors);
}, [vehicleFormData]);

  const [vehicleFormErrors, setVehicleFormErrors] = useState({
    connectorType: "",
    description: "",
    vin: "",
    registrationNo: "",
    model: "",
   Year: "",
    make: "", 
    type: ""
  });
// rfid section

 const [addressParts, setAddressParts] = useState({
  street: "",
  city: "",
  state: '',
  country: currentUser?.country||'',
  zipCode: currentUser?.zipCode,
});
const [newRfid, setNewRfid] = useState({
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  status: 'Pending',
  rfidCount: 1,
  userId: id,
  address: '',
  orgId:user.orgId,
});

  const handleRfidInputChange = (e) => {
    const { name, value } = e.target;
    setNewRfid(prev => ({
      ...prev,
      [name]: value
    }));
  };
   const handleRequestRfid = async () => {
    try {
       setIsSubmitting(true); // Add this line
      if (rfidRequests.length >= MAX_RFID_REQUESTS) {
        toast({
          title: "Limit Reached",
          description: `Maximum ${MAX_RFID_REQUESTS} RFID cards allowed per user.`,
          variant: "destructive",
        });
        setIsRfidDialogOpen(false);
        return;
      }
      const response = await AxiosServices.requestRfid(newRfid,id);
      console.log(response);
      console.log("newRfid",newRfid);
      toast({
        title: "Success",
        description: "RFID request submitted successfully!",
      });
      
      setIsRfidDialogOpen(false);
      fetchRfidRequests(id);
      setNewRfid({
        firstName:currentUser?.fullname ,
        lastName: '',
        email: currentUser?.email ,
        mobile: currentUser?.mobileNumber ,
        status: 'Pending',
        rfidCount: 1,
        userId: id,
         orgId:user.orgId,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data || "Failed to submit RFID request",
        variant: "destructive",
      });
    }
     finally {
    setIsSubmitting(false); // Add this line
  }
  };

  const handleRfidStatusChange = async (rfidId, newStatus) => {
    try {
      await AxiosServices.updateRfidStatus(rfidId);

      toast({
        title: "Success",
        description: `RFID status updated to ${newStatus}`,
      });

      fetchRfidRequests(id);
    } catch (error) {
      console.error('Error updating RFID status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update RFID status",
        variant: "destructive",
      });
    }
  };

const handleDelete = async (id) => {
  try {
    const response = await AxiosServices.deleteRfid(id);
    console.log(response);

    if (response.status === 200 || response.status === 204) {
      toast({
        title: "Success",
        description: "RFID request deleted successfully!",
      });

     AxiosServices.getRfidRequests(id);
    } else {
      toast({
        title: "Error",
        description: `Failed to delete RFID. Server responded with status: ${response.status}`,
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error('Error deleting RFID:', error);
    toast({
      title: "Error",
      description: error.response?.data?.message || "Something went wrong while deleting the RFID request.",
      variant: "destructive",
    });
  }
};

  // const fetchUserVehicles = async () => {
  //   const response = await axios.get(`http://localhost:8800/api/mobile/myEV/${id}`);
  //   return response.data;
  // };

  // const fetchVehicles = async () => {
  //   try {
  //     setLoadingVehicles(true);
  //     const data = await getVehicles(id);
  //     console.log("Vehicle Data from Backend:", data);
  //     setVehicleList(data);
  //   } catch (error) {
  //     console.error("Error fetching vehicles:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to load vehicle details",
  //       variant: "destructive"
  //     });
  //   } finally {
  //     setLoadingVehicles(false);
  //   }
  // };

 const fetchVehicles = async () => {
  try {
    setLoadingVehicles(true);
    const response = await getVehicles(id);
    console.log("Vehicle Data from Backend:", response);

    // ✅ Use only the array part
    setVehicleList(response?.data || []);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    toast({
      title: "Error",
      description: "Failed to load vehicle details",
      variant: "destructive"
    });
  } finally {
    setLoadingVehicles(false);
  }
};

  useEffect(() => {
    if (id) {
      fetchVehicles(id);
    }
  }, [id]);

  // Fetch user details from API
  const fetchUserDetails = async (userId) => {
    try {
      // const userResponse = await axios.get(`http://localhost:8800/services/userprofile/userDetails/${userId}`);
      const userResponse = await AxiosServices.getUserDetails(userId);
      return userResponse;
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: "Error",
        description: `Failed to fetch user details: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleInfoClick = (vehicle) => {
  setVehicleFormData({
    connectorType: vehicle.connectorType || "",
    description: vehicle.description || "",
    vin: vehicle.vin || "",
    registrationNo: vehicle.registrationNo || "",
    model: vehicle.model || "",
    year: vehicle.year || "",
    make: vehicle.make || "",
    vehicleType: vehicle.vehicleType || ""
  });
  setIsEditVehicleDialogOpen(true);
};

  // Fetch RFID requests from API
  // const fetchRfidRequests = async (userId) => {
  //   try {
  //     // const response = await axios.get(`http://localhost:8800/services/rfid/userRequests/${userId}`);
  //     const response= await AxiosServices.getRfidRequests(userId);
  //     setRfidRequests(response.data);
  //     console.log(response.data);
  //   } catch (error) {
  //     // console.error('Error fetching RFID requests:', error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to fetch RFID requests",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const fetchRfidRequests = async (userId) => {
  try {
    const response = await AxiosServices.getRfidRequests(userId);
    // Check if response exists and has data
    if (response && response.data) {
      setRfidRequests(response.data);
    } else {
      setRfidRequests([]); // Set empty array if no data
    }
  } catch (error) {
    console.error('Error fetching RFID requests:', error);
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to fetch RFID requests",
      variant: "destructive",
    });
    setRfidRequests([]); // Set empty array on error
  }
};

  // Load user details and RFID requests on component mount
  useEffect(() => {
    const loadDetails = async () => {
      
      try {
        setLoading(true);
        const details = await fetchUserDetails(id);
                  if (details) {
              setCurrentUser(details);

              setNewRfid((prev) => ({
                ...prev,
                firstName: details.fullname || '',
                email: details.email || '',
                mobile: details.mobileNumber || '',
                userId: id,
              }));

              setAddressParts({
                street: details.address?.[0]?.address || '',
                city: details.address?.[0]?.city || '',
                state: details.address?.[0]?.state || '',
                country: details.address?.[0]?.country || '',
                zipCode: details.address?.[0]?.zipCode || '',
              });
            }

          fetchRfidRequests(id);
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to load user details", error);
        toast({
          title: "Error",
          description: "Could not fetch user details.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

 const handleEditInputChange = (e) => {
    const { name, value } = e.target;
   {
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }));
  if (name in editFormData.vehicle) {
      setEditFormData(prev => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          [name]: value
        }
      }));
      setEditFormErrors(prev => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          [name]: validateRequiredField(value, name)
        }
      }));
    } 
  }
  };
  const handleAddressCheckboxChange = (checked) => {
    setUseDefaultAddress(checked);
    setNewRfid(prev => ({
      ...prev,
      useDefaultAddress: checked,
      address: checked && currentUser?.address?.length > 0 ? currentUser.address[0] : prev.address
    }));
  };
// rfid related code

  const handleAddressFieldChange = (e) => {
    const { name, value } = e.target;
    setNewRfid(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };
  useEffect(() => {
  const fullAddress = `${addressParts.street}, ${addressParts.city}, ${addressParts.state}, ${addressParts.country} - ${addressParts.zipCode}`;
  setNewRfid((prev) => ({
    ...prev,
    address: fullAddress,
  }));
}, [addressParts]);
const handleAddressPartsChange = (e) => {
  const { name, value } = e.target;
  setAddressParts((prev) => ({
    ...prev,
    [name]: value,
  }));
};


  const handleEditUser = () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "User data is not loaded yet.",
        variant: "destructive",
      });
      return;
    }

    setEditFormData({
      fullname: currentUser.fullname,
      username: currentUser.username,
      email: currentUser.email,
      mobileNumber: currentUser.mobileNumber,
      address: currentUser.address && currentUser.address.length > 0 ? currentUser.address[0].address : "",
      city: currentUser.address && currentUser.address.length > 0 ? currentUser.address[0].city : "",
      country: currentUser.address && currentUser.address.length > 0 ? currentUser.address[0].country : "",
      state: currentUser.address && currentUser.address.length > 0 ? currentUser.address[0].state : "",
      zipCode: currentUser.address && currentUser.address.length > 0 ? currentUser.address[0].zipCode : "",
      // password: "",
      // confirmPassword: ""
    });

    setEditMode(true);
  };

 const handleVehicleInputChange = (e) => {
  const { name, value } = e.target;
  setVehicleFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
const handleAddVehicle = async (e) => {
  e.preventDefault();

  // Validate all fields using your validation functions
  const newErrors = {
    connectorType: validateConnectorType(vehicleFormData.connectorType),
    model: validateModel(vehicleFormData.model),
    vin: validateVIN(vehicleFormData.vin),
    registrationNo: validateRegistrationNo(vehicleFormData.registrationNo),
    make: validateMake(vehicleFormData.make),
    vehicleType: validateVehicleType(vehicleFormData.vehicleType),
    year: vehicleFormData.year ? "" : "Year is required" // Basic required check for year
  };

  // Check if any errors exist

  // Update the errors state
  setVehicleFormErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(error => error !== "");

  if (hasErrors) {
    toast({
      title: "Validation Error",
      description: "Please fix the errors in the form",
      variant: "destructive",
    });
    return;
  }

  try {
    setIsSubmitting(true);
    
    const response = await AxiosServices.addVehicle({
      ...vehicleFormData,
      userId: id
    });

    if (response.status === 201 || response.status === 200) {
      toast({
        title: "Success",
        description: "Vehicle added successfully!",
      });
      setIsAddVehicleDialogOpen(false);
      fetchVehicles();
      
      // Reset form
      setVehicleFormData({
        connectorType: "",
        description: "",
        vin: "",
        registrationNo: "",
        model: "",
        year: "",
        make: "",
        vehicleType: ""
      });
    }
  } catch (error) {
    console.error('Error adding vehicle:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to add vehicle. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};
const handleUpdateVehicle = async (e) => {
  e.preventDefault();

  const newErrors = {
    connectorType: validateConnectorType(vehicleFormData.connectorType),
    model: validateModel(vehicleFormData.model),
    vin: validateVIN(vehicleFormData.vin),
    registrationNo: validateRegistrationNo(vehicleFormData.registrationNo),
    make: validateMake(vehicleFormData.make),
    vehicleType: validateVehicleType(vehicleFormData.vehicleType),
    year: vehicleFormData.year ? "" : "Year is required"
  };

  setVehicleFormErrors(newErrors);

  const hasErrors = Object.values(newErrors).some(error => error !== "");
  if (hasErrors) {
    toast({
      title: "Validation Error",
      description: "Please fix the errors in the form",
      variant: "destructive",
    });
    return;
  }

  try {
    setIsSubmitting(true);
    const response = await AxiosServices.updateVehicle(vechileId
      , vehicleFormData);
    
    if (response.status === 200) {
      toast({
        title: "Success",
        description: 'Vehicle updated successfully',
      });
      setIsEditVehicleDialogOpen(false);
      fetchVehicles(); // Refresh the vehicle list
    } else {
      throw new Error(response.data.message || 'Update failed');
    }
  } catch (error) {
    console.error('Update failed:', error);
    toast({
      title: "Error",
      description: error.message || 'Vehicle update failed',
      variant: "destructive"
    });
  } finally {
    setIsSubmitting(false);
  }

};
const handleVehicleInputBlur = (e) => {
  const { name, value } = e.target;
  setVehicleFormErrors(prev => ({
    ...prev,
    [name]: error
  }));
};
const handleUpdateUser = async (e) => {
  e.preventDefault();
  
  // Validate form data
  const newErrors = {
    fullname: validateName(editFormData.fullname),
    mobileNumber: validateMobileNumber(editFormData.mobileNumber),
    city: validateCity(editFormData.city),
    zipCode: validateZipCode(editFormData.zipCode)
  };

  setEditFormErrors(newErrors);

  // Check if any errors exist
  const hasErrors = Object.values(newErrors).some(error => error !== "");
  
  if (hasErrors) {
    toast({
      title: "Validation Error",
      description: "Please fix the errors in the form",
      variant: "destructive",
    });
    return;
  }

  try {
    setIsSubmitting(true);
    
    const updateData = {
      fullname: editFormData.fullname,
      mobileNumber: editFormData.mobileNumber,
      address: [
        editFormData.address,
        editFormData.city,
        editFormData.state,
        editFormData.country,
        editFormData.zipCode
      ].filter(Boolean).join(', ')
    };

    const response = await AxiosServices.updateUserProfile(id, updateData);
    console.log("Update response:", response);

    toast({
      title: "Success",
      description: "User updated successfully",
    });

    // Refresh user data
    const details = await fetchUserDetails(id);
    if (details) {
      setCurrentUser(details);
      setNewRfid(prev => ({
        ...prev,
        email: details.email,
        mobile: details.mobileNumber,
        address: details.address && details.address.length > 0 ? 
          `${details.address[0].address}, ${details.address[0].city}, ${details.address[0].state}, ${details.address[0].country} - ${details.address[0].zipCode}` : 
          ''
      }));
    }

    setEditMode(false);
  } catch (error) {
    console.error("Full error details:", error);
    console.error("Response data:", error.response?.data);
    
    toast({
      title: "Error",
      description: error.response?.data?.message || 
                 "Failed to update user. Please check the data and try again.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  if (loading) {
    return <div className="p-6"><Loading/></div>;
  }

  if (!currentUser) {
    return <div className="p-6">User not found</div>;
  }

  if (editMode) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit EV User</h1>
          <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
        </div>

        <Card className="p-6">
          <form onSubmit={handleUpdateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-fullname">Full Name</Label>
                  <Input 
                    id="edit-fullname" 
                    name="fullname" 
                    value={editFormData.fullname} 
                    onChange={handleEditInputChange}
                  />
                {formErrors.fullname && (  <p className="text-xs text-red-500 mt-1">{formErrors.fullname}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username</Label>
                  <Input 
                    id="edit-username" 
                    name="username" 
                    value={editFormData.username} 
                    onChange={handleEditInputChange} 
                    disabled 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input 
                    id="edit-email" 
                    name="email" 
                    type="email" 
                    value={editFormData.email} 
                    onChange={handleEditInputChange} 
                    disabled 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-mobileNumber">Mobile Number</Label>
                  <Input 
                    id="edit-mobileNumber" 
                    name="mobileNumber" 
                    value={editFormData.mobileNumber} 
                    onChange={handleEditInputChange}
                  />
                {formErrors.mobileNumber && (  <p className="text-xs text-red-500 mt-1">{formErrors.mobileNumber}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input 
                    id="edit-address" 
                    name="address" 
                    value={editFormData.address} 
                    onChange={handleEditInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input 
                    id="edit-city" 
                    name="city" 
                    value={editFormData.city} 
                    onChange={handleEditInputChange} 
                  />
                {formErrors.city && (  <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-state">State</Label>
                  <Input 
                    id="edit-state" 
                    name="state" 
                    value={editFormData.state} 
                    onChange={handleEditInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-country">Country</Label>
                  <Input 
                    id="edit-country" 
                    name="country" 
                    value={editFormData.country} 
                    onChange={handleEditInputChange} 
                  />
                </div>
               <div className="space-y-2">
                  <Label htmlFor="edit-zipCode">Zip Code</Label>
                  <Input 
                    id="edit-zipCode" 
                    name="zipCode" 
                    value={editFormData.zipCode} 
                    onChange={handleEditInputChange}
                  />
                {formErrors.zipCode && (  <p className="text-xs text-red-500 mt-1">{formErrors.zipCode}</p>)}
                </div>
              </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting?(
                  <>
                  <ReloadIcon className='mr-2 h-4 w-4 animate-spin'/>
                  Updating..
                  </>
                ):(
                  'Update'
                )}
                </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
         <div className="flex justify-between items-center mb-6">
                <div><h1 className="text-2xl font-bold">{currentUser.fullname}</h1></div>
                <StatusButton status={currentUser.enabled?"Active":"In Active"}/>
                </div>
        <div className="flex gap-2">
         <BackButton/>
        </div>
      </div>

{/* //details of single ev user */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="details">User Details</TabsTrigger>
           <TabsTrigger value="vehicles">Vehicles</TabsTrigger>

          <TabsTrigger value="rfid">RFID</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div>
             <div className="flex justify-between items-center mb-6">
              <div>
            <h2 className="text-xl font-semibold mb-4 pt-4">Personal Information</h2></div>
            <Button onClick={handleEditUser}>Edit</Button></div>
            <div>
              <Card className="p-6 mb-6">
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div>
                    <p className="font-semibold text-gray-600">Full Name</p>
                    <p className="font-medium">{currentUser.fullname}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Username</p>
                    <p className="font-medium">{currentUser.username || '-'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Email</p>
                    <p className="font-medium">{currentUser.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600 mt-4">Mobile Number</p>
                    <p className="font-medium">{currentUser.mobileNumber}</p>
                  </div>
                </div>
              </Card>
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">Address Information</h2>
            {currentUser.address && currentUser.address.length > 0 ? (
              <div>
                <Card className="p-6 mb-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold text-gray-600">Address</p>
                      <p className="font-medium">{currentUser.address[0].address}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600">City</p>
                      <p className="font-medium">{currentUser.address[0].city}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600">State</p>
                      <p className="font-medium">{currentUser.address[0].state}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mt-4">Country</p>
                      <p className="font-medium">{currentUser.address[0].country}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mt-4">Zip Code</p>
                      <p className="font-medium">{currentUser.address[0].zipCode}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <p>No address information available</p>
            )}
          </div>
        </TabsContent>
<TabsContent value="vehicles">
          <div className="bg-white rounded-lg shadow p-6 mt-4">
             <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold">Vehicle Details</h2>
    <Button onClick={()=>setIsAddVehicleDialogOpen(true)}>Add Vehicle</Button>
</div>
            
            {loadingVehicles ? (
              <p>Loading vehicles...</p>
            ) : vehicleList.length > 0 ? (
              <Table className="border">
                <TableHeader>
                  <TableRow>
                    <TableHead>ConnectorType</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>VIN</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicleList.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>{vehicle.connectorType}</TableCell>
                      <TableCell>{vehicle.model}</TableCell>
                      <TableCell>{vehicle.description}</TableCell>
                      <TableCell>{vehicle.vin}</TableCell>
                      <TableCell>{vehicle.registrationNo}</TableCell>

                      <TableCell className="text-right">
                                          <div className="flex justify-end gap-2">
                                           
                                            <Button 
                                              key={vehicle.vin}
                                              variant="ghost" 
                                              size="icon" 
                                              onClick={() =>{ handleInfoClick(vehicle), setVechileId(vehicle.id);}}
                                            >
                                              <PencilIcon className="h-4 w-4" />
                                            </Button>

                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              onClick={() => {
                                                setVechileId(vehicle.id);
                                                setIsDeleteDialogOpen(true);
                                              }}
                                            >
                                              <Trash className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No vehicles found for this user.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="rfid">
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">RFID Information</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {Array.isArray(rfidRequests) ? rfidRequests.filter(r => !r.rfId).length : 0} / {MAX_RFID_REQUESTS} cards requested
                </span>
                <Button
                  onClick={() => setIsRfidDialogOpen(true)}
                  disabled={Array.isArray(rfidRequests) && rfidRequests.length >= MAX_RFID_REQUESTS}
                >
                  Request RFID
                </Button>
              </div>
            </div>
            {Array.isArray(rfidRequests) && rfidRequests.length >= MAX_RFID_REQUESTS && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800">
                  This user has reached the maximum limit of {MAX_RFID_REQUESTS} RFID cards.
                </p>
              </div>
            )}
    {/* === First Table: Issued RFIDs === */}
    <h3 className="text-lg font-semibold mt-4 mb-2">RFIDs</h3>
    <Table className="border mb-8">
      <TableHeader>
        <TableRow>
          <TableHead>RFID ID</TableHead>
          <TableHead>RFID Hex</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Expiry</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(rfidRequests) && rfidRequests.filter(item => item?.rfId  && item?.expiryDate).length > 0 ? (
          rfidRequests
            .filter(item => item?.rfId && item?.expiryDate)
            .map((rfid, index) => (
              <TableRow key={index}>
                <TableCell>{rfid.rfId}</TableCell>
                <TableCell>{rfid.rfidHex}</TableCell>
                <TableCell>{rfid.phone}</TableCell>
                <TableCell>{rfid.expiryDate ? new Date(rfid.expiryDate).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    rfid.status === 'Active' ? 'bg-green-100 text-green-800' :
                    rfid.status !== 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {rfid.status || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {rfid.status === 'Inactive' ? (
                      <Button size="sm" onClick={() => handleRfidStatusChange(rfid.rfId, 'Active')}>
                        Activate
                      </Button>
                    ) : rfid.status === 'Active' ? (
                      <Button size="sm" onClick={() => handleRfidStatusChange(rfid.rfId, 'inactive')}>
                        Deactivate
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              No RFID cards found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>

    {/* === Second Table: RFID Requests === */}
    <h3 className="text-lg font-semibold mt-4 mb-2">RFID Requests</h3>
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(rfidRequests) && rfidRequests.filter(item => !item?.expiryDate).length > 0 ? (
          rfidRequests
            .filter(item => !item?.expiryDate)
            .map((rfid, index) => (
              <TableRow key={index}>
                <TableCell>{rfid.firstName || 'N/A'}</TableCell>
                <TableCell>{rfid.lastName }</TableCell>
                <TableCell>{rfid.email || 'N/A'}</TableCell>
                <TableCell>{rfid.mobile || 'N/A'}</TableCell>
                <TableCell>
                  {rfid.address ? `${rfid.address}, ${rfid.city || ''}, ${rfid.state || ''}, ${rfid.country || ''} - ${rfid.zipCode || ''}` : 'N/A'}
                </TableCell>
                <TableCell>{rfid.requestedBy || 'N/A'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    rfid.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    rfid.status !== 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {rfid.status || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleActivate(rfid)}>
                      <PencilIcon className="h-4 w-4 text-500" />
                    </Button> */}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(rfid.id)}>
                      <Trash className="h-4 w-4 text-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4">
              No RFID requests found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
</TabsContent>

        <TabsContent value="wallet">
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <h2 className="text-xl font-semibold mb-4">Wallet Details</h2>
            <p className="text-gray-600">Wallet details will be displayed here.</p>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <p className="text-gray-600">Transaction history will be shown here.</p>
          </div>
        </TabsContent>
      </Tabs>



{/* // to add ev vehicle dialogbox */}
      <Dialog open={isAddVehicleDialogOpen} onOpenChange={setIsAddVehicleDialogOpen}>
  <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Add New Vehicle</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleAddVehicle} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="connectorType">Connector Type *</Label>
          <Input
            id="connectorType"
            name="connectorType"
            value={vehicleFormData.connectorType}
            onChange={handleVehicleInputChange}
            required
          />
                {formErrors.connectorType && (  <p className="text-xs text-red-500 mt-1">{formErrors.connectorType}</p>)}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            name="model"
            value={vehicleFormData.model}
            onChange={handleVehicleInputChange}
            required
          />
                {formErrors.model && (  <p className="text-xs text-red-500 mt-1">{formErrors.model}</p>)}
        </div>        
        <div className="space-y-2">
          <Label htmlFor="vin">VIN *</Label>
          <Input
            id="vin"
            name="vin"
            value={vehicleFormData.vin}
            onChange={handleVehicleInputChange}
            required
          />
                {formErrors.vin && (  <p className="text-xs text-red-500 mt-1">{formErrors.vin}</p>)}
        </div>
        <div className="space-y-2">
          <Label htmlFor="registrationNo">Registration No *</Label>
          <Input
            id="registrationNo"
            name="registrationNo"
            value={vehicleFormData.registrationNo}
            onChange={handleVehicleInputChange}
            required
          />
                {formErrors.registrationNo && (  <p className="text-xs text-red-500 mt-1">{formErrors.registrationNo}</p>)}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={vehicleFormData.year}
            onChange={handleVehicleInputChange}
            required
          />
        </div>        
        <div className="space-y-2">
          <Label htmlFor="make">Make *</Label>
          <Input
            id="make"
            name="make"
            value={vehicleFormData.make}
            onChange={handleVehicleInputChange}
            required
          />
                {formErrors.make && (  <p className="text-xs text-red-500 mt-1">{formErrors.make}</p>)}
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicleType">Vehicle Type *</Label>
          <Input
            id="vehicleType"
            name="vehicleType"
            value={vehicleFormData.vehicleType}
            onChange={handleVehicleInputChange}
            required
          />
                {formErrors.vehicleType && (  <p className="text-xs text-red-500 mt-1">{formErrors.vehicleType}</p>)}
        </div>        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={vehicleFormData.description}
            onChange={handleVehicleInputChange}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsAddVehicleDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

{/* // to edit ev vehicle dialogbox */}
      <Dialog open={isEditVehicleDialogOpen} onOpenChange={setIsEditVehicleDialogOpen}>
  <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Edit Vehicle</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleUpdateVehicle} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-connectorType">Connector Type *</Label>
          <Input
            id="edit-connectorType"
            name="connectorType"
            value={vehicleFormData.connectorType}
            onChange={handleVehicleInputChange}
            required
          />
                {formErrors.connectorType && (  <p className="text-xs text-red-500 mt-1">{formErrors.connectorType}</p>)}
        </div>        
        <div className="space-y-2">
          <Label htmlFor="edit-model">Model *</Label>
          <Input
            id="edit-model"
            name="model"
            value={vehicleFormData.model}
            onChange={handleVehicleInputChange}
            required
          />
                {formErrors.model && (  <p className="text-xs text-red-500 mt-1">{formErrors.model}</p>)}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="edit-vin">VIN *</Label>
          <Input
            id="edit-vin"
            name="vin"
            value={vehicleFormData.vin}
            onChange={handleVehicleInputChange}
            required
          />
                {formErrors.vin && (  <p className="text-xs text-red-500 mt-1">{formErrors.vin}</p>)}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="edit-registrationNo">Registration No *</Label>
          <Input
            id="edit-registrationNo"
            name="registrationNo"
            value={vehicleFormData.registrationNo}
            onChange={handleVehicleInputChange}
            required
          />
                {formErrors.registrationNo && (  <p className="text-xs text-red-500 mt-1">{formErrors.registrationNo}</p>)}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="edit-year">Year *</Label>
          <Input
            id="edit-year"
            name="year"
            type="number"
            value={vehicleFormData.year}
            onChange={handleVehicleInputChange}
            required
          />
        </div>        
        <div className="space-y-2">
          <Label htmlFor="edit-make">Make *</Label>
          <Input
            id="edit-make"
            name="make"
            value={vehicleFormData.make}
            onChange={handleVehicleInputChange}
            required
          />
                {formErrors.make && (  <p className="text-xs text-red-500 mt-1">{formErrors.make}</p>)}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="edit-vehicleType">Vehicle Type *</Label>
          <Input
            id="edit-vehicleType"
            name="vehicleType"
            value={vehicleFormData.vehicleType}
            onChange={handleVehicleInputChange}
            required
          />
                {formErrors.vehicleType && (  <p className="text-xs text-red-500 mt-1">{formErrors.vehicleType}</p>)}
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="edit-description">Description</Label>
          <Input
            id="edit-description"
            name="description"
            value={vehicleFormData.description}
            onChange={handleVehicleInputChange}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsEditVehicleDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : 'Update'}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

   
{/* RFID Request Dialog */}
<Dialog open={isRfidDialogOpen} onOpenChange={setIsRfidDialogOpen}>
  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Request New RFID</DialogTitle>
      <DialogDescription>
        Fill in the details to request a new RFID card for this user.
        {rfidRequests.length >= MAX_RFID_REQUESTS && (
          <span className="block mt-2 text-red-600">
            Maximum {MAX_RFID_REQUESTS} RFID cards allowed per user.
          </span>
        )}
      </DialogDescription>
    </DialogHeader>

    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={newRfid.firstName}
            onChange={handleRfidInputChange}
            placeholder="Enter first name"
            required
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={newRfid.lastName}
            onChange={handleRfidInputChange}
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={newRfid.email  }
            onChange={handleRfidInputChange}
            placeholder="User's email"
            required
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Phone *</Label>
          <Input
            id="mobile"
            name="mobile"
            value={newRfid.mobile }
            onChange={handleRfidInputChange}
            placeholder="User's phone number"
            required
           readOnly
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useDefaultAddress"
            checked={useDefaultAddress}
            onCheckedChange={(checked) => {
              setUseDefaultAddress(checked);
              // When checkbox is checked, populate with user's address
              if (checked && currentUser?.address?.[0]) {
                setAddressParts({
                  street: currentUser.address[0].address,
                  city: currentUser.address[0].city ,
                  state: currentUser.address[0].state ,
                  country: currentUser.address[0].country || '',
                  zipCode: currentUser.address[0].zipCode 
                });
              } else {
                // When unchecked, clear the fields
                setAddressParts({
                  street: '',
                  city: '',
                  state: '',
                  country: '',
                  zipCode: ''
                });
              }
            }}
          />
          <Label htmlFor="useDefaultAddress">Use user's default address</Label>
        </div>
      </div>

        <div className="space-y-2">
          <Label>Address Details *</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                name="street"
                value={addressParts.street}
                onChange={handleAddressPartsChange}
                placeholder="Street address"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                name="city"
                value={addressParts.city}
                onChange={handleAddressPartsChange}
                placeholder="City"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                name="state"
                value={addressParts.state}
                onChange={handleAddressPartsChange}
                placeholder="State/Province"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                name="country"
                value={addressParts.country}
                onChange={handleAddressPartsChange}
                placeholder="Country"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                name="zipCode"
                value={addressParts.zipCode}
                onChange={handleAddressPartsChange}
                placeholder="Postal/Zip code"
                required
              />
              {formErrors.zipCode && (  <p className="text-xs text-red-500 mt-1">{formErrors.zipCode}</p>)}
            </div>
          </div>
        </div>
     

      <div className="space-y-2">
        <Label htmlFor="rfidCount">Number of RFID Cards *</Label>
        <Input
          id="rfidCount"
          name="rfidCount"
          type="number"
          min="1"
          max={MAX_RFID_REQUESTS - rfidRequests.length}
          value={newRfid.rfidCount}
          onChange={handleRfidInputChange}
          placeholder="Number of RFID cards required"
          required
        />
        <p className="text-sm text-muted-foreground">
          Maximum {MAX_RFID_REQUESTS - rfidRequests.length} cards can be requested
        </p>
      </div>
    </div>

    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setIsRfidDialogOpen(false);
          setNewRfid({
            firstName: currentUser?.fullname ,
            lastName: '',
            email: currentUser?.email ,
            mobile: currentUser?.mobileNumber ,
            status: 'Pending',
            rfidCount: 1,
            userId: id
          });
          setUseDefaultAddress(true);
        }}
      >
        Cancel
      </Button>
      <Button
        type="button"
        onClick={handleRequestRfid}
        disabled={rfidRequests.length >= MAX_RFID_REQUESTS || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : 'Submit Request'}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


       {isDeleteDialogOpen && currentUser&& (
        <DeleteOtp 
          userId={vechileId}
          onClose={() => {setIsDeleteDialogOpen(false),setVechileId(null)}}
          onDeleted={() => {
            // handleDeleteFranchiseOwner();
            setIsDeleteDialogOpen(false);
          }}
          role={"vehicle"}
        />)}
    </div>
  );
};

export default EvUserPageDetails;