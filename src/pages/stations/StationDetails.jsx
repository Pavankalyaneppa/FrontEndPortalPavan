import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchStationDetails } from '@/store/reducers/stations/stationsSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  StarFilledIcon, StarIcon, EyeNoneIcon, LightningBoltIcon, BarChartIcon,
  PersonIcon, CalendarIcon, IdCardIcon, TimerIcon, InfoCircledIcon
} from "@radix-ui/react-icons";
import axios from 'axios';
import AxiosServices from '@/services/AxiosServices';

export default function StationDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentStation, status, error } = useSelector((state) => state.stations);
  console.log(currentStation);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stationStatus, setStationStatus] = useState(currentStation?.stationStatus || 'Inactive');

  useEffect(() => {
    if (id) {
      dispatch(fetchStationDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentStation) {
      setStationStatus(currentStation.stationStatus || 'Inactive');
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
    // Update station list or current station as needed
    // dispatch(fetchStations({ page: currentPage, size: pageSize })); 
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

 
  const renderStars = (rating = 0) => {
    return Array(5).fill(0).map((_, i) => (
      i < rating ?
        <StarFilledIcon key={i} className="h-5 w-5 text-yellow-400" /> :
        <StarIcon key={i} className="h-5 w-5 text-gray-300" />
    ));
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'failed') {
    toast({
      title: 'Error',
      description: error || 'Failed to load station details',
      variant: 'destructive',
    });
    return <div className="p-6">Error loading station details</div>;
  }

  ///mistake want to correct it
  if (!currentStation) {
    return <div className="p-6"><Loading/></div>;
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
                  >
                    {option}
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
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Ports ({currentStation.port?.length || 0})
              </h2>
            </div>
            
            <ScrollArea className="h-[400px] w-full rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Port Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Nominal Volts</TableHead>
                      <TableHead>Max Amps</TableHead>
                      <TableHead>Max Power</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentStation.port?.map((port, index) => (
                      <TableRow key={port.id || index}>
                        <TableCell>{port.connectorName || `Port ${index + 1}`}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              port.statusNotifcation?.[0]?.status === 'Inoperative' 
                                ? 'destructive' 
                                : 'default'
                            } 
                            className="text-xs"
                          >
                            {port.statusNotifcation?.[0]?.status || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>{port.voltage_rating || '-'} V</TableCell>
                        <TableCell>{port.current_rating || '-'} A</TableCell>
                        <TableCell>{port.max_power_kW || '-'} kW</TableCell>
                        <TableCell>
                          ${port.billingAmount || '0.00'} / {port.billingUnits || 'kWh'}
                        </TableCell>
                        <TableCell>
                          {port.connector_type || '-'}, {port.power_type || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}