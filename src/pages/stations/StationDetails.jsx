import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchStationDetails } from '@/store/reducers/stations/stationsSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AxiosServices from '@/services/AxiosServices';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import BackButton from '@/users/BackButton';
import Loading from '@/users/Loading';
import { toast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { StarFilledIcon, StarIcon, EyeNoneIcon, BarChartIcon } from "@radix-ui/react-icons";
import { updatePortPrice } from '@/services/AxiosServices';
export default function StationDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentStation, status, error } = useSelector((state) => state.stations);
  console.log(currentStation);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stationStatus, setStationStatus] = useState(currentStation?.stationStatus || 'Inactive');
  const [billingAmounts, setBillingAmounts] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(fetchStationDetails(id));
    }
  }, [dispatch, id]);


  useEffect(() => {
  if (currentStation) {
    setStationStatus(currentStation.stationStatus || 'Inactive');
    const billings = {};
    currentStation.port?.forEach((p) => {
      billings[p.id] = p.billingAmount ?? p.portPrice ?? 0;
    });
    setBillingAmounts(billings);
  }
}, [currentStation]);

const handleStatusChange = async (newStatus) => {
  try {
    setStationStatus(newStatus);
    console.log(currentStation.id, newStatus);
    // await axios.put(`http://localhost:8800/services/station/station_status?stationId=${currentStation.id}&stationStatus=${newStatus}`);
     await AxiosServices.updateStationStatus(
      currentStation.id, 
      newStatus
    );
    toast({
      title: 'Success',
      description: 'Status updated successfully',
      variant: 'default',
    });
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to update status',
      variant: 'destructive',
    });
  } finally {
    setDropdownOpen(false);
  }
};

const handleUpdateBillingAmount = async (portId) => {
  try {
    const newBillingAmount = billingAmounts[portId];
    console.log('Updating port billing:', { portId, newBillingAmount });
    
    await updatePortPrice(portId, newBillingAmount);
    
    toast({
      title: 'Success',
      description: `Port ${portId} billing amount updated successfully.`,
      variant: 'default',
    });
    
    dispatch(fetchStationDetails(id));
    
  } catch (error) {
    console.error('Update billing error:', error);
    toast({
      title: 'Error',
      description: `Failed to update billing amount for Port ${portId}: ${error.message || error}`,
      variant: 'destructive',
    });
  }
};
 
  const renderStars = (rating = 0) => {
    return Array(5).fill(0).map((_, i) => (
      i < rating ?
        <StarFilledIcon key={i} className="h-5 w-5 text-yellow-400" /> :
        <StarIcon key={i} className="h-5 w-5 text-gray-300" />
    ));
  };

  if (status === 'loading' || !currentStation) {
  return <Loading />;
}

  if (status === 'failed') {
    toast({
      title: 'Error',
      description: error || 'Failed to load station details',
      variant: 'destructive',
    });
  } 

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentStation.serialNo} / {currentStation.stationName}
          </h1>
          <div className="relative">
            <button
              className={`flex items-center px-4 py-1.5 border rounded-full transition ${
                stationStatus === 'Active'
                  ? 'bg-green-100 text-green-800 border-green-400'
                  : stationStatus === 'Maintenance'
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-400'
                  : 'bg-red-100 text-red-800 border-red-400'
              }`}
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {stationStatus}
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
                {['Active', 'Inactive', 'Maintenance'].map((option) => (
                  <button
                    key={option}
                    className={`w-full text-left px-4 py-1.5 mb-1 rounded-full border transition ${
                      option === 'Active'
                        ? 'bg-green-100 text-green-800 border-green-400'
                        : option === 'Maintenance'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-400'
                        : 'bg-red-100 text-red-800 border-red-400'
                    }`}
                    onClick={() => handleStatusChange(option)}
                  > {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <BackButton />
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" aria-label="View">
              <EyeNoneIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Analytics">
              <BarChartIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Basic Details</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="ports">Ports</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Station Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-600">Serial Number</p>
                  <p className="font-medium">{currentStation.serialNo || '-'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Station Name</p>
                  <p className="font-medium">{currentStation.stationName || '-'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Model</p>
                  <p className="font-medium">{currentStation.model || '-'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Manufacturer ID</p>
                  <p className="font-medium">{currentStation.manufacturerId || '-'}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Site Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-600">Site Name</p>
                  <p className="font-medium">{currentStation.site?.siteName || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Site Owner</p>
                  <p className="font-medium">{currentStation.site?.org?.orgName || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Go Live Date</p>
                  <p className="font-medium">
                    {currentStation.creationDate ? new Date(currentStation.creationDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Station Mode</p>
                  <p className="font-medium">{currentStation.stationMode || 'Payment Mode'}</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="specifications">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-600">Firmware Version</p>
                  <p className="font-medium">{currentStation.firmware_version || '-'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Communication Method</p>
                  <p className="font-medium">{currentStation.communication_method || '-'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Current Type</p>
                  <p className="font-medium">{currentStation.current_type || '-'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Max Output Power</p>
                  <p className="font-medium">{currentStation.max_output_power_kW || '-'} kW</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Voltage Range</p>
                  <p className="font-medium">{currentStation.voltage_range || '-'} V</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Performance & Features</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-600">Number of Ports</p>
                  <p className="font-medium">{currentStation.number_of_ports || '-'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Plug & Charge</p>
                  <p className="font-medium">{currentStation.plug_and_charger ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">V2G Support</p>
                  <p className="font-medium">{currentStation.v2G_support ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">OCPP Version</p>
                  <p className="font-medium">{currentStation.ocppVersion || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Station Rating</p>
                  <div className="flex items-center">
                    {renderStars(currentStation.rating || 0)}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>        
            <TabsContent value="ports">
              {/* <Card className="p-6"> */}
                <ScrollArea className="h-[400px] w-full rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Port Number</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Nominal Volts</TableHead>
                        <TableHead>Max Amps</TableHead>
                        <TableHead>Max Power</TableHead>
                        <TableHead>Type</TableHead>
                        {/* <TableHead>Set Port Price</TableHead> */}
                        <TableHead>Billing Amount</TableHead>

                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentStation.port?.map((port, i) => (
                        <TableRow key={port.id || i}>
                          <TableCell>{port.connectorName || `Port ${i + 1}`}</TableCell>
                          <TableCell>
                            <Badge variant={port.statusNotifcation?.[0]?.status === 'Inoperative' ? 'destructive' : 'default'}>
                              {port.statusNotifcation?.[0]?.status || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>{port.voltage_rating || '-'} V</TableCell>
                          <TableCell>{port.current_rating || '-'} A</TableCell>
                          <TableCell>{port.max_power_kW || '-'} kW</TableCell>                         
                          {/* <TableCell>{billingAmounts[port.id] ?? '-'}</TableCell> */}
                          <TableCell>{port.connector_type || '-'}, {port.power_type || '-'}</TableCell>
                          <TableCell>
                            <input
                              type="number"
                              value={billingAmounts[port.id] ?? ''}
                              onChange={(e) => setBillingAmounts((prev) => ({ ...prev, [port.id]: e.target.value }))}
                              className="border rounded p-1 w-24 text-sm"
                            />
                            <span className="ml-1 text-xs text-gray-500">/ {port.billingUnits || 'kWh'}</span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleUpdateBillingAmount(port.id)}>
                            Save
                            </Button>
                          </TableCell>
                      </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              {/* </Card> */}
            </TabsContent>
      </Tabs>
    </div>
  );
}