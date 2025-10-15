import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchSiteDetails, fetchStations } from '@/store/reducers/sites/sitesSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import BackButton from '@/users/BackButton';
import Loading from '@/users/Loading';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import AxiosServices from '@/services/AxiosServices';
export default function SingleSite() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    currentSite,
    siteDetailsStatus,
    siteDetailsError,
    stationList,
    stationTotalElements,
    stationCurrentPage,
  } = useSelector((state) => state.sites);
console.log(currentSite); 
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const totalPages = Math.ceil(stationList.length / itemsPerPage);

// Calculate start and end index
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

// Slice the data to display only current page's items
const currentOwners = stationList.slice(startIndex, endIndex);
 
const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};
const [status, setStatus] = useState('');

const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleStatusChange = async (newStatus) => {
  try {
    setStatus(newStatus);
    
    // Call the API service
   const response= await AxiosServices.updateSiteStatus(id, newStatus);

    // Show success toast
    if(response.status==200)
    {
    toast({
      title: 'Success',
      description: 'Status updated successfully',
      variant: 'default',
    });
    }
    else{
      toast({
      title: 'failed',
      description: 'Status  not updated successfully',
      variant: 'default',
    });
    }
    // Refresh data
    dispatch(fetchStations(id, { 
      page: currentPage - 1, 
      size: itemsPerPage 
    }));

  } catch (error) {
    // Show error toast (error message is propagated from ApiService)
    toast({
      title: 'Error',
      description: error.toString(),
      variant: 'destructive',
    });
  } finally {
    setDropdownOpen(false);
  }
};
  useEffect(() => {
    if (currentSite) {
      // Assuming currentSite.siteStatus is 'active' | 'inactive' | 'maintenance'
      setStatus(currentSite?.siteStatus);
    }
  }, [currentSite?.siteStatus]);
  
 useEffect(() => {
  if (id) {
    dispatch(fetchSiteDetails(id));
    dispatch(fetchStations(id, { page:0, size:10 }));
  }
}, [dispatch, id]);




  if (siteDetailsStatus === 'loading') {
    return <Loading />;
  }

  if (siteDetailsStatus === 'failed') {
    toast({
      title: 'Error',
      description: siteDetailsError || 'Failed to load site details',
      variant: 'destructive',
    });
    return <div className="p-6">Error loading site details</div>;
  }

  if (!currentSite) {
    return <div className="p-6">No site data found</div>;
  }

  // Access nested objects safely
  const location = currentSite.location?.[0] || {};
  const facilities = currentSite;
  const operations = currentSite;

  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
     <div className="flex items-center gap-4 mb-6">
 <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentSite.siteName}
          </h1>

          <div className="relative">
            <button
              className={`flex items-center px-4 py-1.5 border rounded-full transition ${
                status === 'Active'
                  ? 'bg-green-100 text-green-800 border-green-400'
                  : status === 'InMaintaince'
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-400'
                  : status === 'InActive'
                  ? 'bg-red-100 text-red-800 border-red-400'
                  : 'bg-gray-100 text-gray-800 border-gray-400'
              }`}
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {status}
              {dropdownOpen ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 p-3">
                <p className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Select Status
                </p>
                {[ 'Active', 'InActive','InMaintaince'].map((option) => (
                  <button
                    key={option}
                    className={`w-full text-left px-4 py-1.5 mb-1 rounded-full border transition ${
                      option === 'Active'
                        ? 'bg-green-100 text-green-800 border-green-400'
                        : option === 'InMaintaince'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-400'
                        : option === 'InActive'
                        ? 'bg-red-100 text-red-800 border-red-400'
                        : 'bg-blue-100 text-blue-800 border-blue-400'
                    }`}
                    onClick={() => handleStatusChange(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

</div>
        <div className="flex gap-2">
          <BackButton to = "/sites" />
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Basic Details</TabsTrigger>
          <TabsTrigger value="stations">Stations</TabsTrigger>
           <TabsTrigger value="facilities">Facilities</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div>
 <div className="flex justify-between items-center mb-6">
              <div>  <h2 className="text-xl font-semibold mt-8 mb-4">Manager Information</h2></div>
             <Button  className="flex gap-2  w-24"  onClick={()=>navigate(`/editsite/${currentSite.siteId }`)}>Edit</Button>
        </div>
            
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-semibold text-gray-600">Manager Name</p>
                  <p className="font-medium">{currentSite.managerName || '-'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Email</p>
                  <p className="font-medium">{currentSite.managerEmail || '-'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Phone</p>
                  <p className="font-medium">{currentSite.managerPhone || '-'}</p>
                </div>
              </div>
            </Card>

            <h2 className="text-xl font-semibold mb-4">Site Information</h2>
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="font-semibold text-gray-600">Site Name</p>
                  <p className="font-medium">{currentSite.siteName || '-'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Status</p>
                  <p className="font-medium">
                    {status }
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Operating Hours</p>
                  <p className="font-medium">
                   {currentSite.openingTime || '-'} - {currentSite.closeTime || '-'}
                  </p>
                </div>
              </div>
          

            {/* <h2 className="text-xl font-semibold mt-8 mb-4">Location Information</h2> */}
          
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-semibold text-gray-600">Address</p>
                  <p className="font-medium">{location.address || '-'}</p>
                </div>
                {/* <div>
                  <p className="font-semibold text-gray-600">City</p>
                  <p className="font-medium">{location.city || '-'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">State</p>
                  <p className="font-medium">{location.state || '-'}</p>
                </div> */}
                {/* <div>
                  <p className="font-semibold text-gray-600 mt-4">Country</p>
                  <p className="font-medium">{location.country || '-'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mt-4">Zip Code</p>
                  <p className="font-medium">{location.zipCode || '-'}</p>
                </div> */}
                <div>
                  <p className="font-semibold text-gray-600 mt-4">Coordinates</p>
                  <p className="font-medium">
                    {location.latitude ? `${location.latitude}, ${location.longitude}` : '-'}
                  </p>
                </div>
              </div>
            </Card>
            <h2 className="text-xl font-semibold mt-8 mb-4">Additional Information</h2>
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-semibold text-gray-600">Additional Detials</p>
                  <p className="font-medium"> -</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Email</p>
                  <p className="font-medium">-</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Phone</p>
                  <p className="font-medium">-</p>
                </div>
              </div>
            </Card>
           
          </div>
        </TabsContent>

        <TabsContent value="facilities">
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <h2 className="text-xl font-semibold mb-4">Facilities</h2>
            <Card className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="parking" checked={facilities.parking} disabled />
                  <Label htmlFor="parking">Parking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="wifi" checked={facilities.wifi} disabled />
                  <Label htmlFor="wifi">WiFi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="food" checked={facilities.food} disabled />
                  <Label htmlFor="food">Food</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="restrooms" checked={facilities.restrooms} disabled />
                  <Label htmlFor="restrooms">Restrooms</Label>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stations">
          <div className="bg-white rounded-lg shadow p-6 mt-4">
             <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">STATIONS </h1>
        <div>
          <Button onClick={() => navigate('/add-stations', { state: { from: 'site', siteId: id } })}>
  Add Station
</Button>
        </div>
      </div>
                       {stationList && stationList.length > 0 ? (
              <Table className="border">
                <TableHeader>
                  <TableRow>
                    <TableHead>Station Id</TableHead>
                    <TableHead>Station Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Port Quantity</TableHead>
                     <TableHead>Voltage</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                 {stationList.slice(startIndex, endIndex).map((station) => (
                    <TableRow key={station.id} onClick={()=>navigate(`/stations/${station.id}`)}>
                      <TableCell>{station.id || '-'}</TableCell>
                      <TableCell>{station.stationName || '-'}</TableCell>
                      <TableCell>{station.model || '-'}</TableCell>
                      <TableCell>{station.number_of_ports || '-'}</TableCell>
                       <TableCell>{station.max_output_power_kW+" Kw/h" || '-'}</TableCell>
                      <TableCell>
                        {station.stationStatus ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-red-600">Inactive</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No stations available for this site</p>
              </Card>
            )}
          </div>
        <div className= "flex items-center justify-center gap-2 py-4">
  <Button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    variant="outline"
  >
    Previous
  </Button>
  
   {Array.from({ length: totalPages }, (_, i) => (
    <Button
      key={i + 1}
      variant={currentPage === i + 1 ? 'default' : 'outline'}
      onClick={() => handlePageChange(i + 1)}
    >
      {i + 1}
    </Button>
  ))}
 
  <Button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}variant="outline"
  >
    Next
  </Button>
</div>

        </TabsContent>
     

      </Tabs>
    </div>
  );
}