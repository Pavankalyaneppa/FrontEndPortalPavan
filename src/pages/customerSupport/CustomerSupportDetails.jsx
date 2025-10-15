import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input} from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from 'lucide-react';
import { ArrowLeftIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { addIssue } from "@/store/reducers/issues/issuesSlice";
import { fetchIssuesByEmployeeId} from "@/store/reducers/employee/employeeSlice";

export function CustomerSupportDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "info"
  );
  const [isReporting, setIsReporting] = useState(
    location.state?.openReportCard || false
  );

 const [newIssue, setNewIssue] = useState({
  issue: "",
  comment: "",
  status: "Open",
  priority: "medium",
  dueDate: "",
  category: "",
  subcategory: "",
});

  const customer = location.state?.customer;
  const [statusFilter, setStatusFilter] = useState("open");
  const { employees, loading, employeeIssues } = useSelector((state) => state.employee);

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  const categoryOptions = {
  Software: ["Payment", "Billing", "Performance", "Bug", "Other"],
  Hardware: ["Replacement", "Maintenance", "Other"],
};

  useEffect(() => {
  if (customer?.id) {
    dispatch(fetchIssuesByEmployeeId(customer.id));
  }
}, [customer?.id, dispatch]);

const issues = (employeeIssues && customer) ? (employeeIssues[customer.id] || []) : [];
console.log("All issues for employee:", issues.map(i => ({id: i.id, status: i.status})));

const getStatusBadge = (status) => {
  const s = (status || "").toLowerCase();
  const baseClasses = "px-2 py-1.5 rounded-full text-center inline-block w-24";
  switch (s) {
    case "open":
      return <span className={`${baseClasses} bg-red-200 text-red-800`}>Open</span>;
    case "inprogress":
      return <span className={`${baseClasses} bg-yellow-200 text-yellow-800`}>InProgress</span>;
    case "resolved":
      return <span className={`${baseClasses} bg-green-200 text-green-900`}>Resolved</span>;
    case "pending":
      return <span className={`${baseClasses} bg-purple-200 text-purple-800`}>Pending</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>N/A</span>;
  }
};

const getPriorityBadge = (priority) => {
  if (!priority) 
    return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 pointer-events-none">N/A</Badge>;
  const p = priority.toLowerCase();
  switch (p) {
    case "high":
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 pointer-events-none">High</Badge>;
    case "medium":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 pointer-events-none">Medium</Badge>;
    case "low":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 pointer-events-none">Low</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 pointer-events-none">{priority}</Badge>;
  }
};

const filteredIssues = issues.filter((issue) => {
  if (statusFilter === "all") return true;
  if (statusFilter === "Inprogress") {
    return ["Inprogress"].includes(issue.status?.toLowerCase());
  }
  if (statusFilter === "open") {
    return ["open"].includes(issue.status?.toLowerCase());
  }
  return issue.status?.toLowerCase() === statusFilter.toLowerCase();
});
  if (!customer) {
    return <p>Loading customer data...</p>;
  }

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const sortedIssues = [...filteredIssues].sort((a, b) => {
  const aPriority = priorityOrder[a.priority?.toLowerCase()] || 4;
  const bPriority = priorityOrder[b.priority?.toLowerCase()] || 4;
  return aPriority - bPriority;
});

console.log("Issues to render:", sortedIssues);

  const handleIssueChange = (e) => {
  const { name, value } = e.target;
  setNewIssue(prev => ({ ...prev, [name]: value }));
};

const handleIssueSubmit = async (e) => {
  e.preventDefault();

 if (!newIssue.issue) {
    toast({
      title: "Validation Error",
      description: "Issue title is required",
      variant: "destructive", 
    });
    return;
  }

  const payload = {
    ...newIssue,
    status: newIssue.status || "Open",
    priority: newIssue.priority || "medium",
    location: newIssue.location || "",
    dueDate: newIssue.dueDate || null,
    userId: 1,
    employeeId: customer.id,
    type: "Ticket",
    category: newIssue.subcategory,
    // category: newIssue.category && newIssue.subcategory
    //   ? `${newIssue.subcategory}`
    //   : newIssue.category || newIssue.subcategory || "N/A",
  };

  try {
    setSubmitting(true);
    await dispatch(addIssue(payload));
    await dispatch(fetchIssuesByEmployeeId(customer.id));
    setNewIssue({ issue: "", comment: "", priority: "medium", location: "", dueDate: "", category:"", subcategory:"",status:"open" });
    setIsReporting(false);
    toast({
      title: "Success",
      description: "Issue reported successfully",
    });
  } catch (err) {
    console.error(err);
    toast({
      title: "Error",
      description: "Failed to report issue",
      variant: "destructive",
    });
  } finally {
    setSubmitting(false);
  }
};

const handleCancelReport = () => {
  setNewIssue({ issue: "", comment: "" });
  setIsReporting(false);
};

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Customer Support Details
        </h1>
        <div className="flex justify-between items-center mb-4 gap-4">
            <Button className="bg-green-600 hover:bg-green-500 text-white"
    onClick={() => navigate(`/customer-support/edit/${customer.id}`, { state: { customer } })}
  >
    Edit
  </Button>
        <Button
      variant="outline"
      onClick={() => navigate("/customer-support")}
    > <ArrowLeftIcon className="h-4 w-4 mr-2" />
      Back
    </Button>
    </div>
      </div>
<Tabs
  value={activeTab}
  onValueChange={(val) => {
    setActiveTab(val);
    if (val !== "issues") {
      setIsReporting(false);
  }
  else {
    setStatusFilter("open");
  }}
}
>
        <TabsList className="grid w-full grid-cols-2 mb-5">
          <TabsTrigger value="info">Basic Details</TabsTrigger>
          <TabsTrigger value="issues">Issues Assigned</TabsTrigger>
        </TabsList>
        <div>
        </div>
        <TabsContent value="info">
          <div><h2 className="text-xl font-semibold mb-8">Personal Information</h2></div>
          <Card className="py-8">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="text-md">{customer.username || customer.name}</p>
                  </div>
                  {/* <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="text-md">{customer.location}</p>
                  </div> */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Designation</h3>
                    <p className="text-md">{customer.designation}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                    <p className="text-md">{customer.email}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p className="text-sm font-bold ">
                      <span
                        className={`px-2 py-1 rounded-md ${
                          customer.active
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        {customer.active ? "Available" : "Unavailable"}
                      </span>
                    </p>
                </div>
                </div>
                <div className="space-y-4">
                   <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                    <p className="text-md">{customer.mobileNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Join Date</h3>
                    <p className="font-medium">
                    {customer.joiningDate ? 
                      (Array.isArray(customer.joiningDate) ? 
                        customer.joiningDate.join('-') : 
                        customer.joiningDate
                      ) : 
                      'N/A'
                    }
                  </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="issues">
          {!isReporting && (
            <div className="flex justify-between mb-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="inprogress">Inprogress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button   className="bg-green-600 hover:bg-green-500 text-white" onClick={() => setIsReporting(true)}>
                Report Issue
              </Button>
            </div>
          )}
  {isReporting ? (
    <Card>
      <CardContent>
        <h3 className="text-lg font-semibold my-4">Report New Issue</h3>
        <form onSubmit={handleIssueSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
            <Label>Assigned To</Label>
            <Input
              value={customer.username || customer.name}
              readOnly
            />
          </div>
          <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={newIssue.category || ""}
            onValueChange={(value) =>
              setNewIssue((prev) => ({ ...prev, category: value, subcategory: "" }))
            }
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(categoryOptions).map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Subcategory</Label>
          <Select
            value={newIssue.subcategory || ""}
            onValueChange={(value) => setNewIssue((prev) => ({ ...prev, subcategory: value }))}
            disabled={!newIssue.category}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {(categoryOptions[newIssue.category] || []).map((sub) => (
                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
          <div className="space-y-2">
            <Label>Issue Title</Label>
            <Input
              name="issue"
              value={newIssue.issue}
              onChange={handleIssueChange}
              placeholder="Brief issue summary"
            />
          </div>
          <div className="space-y-2">
          <Label>Status</Label>
          <Select
            name="status"
            value={newIssue.status || "Open"}   // default Open
            onValueChange={(value) =>
              setNewIssue((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Inprogress">Inprogress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
          <div className="space-y-2">
            <Label>Description / Comment</Label>
            <Input
              name="comment"
              value={newIssue.comment}
              onChange={handleIssueChange}
              placeholder="Detailed description of the issue"
            />
            </div>
            <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              name="priority"
              value={newIssue.priority || "medium"}
              onValueChange={(value) =>
                setNewIssue((prev) => ({ ...prev, priority: value }))
              }
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
             {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              name="location"
              value={newIssue.location || ""}
              onChange={handleIssueChange}
              placeholder="Enter location"
            />
          </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" type="button" onClick={handleCancelReport}>
              Cancel
            </Button>
<Button type="submit" disabled={submitting}>
    {submitting ? "Submitting..." : "Submit"}
  </Button>          </div>
        </form>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {sortedIssues.length > 0 ? (
            sortedIssues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell>{issue.ticketId}</TableCell>
                <TableCell>{issue.issue}</TableCell>
                <TableCell>{getPriorityBadge(issue.priority)}</TableCell>  
                <TableCell>{issue.comment}</TableCell>                           
                <TableCell>{getStatusBadge(issue.status)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      navigate(`/customer-support/issue-details/${issue.id}`, {
                        state: { issue, customer },
                      })
                    }
                  >
                    <InfoIcon className="w-4 h-4 " />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                No issues found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
      </CardContent>
    </Card>
  )}
</TabsContent>
      </Tabs>
    </div>
   );
 } 
