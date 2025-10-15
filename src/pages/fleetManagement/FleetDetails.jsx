import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchFleetDetails, 
  fetchFleetVehicles, 
  deleteVehicleFromFleet,
  resetFleetDetails,
  updateFleet,
  setCurrentFleet,
  fetchFleets,
  deleteFleet,
  updateVehicle
} from '@/store/reducers/fleet/FleetSlice';
import { toast } from '@/components/ui/use-toast';
import BackButton from '@/components/ui/BackButton';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  InfoIcon, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Edit, 
  Download,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import Loading from '@/users/Loading';

const FleetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    fleets, 
    error, 
    deleteFleetStatus,
    currentFleet, 
    fleetVehicles, 
    fleetDetailsStatus,
    fleetDetailsError,
    status,
    updateFleetStatus
  } = useSelector((state) => state.fleet);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedFleet, setEditedFleet] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchFleetDetails(id));
      dispatch(fetchFleetVehicles(id));
    }

    return () => {
      dispatch(resetFleetDetails());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentFleet) {
      setEditedFleet({ ...currentFleet });
    }
  }, [currentFleet]);

  const handleRefresh = () => {
    if (id) {
      dispatch(fetchFleetDetails(id));
      dispatch(fetchFleetVehicles(id));
    }
  };

  const handleAddVehicle = () => {
    navigate('/vehicle/add', { state: { fleetId: id } });
  };

  const handleEditFleet = () => {
    setEditDialogOpen(true);
  };

  const handleSaveFleet = async () => {
    try {
      const fleetDataToUpdate = {
        fleetName: editedFleet.fleetName,
        ownerName: editedFleet.ownerName,
        ownerEmail: editedFleet.ownerEmail,
        ownerPhone: editedFleet.ownerPhone,
        baseLocation: editedFleet.baseLocation,
        status: editedFleet.status
      };
      
      await dispatch(updateFleet({ 
        id: currentFleet.id, 
        fleetData: fleetDataToUpdate 
      })).unwrap();
      
      toast({
        title: 'Success',
        description: 'Fleet updated successfully',
        variant: 'default',
      });
      
      setEditDialogOpen(false);
      dispatch(fetchFleetDetails(id));
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update fleet',
        variant: 'destructive',
      });
    }
  };

  const handleExportData = () => {
    if (!currentFleet) return;
    
    const csvContent = [
      ['Fleet ID', 'Fleet Name', 'Owner Name', 'Owner Email', 'Owner Phone', 'Base Location', 'Status'],
      [
        currentFleet.id || 'N/A',
        currentFleet.fleetName || 'N/A',
        currentFleet.ownerName || 'N/A',
        currentFleet.ownerEmail || 'N/A',
        currentFleet.ownerPhone || 'N/A',
        currentFleet.baseLocation || 'N/A',
        currentFleet.status || 'N/A'
      ]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fleet-${currentFleet.fleetName || 'unknown'}-details.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (vehicleToDelete && id) {
      try {
        await dispatch(deleteVehicleFromFleet({ 
          fleetId: id, 
          vehicleId: vehicleToDelete.id 
        })).unwrap();
        
        dispatch(fetchFleetVehicles(id));
        
        toast({
          title: 'Success',
          description: 'Vehicle deleted successfully',
          variant: 'default',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete vehicle',
          variant: 'destructive',
        });
      }
    }
    setDeleteDialogOpen(false);
    setVehicleToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setVehicleToDelete(null);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditedFleet(currentFleet ? { ...currentFleet } : null);
  };

  const handleInputChange = (field, value) => {
    setEditedFleet(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderActionButtons = () => (
    <div className="flex gap-2 mt-4">
      <Button onClick={handleEditFleet}>
        <Edit className="h-4 w-4 mr-2" />
        Edit Fleet
      </Button>
    </div>
  );

  if (fleetDetailsStatus === 'loading') {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Loading Fleet Details...</h1>
          <BackButton />
        </div>
        <Loading />
      </div>
    );
  }

  if (fleetDetailsStatus === 'failed') {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Error Loading Fleet</h1>
          <BackButton />
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="flex items-center text-red-600 mb-4">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Error Details</h3>
            </div>
            <div className="space-y-2">
              <p><strong>Error Message:</strong> {fleetDetailsError || 'Unknown error'}</p>
              <p><strong>Fleet ID:</strong> {id}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button onClick={handleRefresh} className="mr-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" onClick={() => navigate('/fleet')}>
            Back to Fleets
          </Button>
        </div>
      </div>
    );
  }

  if (fleetDetailsStatus === 'succeeded' && (!currentFleet || Object.keys(currentFleet).length === 0)) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Fleet Not Found</h1>
          <BackButton />
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Fleet with ID <strong>{id}</strong> could not be found.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-2">
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
          <Button variant="outline" onClick={() => navigate('/fleet')}>
            Back to Fleets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fleet Details - {currentFleet?.fleetName || 'Unknown Fleet'}</h1>
        <BackButton />
      </div>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 font-bold text-sm">
          <TabsTrigger value="info">Fleet Info</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles ({fleetVehicles?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Fleet ID</p>
                  <p className="font-medium">{currentFleet?.id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fleet Name</p>
                  <p className="font-medium">{currentFleet?.fleetName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner Name</p>
                  <p className="font-medium">{currentFleet?.ownerName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner Email</p>
                  <p className="font-medium">{currentFleet?.ownerEmail || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner Phone</p>
                  <p className="font-medium">{currentFleet?.ownerPhone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Base Location</p>
                  <p className="font-medium">{currentFleet?.baseLocation || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      (currentFleet?.status || '').toUpperCase() === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      (currentFleet?.status || '').toUpperCase() === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentFleet?.status || 'N/A'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Number of Vehicles</p>
                  <p className="font-medium">{fleetVehicles?.length || 0}</p>
                </div>
              </div>
              {renderActionButtons()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Vehicles in {currentFleet?.fleetName}</h2>
                <Button onClick={handleAddVehicle}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              </div>
              
              {status === 'loading' ? (
                <Loading />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle ID</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Battery Left</TableHead>
                      <TableHead>Capacity (kW)</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fleetVehicles && Array.isArray(fleetVehicles) && fleetVehicles.map(vehicle => (
                      <TableRow key={vehicle.id}>
                        <TableCell>{vehicle.vehicleId || 'N/A'}</TableCell>
                        <TableCell>{vehicle.model || 'N/A'}</TableCell>
                        <TableCell>{vehicle.driver || 'N/A'}</TableCell>
                        <TableCell>{vehicle.batteryLeft !== undefined ? `${vehicle.batteryLeft}%` : 'N/A'}</TableCell>
                        <TableCell>{vehicle.capacityKw !== undefined ? `${vehicle.capacityKw} kW` : 'N/A'}</TableCell>
                        <TableCell>{vehicle.location || 'N/A'}</TableCell>
                        <TableCell>{vehicle.bookings !== undefined ? vehicle.bookings : 'N/A'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            (vehicle.status || '').toUpperCase() === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            (vehicle.status || '').toUpperCase() === 'CHARGING' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {vehicle.status || 'UNKNOWN'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/vehicle/${vehicle.id}`, { state: { vehicle, fleet: currentFleet } })}
                            >
                              <InfoIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(vehicle)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!Array.isArray(fleetVehicles) || fleetVehicles.length === 0) && (
                      <TableRow>
                        <TableCell colSpan="9" className="text-center text-muted-foreground py-6">
                          No vehicles found for this fleet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {editDialogOpen && editedFleet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Fleet</h3>
            <div className=" grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Fleet Name</label>
                <input
                  type="text"
                  value={editedFleet.fleetName || ''}
                  onChange={(e) => handleInputChange('fleetName', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Owner Name</label>
                <input
                  type="text"
                  value={editedFleet.ownerName || ''}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Owner Email</label>
                <input
                  type="email"
                  value={editedFleet.ownerEmail || ''}
                  onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Owner Phone</label>
                <input
                  type="text"
                  value={editedFleet.ownerPhone || ''}
                  onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Base Location</label>
                <input
                  type="text"
                  value={editedFleet.baseLocation || ''}
                  onChange={(e) => handleInputChange('baseLocation', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={editedFleet.status || ''}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              {/* </div> */}
            </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={handleEditCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveFleet}
                disabled={updateFleetStatus === 'loading'}
              >
                {updateFleetStatus === 'loading' ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-2">Delete Vehicle?</h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete {vehicleToDelete?.model} (ID: {vehicleToDelete?.vehicleId})?
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleDeleteCancel}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetDetails;