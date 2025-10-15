import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from 'react-redux';
import { InfoIcon } from 'lucide-react';
import { createRequest, fetchRequestedData } from '@/store/reducers/requests/RequestsSlice';
import FranchiseRequestsDetails from "./FranchiseRequestsDetails"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";

export default function RequestsTabsStatic() {
  const { toast } = useToast();
  const MAIN_FRANCHISES = ["IOCL", "HPCL", "BPCL"];
  
  const [activeTab, setActiveTab] = useState("franchise");
  const [globalFilter, setGlobalFilter] = useState('');
  const [viewMode, setViewMode] = useState("table"); 
  const [requestType, setRequestType] = useState("franchise");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [currentView, setCurrentView] = useState("main");
  const[ search, setSearch] = useState("");
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.requests.list);
  const status = useSelector((state) => state.requests.status);

  const getRequestsByCategory = (category) =>
  requests.filter(r => r.category?.toLowerCase() === category);

  const filteredRequests = requests.filter(r => r.category?.toLowerCase() === activeTab);

  const [formData, setFormData] = useState({
    franchiseName: "",
    siteName: "",
    stationName: "",
    address: "",
    latitude: "",
    longitude: "",
    capacity: "",
    phoneNumber: "",
    email: "",
  });

  // Autofill based on request type
  useEffect(() => {
    if (requestType === "franchise") {
      setFormData({
        franchiseName: "",
        siteName: "",
        stationName: "",
        address: "",
        latitude: "",
        longitude: "",
        capacity: "",
        phoneNumber: "",
        email: "",
      });
    } else if (requestType === "site") {
      setFormData({
        franchiseName: "GreenCharge EV Pvt Ltd",
        siteName: "",
        stationName: "",
        address: "",
        latitude: "",
        longitude: "",
        capacity: "",
        phoneNumber: "",
        email: "",
      });
    } else if (requestType === "station") {
      setFormData({
        franchiseName: "GreenCharge EV Pvt Ltd",
        siteName: "Hyderabad Central Site",
        stationName: "",
        address: "",
        latitude: "",
        longitude: "",
        capacity: "",
        phoneNumber: "",
        email: "",
      });
    }
  }, [requestType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInfoClick = (franchiseId) => {
    setSelectedFranchiseId(franchiseId);
    setCurrentView("franchiseDetails"); 
  };

  const handleBackToMain = () => {
    setCurrentView("main");
    setSelectedFranchiseId(null);
    setSelectedSite(null);
  };

  const handleSiteClick = (site) => {
    setSelectedSite(site);
    setCurrentView("siteDetails");
  };

  const handleBackToFranchise = () => {
    setCurrentView("franchiseDetails");
    setSelectedSite(null);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const savedRequest = await dispatch(createRequest({
      category: requestType.toUpperCase(),
      franchiseName: formData.franchiseName,
      sitename: formData.siteName,
      stationName: formData.stationName,
      address: formData.address,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      chargerCapacity: formData.capacity ? parseFloat(formData.capacity) : null,
      mobileNumber: formData.phoneNumber,
      email: formData.email,
    }));

    toast({
      title: "Success",
      description: `Request submitted successfully! ID: ${savedRequest.id}`,
    });

    setViewMode("table");
    setActiveTab(requestType);

    // Reset form
    setFormData({
      franchiseName: "",
      siteName: "",
      stationName: "",
      address: "",
      latitude: "",
      longitude: "",
      capacity: "",
      phoneNumber: "",
      email: "",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: error.message || "Failed to submit request",
    });
  } finally {
    setIsSubmitting(false);
  }
};

const flattenFranchiseData = (data) => {
  const uniqueFranchises = {};

  data.forEach(f => {
    const managerName = (f.managerName || "").trim();
    let mainName = MAIN_FRANCHISES.find(fr => managerName.toUpperCase().startsWith(fr.toUpperCase()));

    if (!mainName) return;
    if (!uniqueFranchises[mainName]) {
      uniqueFranchises[mainName] = {
        id: mainName,
        franchiseName: mainName,
        address: "",
        email: f.managerEmail || "",
        phoneNumber: f.managerPhone || "",
      };
    }
  });

  return Object.values(uniqueFranchises);
};

const flattenStationsData = (data) => {
  // data = array of sites
  let flatList = [];
  data.forEach(site => {
    const { siteName, siteId, locations, stations } = site;
    const location = locations?.[0] || {}; // take first location
    stations?.forEach(station => {
      const port = station.ports?.[0] || {};
      flatList.push({
        siteId,
        siteName,
        stationId: station.stationId,
        stationName: station.stationName,
        portId: port.portId,
        capacity: port.capacity,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        franchiseName: site.managerName,
      });
    });
  });
  return flatList;
};

useEffect(() => {
  dispatch(fetchRequestedData({search}));
}, [dispatch,search]);


// Define table columns for each tab type
const getTableColumns = (tabType) => {
  switch (tabType) {
    case "franchise":
      return [
        { key: "id", label: "ID" },
        { key: "franchiseName", label: "Franchise Name" },
        { key: "address", label: "Address"},
        { key: "email", label: "Email" },
        { key: "phoneNumber", label: "Phone Number" }
      ];
    case "site":
      return [
        { key: "siteName", label: "Site Name" },
        { key: "address", label: "Address" },
        { key: "latitude", label: "Latitude" },
        { key: "longitude", label: "Longitude" }
      ];
    case "station":
      return [
        { key: "siteName", label: "Site Name" },
        { key: "stationName", label: "Station Name" },
        { key: "capacity", label: "Capacity" },
        { key: "connectorType", label: "Connector Type" },
        { key: "serialNumber", label: "Serial Number" },
        { key: "portType", label: "Port Type" }
      ];
    default:
      return [];
  }
};

const renderTable = (data, tabType) => {
  const columns = getTableColumns(tabType);

  return (
    <div className="space-y-4">
      {/* Header with Request Button */}
    

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              {columns.map((column) => (
                <TableHead key={column.key}>
                  {column.label}
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50">
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {item[column.key] || "-"}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleInfoClick(item.id)}
                    >
                      <InfoIcon className="h-4 w-4" /> 
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + 1} 
                  className="text-center py-8 text-muted-foreground"
                >
                  No requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const renderForm = () => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Add Request</h1>
      <Button variant="outline" onClick={() => setViewMode("table")}>
        Back
      </Button>
    </div>

    <div className="max-w-4xl mx-auto rounded-lg border p-6 bg-white shadow">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dropdown inside form */}
          <div className="space-y-2">
            <Label htmlFor="requestType">Select Request Type</Label>
            <Select
              value={requestType}
              onValueChange={(value) => setRequestType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose request type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="franchise">Franchise Request</SelectItem>
                <SelectItem value="site">Site Request</SelectItem>
                <SelectItem value="station">Station Request</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Franchise Name */}
          <div className="space-y-2">
            <Label htmlFor="franchiseName">Franchise Name</Label>
            <Input
              id="franchiseName"
              name="franchiseName"
              value={formData.franchiseName}
              onChange={handleChange}
              readOnly={requestType !== "franchise"}
              placeholder="Enter franchise name"
            />
          </div>

          {/* Site Name - Show for both site and station requests */}
          {(requestType === "site" || requestType === "station") && (
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                readOnly={requestType === "station"}
                placeholder="Enter site name"
              />
            </div>
          )}

          {/* Station Name - Only for station requests */}
          {requestType === "station" && (
            <div className="space-y-2">
              <Label htmlFor="stationName">Station Name</Label>
              <Input
                id="stationName"
                name="stationName"
                value={formData.stationName}
                onChange={handleChange}
                placeholder="Enter station name"
              />
            </div>
          )}

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>

          {/* Latitude */}
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Enter latitude"
            />
          </div>

          {/* Longitude */}
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Enter longitude"
            />
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (kW)</Label>
            <Input
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Enter capacity"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setViewMode("table")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </div>
  </div>
);

if (currentView === "franchiseDetails") {
  return (
    <div className="container mx-auto p-4">
      <FranchiseRequestsDetails 
        franchiseId={selectedFranchiseId} 
        onBack={handleBackToMain}       // ← just hides details
        onSiteClick={handleSiteClick}
      />
    </div>
  );
}

if (currentView === "siteDetails") {
  return (
    <div className="container mx-auto p-4">
      <SiteStationDetails 
        siteId={selectedSite.id}
        siteName={selectedSite.siteName}
        onBack={handleBackToFranchise}  // ← hides site details
      />
    </div>
  );
}


return (
  <div className="container mx-auto p-4">
    {viewMode === "table" && currentView === "main" ? (
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="franchise">Franchise Requests</TabsTrigger>
          <TabsTrigger value="site">Site Requests</TabsTrigger>
          <TabsTrigger value="station">Station Requests</TabsTrigger>
        </TabsList>

        <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">
          {activeTab === "franchise" && "Franchise Requests"}
          {activeTab === "site" && "Site Requests"}
          {activeTab === "station" && "Station Requests"}
        </h2>
      </div>

        <div className="flex gap-4 items-center mb-4">
            <Input
          placeholder="Search requests..."
            value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
          </div>
        <TabsContent value="franchise">
          {renderTable(flattenFranchiseData(requests), "franchise")}
        </TabsContent>

        <TabsContent value="site">
          {renderTable(flattenStationsData(getRequestsByCategory("site")), "site")}
        </TabsContent>

        <TabsContent value="station">
          {renderTable(flattenStationsData(getRequestsByCategory("station")), "station")}
        </TabsContent>
      </Tabs>
    ) : (
      renderForm()
    )}
  </div>
);
}