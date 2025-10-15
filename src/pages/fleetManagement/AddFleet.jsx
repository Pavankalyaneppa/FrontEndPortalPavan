import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFleet, resetAddFleetStatus } from '@/store/reducers/fleet/FleetSlice';
import { toast } from '@/components/ui/use-toast';
import BackButton from '@/users/BackButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Loading from '@/users/Loading';

const AddFleet = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addFleetStatus, addFleetError } = useSelector((state) => state.fleet);
  const { user } = useSelector((state) => state.authentication);

  const [formData, setFormData] = useState({
    fleetName: '', 
    ownerName: '',
    ownerEmail: '', 
    ownerPhone: '', 
    baseLocation: '', 
    status: 'ACTIVE', 
    orgId: user?.orgId || ''
  });

  useEffect(() => {
    console.log('Add fleet status:', addFleetStatus);
    console.log('Add fleet error:', addFleetError);

    if (addFleetStatus === 'succeeded') {
      toast({
        title: 'Success',
        description: 'Fleet added successfully!',
        variant: 'default',
      });
      navigate('/fleetManagement');
      dispatch(resetAddFleetStatus());
    }

    if (addFleetStatus === 'failed') {
      const errorMessage = addFleetError?.response?.message || 
                          addFleetError?.message || 
                          addFleetError?.error || 
                          addFleetError || 
                          'Failed to add fleet. Please check your data and try again.';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      dispatch(resetAddFleetStatus());
    }
  }, [addFleetStatus, addFleetError, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting fleet data:', formData);
    dispatch(addFleet(formData));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Fleet</h1>
        <BackButton />
      </div>

      <div className="max-w-3xl mx-auto rounded-lg border p-6 bg-white shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fleetName">Fleet Name *</Label>
              <Input 
                id="fleetName" 
                name="fleetName" 
                value={formData.fleetName} 
                onChange={handleChange} 
                required 
                disabled={addFleetStatus === 'loading'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name *</Label>
              <Input 
                id="ownerName" 
                name="ownerName" 
                value={formData.ownerName} 
                onChange={handleChange} 
                required 
                disabled={addFleetStatus === 'loading'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerEmail">Owner Email *</Label>
              <Input 
                id="ownerEmail" 
                name="ownerEmail" 
                type="email"
                value={formData.ownerEmail} 
                onChange={handleChange} 
                required 
                disabled={addFleetStatus === 'loading'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerPhone">Owner Phone *</Label>
              <Input 
                id="ownerPhone" 
                name="ownerPhone" 
                type="tel"
                value={formData.ownerPhone} 
                onChange={handleChange} 
                required 
                disabled={addFleetStatus === 'loading'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseLocation">Base Location *</Label>
              <Input 
                id="baseLocation" 
                name="baseLocation" 
                value={formData.baseLocation} 
                onChange={handleChange} 
                required 
                disabled={addFleetStatus === 'loading'}
              />
            </div>

            <div className="space-y-2">
              <Label>Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange("status", value)}
                required
                disabled={addFleetStatus === 'loading'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/fleetManagement')}
              disabled={addFleetStatus === 'loading'}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={addFleetStatus === 'loading'}
            >
              {addFleetStatus === 'loading' ? <Loading /> : 'Add Fleet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFleet;