import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; 
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicleDetails, resetFleetDetails, updateFleetVehicle } from '@/store/reducers/fleet/FleetSlice';
import { toast } from '@/components/ui/use-toast';
import BackButton from '@/components/ui/BackButton';
import { Card, CardContent } from "@/components/ui/card";
import Loading from '@/users/Loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const dispatch = useDispatch();
  const { currentVehicle, status, error } = useSelector((state) => state.fleet);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editForm, setEditForm] = useState({
    vehicleId: '',
    model: '',
    capacityKw: '',
    driver: '',
    location: '',
    batteryLeft: '',
    bookings: '',
    status: ''
  });

useEffect(() => {
  if (id) {
    dispatch(fetchVehicleDetails(String(id)));
  }

}, [dispatch, id]);


  useEffect(() => {
    if (currentVehicle) {
      setEditForm({
        vehicleId: currentVehicle.vehicleId || '',
        model: currentVehicle.model || '',
        capacityKw: currentVehicle.capacityKw || '',
        driver: currentVehicle.driver || '',
        location: currentVehicle.location || '',
        batteryLeft: currentVehicle.batteryLeft || '',
        bookings: currentVehicle.bookings || '',
        status: currentVehicle.status || ''
      });
    }
  }, [currentVehicle]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditVehicle = () => {
    setEditMode(true);
  };

const handleSave = async () => {
  try {
    setIsSubmitting(true);
    
    const vehicleId = String(currentVehicle.vehicleId);
    
    await dispatch(updateFleetVehicle({ 
      vehicleId: vehicleId, 
      vehicleData: editForm 
    })).unwrap();
    
    toast({
      title: "Success",
      description: "Vehicle details updated successfully",
    });
    
    setEditMode(false);
    
    // Refresh with string vehicleId
    dispatch(fetchVehicleDetails(vehicleId));
    
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to update vehicle details",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  const handleCancel = () => {
    if (currentVehicle) {
      setEditForm({
        vehicleId: currentVehicle.vehicleId || '',
        model: currentVehicle.model || '',
        capacityKw: currentVehicle.capacityKw || '',
        driver: currentVehicle.driver || '',
        location: currentVehicle.location || '',
        batteryLeft: currentVehicle.batteryLeft || '',
        bookings: currentVehicle.bookings || '',
        status: currentVehicle.status || ''
      });
    }
    setEditMode(false);
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'failed' || !currentVehicle) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Vehicle Not Found</h1>
        <BackButton />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicle Details - {currentVehicle.vehicleId}</h1>
        <div className="flex gap-2">
          <Button onClick={handleEditVehicle}>Edit Vehicle</Button>
          <BackButton />
        </div>
      </div>

      {editMode ? (
        // EDIT MODE - Two Column Layout
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Edit Vehicle</h1>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
          
          <Card className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Vehicle ID</Label>
                  <Input
                    id="vehicleId"
                    name="vehicleId"
                    value={editForm.vehicleId}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={editForm.model}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacityKw">Capacity (kW)</Label>
                  <Input
                    id="capacityKw"
                    name="capacityKw"
                    type="number"
                    value={editForm.capacityKw}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver">Driver</Label>
                  <Input
                    id="driver"
                    name="driver"
                    value={editForm.driver}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batteryLeft">Battery Left (%)</Label>
                  <Input
                    id="batteryLeft"
                    name="batteryLeft"
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.batteryLeft}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bookings">Bookings</Label>
                  <Input
                    id="bookings"
                    name="bookings"
                    value={editForm.bookings}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    name="status"
                    value={editForm.status}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      ) : (
        // VIEW MODE - Two Column Layout with Cards
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Vehicle Information</TabsTrigger>
            <TabsTrigger value="additional">Additional Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Vehicle Information</h2>
              </div>
              
              <Card className="p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-600">Vehicle ID</p>
                    <p className="font-medium">{currentVehicle.vehicleId || '-'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Model</p>
                    <p className="font-medium">{currentVehicle.model || '-'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600 mt-4">Capacity (kW)</p>
                    <p className="font-medium">{currentVehicle.capacityKw || '-'} kW</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600 mt-4">Driver</p>
                    <p className="font-medium">{currentVehicle.driver || '-'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600 mt-4">Location</p>
                    <p className="font-medium">{currentVehicle.location || '-'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600 mt-4">Battery Left</p>
                    <p className="font-medium">{currentVehicle.batteryLeft || '-'}%</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="additional">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Additional Information</h2>
              </div>
              
              <Card className="p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-600">Bookings</p>
                    <p className="font-medium">{currentVehicle.bookings || '-'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Status</p>
                    <p className="font-medium">
                      {currentVehicle.status ? (
                        <span className={`${
                          currentVehicle.status.toLowerCase() === 'active' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {currentVehicle.status}
                        </span>
                      ) : (
                        '-'
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default VehicleDetails;