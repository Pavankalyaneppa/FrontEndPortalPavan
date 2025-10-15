import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequestedData } from '@/store/reducers/requests/RequestsSlice';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export default function FranchiseRequestsDetails({ franchiseId, onBack }) {
  const dispatch = useDispatch();

  const { list, status, error } = useSelector(state => state.requests);
  const [activeTab, setActiveTab] = useState('basic');
  const [franchiseDetails, setFranchiseDetails] = useState(null);
  const [sitesData, setSitesData] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [siteSearch, setSiteSearch] = useState("");


  const filteredSites = sitesData.filter(site =>
  site.siteName.toLowerCase().includes(siteSearch.toLowerCase()) ||
  site.locations?.[0]?.address?.toLowerCase().includes(siteSearch.toLowerCase())
);
  
//   useEffect(() => {
//   if (!franchiseId || !list || list.length === 0) return;

//   const franchiseData = list.filter(f => f.managerName === franchiseId);

//   setFranchiseDetails({
//     franchiseName: franchiseData[0]?.managerName || "Unknown Franchise",
//     email: franchiseData[0]?.managerEmail || "-",
//     phoneNumber: franchiseData[0]?.managerPhone || "-",
//     address: "-", // Franchise address
//   });

//   setSitesData(franchiseData);
// }, [franchiseId, list]);

useEffect(() => {
  if (!franchiseId || !list || list.length === 0) return;

  // Match all sites whose managerName starts with the selected franchiseId
  const franchiseData = list.filter(f =>
    f.managerName?.toUpperCase().startsWith(franchiseId.toUpperCase())
  );

  if (franchiseData.length === 0) return;

  setFranchiseDetails({
    franchiseName: franchiseId, // show main franchise name
    email: franchiseData[0]?.managerEmail || "-",
    phoneNumber: franchiseData[0]?.managerPhone || "-",
    address: "-", // Franchise address, optional if you have it
  });

  setSitesData(franchiseData);
}, [franchiseId, list]);


  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'maintenance': return 'outline';
      default: return 'secondary';
    }
  };

    const [verifyFormData, setVerifyFormData] = useState({
    franchiseName: "GreenCharge EV Pvt Ltd",
    siteName: "",
    stationName: "",
    capacity: "",
    connectorType: "",
    serialNumber: "",
    portType: "",
    status: "",
    // verificationNotes: ""
  });

  
  const handleVerifyFormChange = (e) => {
    const { name, value } = e.target;
    setVerifyFormData((prev) => ({ ...prev, [name]: value }));
  };

    const handleVerifySelectChange = (name, value) => {
    setVerifyFormData((prev) => ({ ...prev, [name]: value }));
  };

   const handleVerifySubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setVerifyDialogOpen(false);
      setSelectedStation(null);
      toast({
        title: "Success",
        description: "Station verified successfully!",
      });
    }, 1000);
  };

   const handleVerifyClick = (station) => {
    setSelectedStation(station);
    setVerifyFormData({
      franchiseName: station.franchiseName,
      siteName: station.siteName,
      stationName: station.stationName,
      capacity: station.capacity,
      connectorType: station.connectorType,
      serialNumber: station.serialNumber,
      portType: station.portType,
      status: station.status,
    //   verificationNotes: ""
    });
    setVerifyDialogOpen(true);
  };

  const handleSiteClick = (site) => {
    setSelectedSite(site);
    setActiveTab('stations');
  };

  if (status === 'loading') return <p className="text-center">Loading...</p>;
  if (status === 'failed') return <p className="text-center text-red-500">{error}</p>;
  if (!franchiseDetails) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{franchiseDetails.franchiseName}</h1>
            {!selectedSite && (
            <Button variant="outline" onClick={onBack}>
              ← Back
            </Button>
        )}
        </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        
    {!selectedSite && (
        <TabsList className="grid w-full grid-cols-2">
      <>
        <TabsTrigger value="basic">Basic Details</TabsTrigger>
        <TabsTrigger value="sites">Sites</TabsTrigger>
      </> </TabsList>
    )}

        {/* Basic Details Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Franchise Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-md font-medium text-gray-500">Franchise Name</label>
                  <p className="text-base">{franchiseDetails.franchiseName}</p>
                </div>
                <div>
                  <label className="text-md font-medium text-gray-500">Email</label>
                  <p className="text-base">{franchiseDetails.email}</p>
                </div>
                <div>
                  <label className="text-md font-medium text-gray-500">Phone Number</label>
                  <p className="text-base">{franchiseDetails.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-md font-medium text-gray-500">Address</label>
                  <p className="text-base">{franchiseDetails.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sites Tab */}
        <TabsContent value="sites" className="space-y-4">
          <h2 className="text-2xl font-bold">Sites</h2>
          <Input
      placeholder="Search sites..."
      value={siteSearch}
      onChange={(e) => setSiteSearch(e.target.value)}
      className="w-full"
    />
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Latitude</TableHead>
                    <TableHead>Longitude</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredSites.length > 0 ? (
                        filteredSites.map(site => (
                        <TableRow key={site.siteId} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleSiteClick(site)}>
                            <TableCell>{site.siteName}</TableCell>
                            <TableCell>{site.locations?.[0]?.address || "-"}</TableCell>
                            <TableCell>{site.locations?.[0]?.latitude || "-"}</TableCell>
                            <TableCell>{site.locations?.[0]?.longitude || "-"}</TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                            No sites found
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stations Tab */}
        <TabsContent value="stations" className="space-y-4">
             <div className="flex items-center justify-between mb-4 mt-4">
             <h2 className="text-2xl font-bold" >Stations</h2>
        <Button
          variant="outline"
          onClick={() => {
            setActiveTab("sites");
            setSelectedSite(null);
          }}
        >
          ← Back
        </Button>
      </div>
          {selectedSite ? (
            <Card>
              <CardHeader>
                <CardTitle> {selectedSite.siteName}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                     <TableHead>Serial Number</TableHead>
                    <TableHead>Site Name</TableHead>
                    <TableHead>Station Name</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Connector Type</TableHead>
                    <TableHead>Port Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSite.stations?.map(station => (
                      station.ports?.map(port => (
                        <TableRow key={station.stationId + port.portId}>
                                                    <TableCell>{station["serial number"]|| "-"}</TableCell>
                          <TableCell>{selectedSite.siteName}</TableCell>
                          <TableCell>{station.stationName}</TableCell>
                          <TableCell>{port.capacity || "-"}</TableCell>
                          <TableCell>{port.connectorType || "-"}</TableCell>
                          <TableCell>{port.portType || "-"}</TableCell>
                          <TableCell><Badge variant={getStatusVariant(station.status)}>
                            {station.status}
                            </Badge></TableCell>
                           <TableCell>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                handleVerifyClick({
                                    franchiseName: franchiseDetails.franchiseName,
                                    siteName: selectedSite.siteName,
                                    stationName: station.stationName,
                                    capacity: port.capacity,
                                    connectorType: port.connectorType,
                                    serialNumber: station["serial number"],
                                    portType: port.portType,
                                    status: port.status,
                                })
                                }
                                disabled={port.status === "Verified"}
                            >
                                {port.status === "Verified" ? "Verified" : "Verify"}
                            </Button>
                            </TableCell>
                        </TableRow>
                      ))
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <p className="text-center text-gray-500">Select a site to view stations</p>
          )}
        </TabsContent>
      </Tabs>
       <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verify Station</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleVerifySubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Franchise Name (Readonly) */}
              <div className="space-y-2">
                <Label htmlFor="verify-franchiseName">Franchise Name</Label>
                <Input
                  id="verify-franchiseName"
                  name="franchiseName"
                  value={verifyFormData.franchiseName}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              {/* Site Name (Readonly) */}
              <div className="space-y-2">
                <Label htmlFor="verify-siteName">Site Name</Label>
                <Input
                  id="verify-siteName"
                  name="siteName"
                  value={verifyFormData.siteName}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              {/* Station Name */}
              <div className="space-y-2">
                <Label htmlFor="verify-stationName">Station Name</Label>
                <Input
                  id="verify-stationName"
                  name="stationName"
                  value={verifyFormData.stationName}
                  onChange={handleVerifyFormChange}
                  placeholder="Enter station name"
                  required
                />
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <Label htmlFor="verify-capacity">Capacity (kW)</Label>
                <Input
                  id="verify-capacity"
                  name="capacity"
                  value={verifyFormData.capacity}
                  onChange={handleVerifyFormChange}
                  placeholder="Enter capacity"
                  required
                />
              </div>

              {/* Connector Type */}
              <div className="space-y-2">
                <Label htmlFor="verify-connectorType">Connector Type</Label>
                <Input
                    id="verify-connectorType"
                    name="connectorType"
                    value={verifyFormData.connectorType}
                    onChange={handleVerifyFormChange}
                    placeholder="Enter connector type (e.g., CCS2, CHAdeMO)"
                />
                </div>
              {/* Serial Number */}
              <div className="space-y-2">
                <Label htmlFor="verify-serialNumber">Serial Number</Label>
                <Input
                  id="verify-serialNumber"
                  name="serialNumber"
                  value={verifyFormData.serialNumber}
                  onChange={handleVerifyFormChange}
                  placeholder="Enter serial number"
                  required
                />
              </div>

              {/* Port Type */}
              <div className="space-y-2">
                <Label htmlFor="verify-portType">Port Type</Label>
                <Input
                    id="verify-portType"
                    name="portType"
                    value={verifyFormData.portType}
                    onChange={handleVerifyFormChange}
                    placeholder="Enter port type (e.g., AC, DC Fast)"
                />
                </div>
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="verify-status">Status</Label>
                <Select
                  value={verifyFormData.status}
                  onValueChange={(value) => handleVerifySelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVerifyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Station"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}