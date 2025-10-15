import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; 
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicleDetails, resetFleetDetails, updateVehicle } from '@/store/reducers/fleet/FleetSlice';
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
  const [activeTab, setActiveTab] = useState('details');
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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchVehicleDetails(id));
    }

    return () => {
      dispatch(resetFleetDetails());
    };
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

  const handleSave = () => {
    const numericId = currentVehicle.id || id;
    dispatch(updateVehicle({ id, ...editForm }))
      .unwrap()
      .then(() => {
        toast({
          title: "Success",
          description: "Vehicle details updated successfully",
        });
        setIsEditing(false);
        setActiveTab('details');
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to update vehicle details",
          variant: "destructive",
        });
      });
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
    setIsEditing(false);
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

  const fleet = location.state?.fleet; 

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicle Details - {currentVehicle.vehicleId}</h1>
        <BackButton />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="details">Vehicle Details</TabsTrigger>
          <TabsTrigger value="edit">Edit Details</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicle ID</p>
                    <p className="font-medium">{currentVehicle.vehicleId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Model</p>
                    <p className="font-medium">{currentVehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity (kW)</p>
                    <p className="font-medium">{currentVehicle.capacityKw} kW</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Driver</p>
                    <p className="font-medium">{currentVehicle.driver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{currentVehicle.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Battery Left</p>
                    <p className="font-medium">{currentVehicle.batteryLeft}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bookings</p>
                    <p className="font-medium">{currentVehicle.bookings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">{currentVehicle.status}</p>
                  </div>
                </div>
              
              </CardContent>
            </Card>

            {fleet && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Fleet Information</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Fleet ID</p>
                      <p className="font-medium">{fleet.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fleet Name</p>
                      <p className="font-medium">{fleet.fleetName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Owner Name</p>
                      <p className="font-medium">{fleet.ownerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Base Location</p>
                      <p className="font-medium">{fleet.baseLocation}</p>
                    </div>
                  
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Edit Vehicle Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Vehicle ID</Label>
                  <Input
                    id="vehicleId"
                    name="vehicleId"
                    value={editForm.vehicleId}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={editForm.model}
                    onChange={handleInputChange}
                    disabled={!isEditing}
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
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver">Driver</Label>
                  <Input
                    id="driver"
                    name="driver"
                    value={editForm.driver}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
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
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bookings">Bookings</Label>
                  <Input
                    id="bookings"
                    name="bookings"
                    value={editForm.bookings}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    name="status"
                    value={editForm.status}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <Button onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('details')}
                    >
                      Back to Details
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleDetails;
