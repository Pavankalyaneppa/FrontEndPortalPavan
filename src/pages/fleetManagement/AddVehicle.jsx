import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDispatch, useSelector } from 'react-redux';
import { addVehicleToFleet, resetVehicleStatus, fetchFleets } from '@/store/reducers/fleet/FleetSlice';
import { toast } from '@/components/ui/use-toast';
import BackButton from '@/components/ui/BackButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Loading from '@/users/Loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AddVehicle = () => {
  const { state } = useLocation();
  const { fleetId: paramFleetId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addVehicleStatus, addVehicleError, fleets } = useSelector((state) => state.fleet);
  const { user } = useSelector((state) => state.authentication);

  const initialFleetId = state?.fleetId || paramFleetId || '';

  const [formData, setFormData] = useState({
    vehicleId: '', 
    model: '', 
    capacityKw: '', 
    driver: '', 
    location: '', 
    batteryLeft: '', 
    bookings: '0', 
    status: 'ACTIVE', 
    fleetId: initialFleetId
  });

  const [errors, setErrors] = useState({});
  const [showFleetSelection, setShowFleetSelection] = useState(!initialFleetId);

  useEffect(() => {
    if (showFleetSelection && user?.orgId) {
      dispatch(fetchFleets({ orgId: user.orgId }));
    }
  }, [showFleetSelection, user?.orgId, dispatch]);

  useEffect(() => {
    if (addVehicleStatus === 'succeeded') {
      toast({
        title: 'Success',
        description: 'Vehicle added successfully!',
        variant: 'default',
      });
      navigate(`/fleet/${formData.fleetId}`);
      dispatch(resetVehicleStatus());
    }

    if (addVehicleStatus === 'failed') {
      toast({
        title: 'Error',
        description: addVehicleError || 'Failed to add vehicle',
        variant: 'destructive',
      });
    }
  }, [addVehicleStatus, addVehicleError, navigate, dispatch, formData.fleetId]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fleetId) {
      newErrors.fleetId = 'Fleet ID is required';
    }
    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Vehicle ID is required';
    }
    if (!formData.model) {
      newErrors.model = 'Model is required';
    }
    if (!formData.capacityKw || parseFloat(formData.capacityKw) <= 0) {
      newErrors.capacityKw = 'Valid capacity is required';
    }
    if (!formData.driver) {
      newErrors.driver = 'Driver is required';
    }
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    if (!formData.batteryLeft || 
        parseFloat(formData.batteryLeft) < 0 || 
        parseFloat(formData.batteryLeft) > 100) {
      newErrors.batteryLeft = 'Battery percentage must be between 0-100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFleetSelect = (fleetId) => {
    setFormData(prev => ({ ...prev, fleetId }));
    setShowFleetSelection(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const vehicleData = {
      vehicleId: formData.vehicleId,
      model: formData.model,
      capacityKw: parseFloat(formData.capacityKw),
      driver: formData.driver,
      location: formData.location,
      batteryLeft: parseFloat(formData.batteryLeft),
      bookings: parseInt(formData.bookings) || 0,
      status: formData.status,
    };
    
    dispatch(addVehicleToFleet({ 
      fleetId: formData.fleetId, 
      vehicleForm: vehicleData
    }));
  };
  

  if (showFleetSelection) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add New Vehicle</h1>
          <BackButton />
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Select a Fleet</CardTitle>
            <CardDescription>
              Choose which fleet to add this vehicle to
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(fleets) && fleets.length > 0 ? (
                <div className="grid gap-4">
                  {fleets.map(fleet => (
                    <Card 
                      key={fleet.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleFleetSelect(fleet.id)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{fleet.fleetName}</h3>
                        <p className="text-sm text-muted-foreground">
                          ID: {fleet.id} | Location: {fleet.baseLocation}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Owner: {fleet.ownerName} ({fleet.ownerEmail})
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    No fleets found. Please create a fleet first.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/fleet')}
                >
                  Back to Fleets
                </Button>
                <Button 
                  onClick={() => navigate('/fleet/add')}
                >
                  Create New Fleet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Vehicle</h1>
        <BackButton />
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
          <CardDescription>
            Add a new vehicle to fleet {formData.fleetId}
            <Button 
              variant="link" 
              className="ml-2"
              onClick={() => setShowFleetSelection(true)}
            >
              Change Fleet
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vehicleId">Vehicle ID *</Label>
                <Input 
                  id="vehicleId" 
                  name="vehicleId" 
                  value={formData.vehicleId} 
                  onChange={handleChange} 
                  className={errors.vehicleId ? 'border-red-500' : ''}
                />
                {errors.vehicleId && (
                  <p className="text-red-500 text-sm">{errors.vehicleId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input 
                  id="model" 
                  name="model" 
                  value={formData.model} 
                  onChange={handleChange} 
                  className={errors.model ? 'border-red-500' : ''}
                />
                {errors.model && (
                  <p className="text-red-500 text-sm">{errors.model}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacityKw">Capacity (kW) *</Label>
                <Input 
                  id="capacityKw" 
                  name="capacityKw" 
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.capacityKw} 
                  onChange={handleChange} 
                  className={errors.capacityKw ? 'border-red-500' : ''}
                />
                {errors.capacityKw && (
                  <p className="text-red-500 text-sm">{errors.capacityKw}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver">Driver *</Label>
                <Input 
                  id="driver" 
                  name="driver" 
                  value={formData.driver} 
                  onChange={handleChange} 
                  className={errors.driver ? 'border-red-500' : ''}
                />
                {errors.driver && (
                  <p className="text-red-500 text-sm">{errors.driver}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">{errors.location}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="batteryLeft">Battery Left (%) *</Label>
                <Input 
                  id="batteryLeft" 
                  name="batteryLeft" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.batteryLeft} 
                  onChange={handleChange} 
                  className={errors.batteryLeft ? 'border-red-500' : ''}
                />
                {errors.batteryLeft && (
                  <p className="text-red-500 text-sm">{errors.batteryLeft}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bookings">Bookings</Label>
                <Input 
                  id="bookings" 
                  name="bookings" 
                  type="number" 
                  min="0"
                  value={formData.bookings} 
                  onChange={handleChange} 
                />
              </div>

              <div className="space-y-2">
                <Label>Status *</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="CHARGING">Charging</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fleetId">Fleet ID</Label>
                <Input 
                  id="fleetId" 
                  name="fleetId" 
                  value={formData.fleetId} 
                  disabled 
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
                disabled={addVehicleStatus === 'loading'}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={addVehicleStatus === 'loading'}
              >
                {addVehicleStatus === 'loading' ? <Loading /> : 'Add Vehicle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddVehicle;