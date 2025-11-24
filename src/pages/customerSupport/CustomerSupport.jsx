import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchIssuesByEmployeeId, fetchEmployeesPaginated } from "@/store/reducers/employee/employeeSlice";
import { Button } from "@/components/ui/button";
import { InfoIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import AddCustomerSupport from "./AddCustomerSupport";

function CustomerSupport() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const size = 10;
  const designation = "Customer Support";
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { employees, loading, employeeIssues, pagination } = useSelector((state) => state.employee);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

useEffect(() => {
    dispatch(fetchEmployeesPaginated({ page, size, designation, search }));
  }, [dispatch, page, designation, search]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    if (employees?.length > 0) {
      employees.forEach(emp => {
        dispatch(fetchIssuesByEmployeeId(emp.id));
      });
    }
  }, [employees, dispatch]);

  const handleRowClick = (customer) => {
    navigate(`/customer-support/${customer.id}`, { state: { customer } });
  };
  const filteredEmployees = employees?.filter((emp) => {
  const empIssues = employeeIssues[emp.id] || [];

  return (
    selectedCategory === "all" ||
    empIssues.some(issue => issue.category === selectedCategory)
  );
});

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customer Support</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-green-600 hover:bg-green-500 text-white flex items-center gap-2"
          >
            Add Support                                   
          </Button>
        </div>
      </div>
      <div className="flex gap-4 my-4">
    <Input
      placeholder="Search by name, email, mobile, location..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(0);
      }}
      className=""
    />
</div>
      <Card className="rounded-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assign Issue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(loading.byDesignation || loading.issues) ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredEmployees?.length > 0 ? (
                filteredEmployees.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="cursor-pointer"
                    onClick={() => handleRowClick(customer)}
                  >
                    <TableCell>{customer.username}</TableCell>
                    <TableCell>{customer.mobileNumber}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.location}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full ${
                          customer.active
                            ? "bg-green-200 text-green-900"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        {customer.active ? "Available" : "Unavailable"}
                      </span>
                    </TableCell>
                    <TableCell>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        navigate(`/customer-support/${customer.id}`, {
                          state: { customer, activeTab: "issues", openReportCard: true },
                        });
                      }}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRowClick(customer)}
                        title="View Customer Details"
                      >
                        <InfoIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No customer support found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </CardContent>
        </Card>
          <div className="flex items-center justify-center gap-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
            >
              Previous
            </Button>

            {[...Array(pagination.totalPages)].map((_, index) => (
              <Button
                key={index}
                variant={index === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page + 1 === pagination.totalPages}
            >
              Next
            </Button>
          </div>
          {/* Add this at the bottom */}
            <AddCustomerSupport
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onCustomerSupportAdded={() => {
                // Refresh your data here
                dispatch(fetchEmployeesPaginated({ page, size, designation, search }));
              }}
            />
    </div>

    
  );
}
export default CustomerSupport