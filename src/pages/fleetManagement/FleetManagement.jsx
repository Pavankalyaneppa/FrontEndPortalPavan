import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { InfoIcon, Trash2, TrendingUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFleets, deleteFleet } from '@/store/reducers/fleet/FleetSlice';
import { useNavigate, } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,  
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Loading from '@/users/Loading';

const FleetManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fleets, status, error, deleteFleetStatus } = useSelector((state) => state.fleet);
  const { user } = useSelector((state) => state.authentication);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchFleets({ 
      orgId: user?.orgId,
      page: currentPage,
      size: pageSize
    }));
  }, [dispatch, user?.orgId, currentPage, pageSize]);

  const handleDelete = async (fleetId) => {
    if (window.confirm('Are you sure you want to delete this fleet?')) {
      try {
        await dispatch(deleteFleet(fleetId)).unwrap();
        toast({
          title: 'Success',
          description: 'Fleet deleted successfully',
          variant: 'default',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error || 'Failed to delete fleet',
          variant: 'destructive',
        });
      }
    }
  };

  const fleetsArray = Array.isArray(fleets) ? fleets : [];

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'failed') {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fleet Management</h1>
         <div className="flex gap-2"> {/* Add this wrapper div */}
          <Button onClick={() => navigate('/fleet/revenue')}>
            <TrendingUp className="h-4 w-4 mr-2" />
            View Revenue
          </Button>
        <Button onClick={() => navigate('/fleet/add')}>Add Fleet</Button>
      </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>Fleet ID</TableHead> */}
              <TableHead>Fleet Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Owner Name</TableHead>
              <TableHead>Owner Email</TableHead>
              <TableHead>Owner Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fleetsArray.map(fleet => (
              <TableRow key={fleet.id}>
                {/* <TableCell>{fleet.id || 'N/A'}</TableCell> */}
                <TableCell>{fleet.fleetName || 'N/A'}</TableCell>
                <TableCell>{fleet.baseLocation || 'N/A'}</TableCell>
                <TableCell>{fleet.ownerName || 'N/A'}</TableCell>
                <TableCell>{fleet.ownerEmail || 'N/A'}</TableCell>
                <TableCell>{fleet.ownerPhone || 'N/A'}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    (fleet.status || '').toUpperCase() === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    (fleet.status || '').toUpperCase() === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {fleet.status || 'UNKNOWN'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/fleet/${fleet.id}`, { state: fleet })}
                    >
                      <InfoIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(fleet.id)}
                      disabled={deleteFleetStatus === 'loading'}
                    >
                      <Trash2 className="h-4 w-4 text-black-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {fleetsArray.length === 0 && (
              <TableRow>
                <TableCell colSpan="8" className="text-center text-muted-foreground py-6">
                  No fleets found. Click "Add Fleet" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FleetManagement;