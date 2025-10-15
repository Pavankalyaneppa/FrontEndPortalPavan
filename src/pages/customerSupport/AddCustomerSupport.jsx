import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import BackButton from "@/users/BackButton";
import { useToast } from "@/components/ui/use-toast";
import AxiosServices from "@/services/AxiosServices";
import { useSelector } from "react-redux";

function AddCustomerSupport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { employees } = useSelector(state => state.employee);

  const [loading, setLoading] = useState(false);
  const statusOptions = ["Available", "Unavailable"];

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    location: "",
    status: "",
    active: false,
    designation: "",
    joiningDate:"",
  });

  const [formErrors, setFormErrors] = useState({});

  // Set designation from first employee if exists
  useEffect(() => {
    if (employees?.length > 0) {
      setFormData(prev => ({
        ...prev,
        designation: employees[0].designation || "Customer Support",
      }));
    }
  }, [employees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
    ...prev,
    status: value,
    active: value === "Available"   // true if Available, false if Unavailable
  }));
 };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.username.trim()) errors.username = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.mobileNumber.trim()) errors.mobileNumber = "Mobile number is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.status.trim()) errors.status = "Status is required";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: Object.values(errors).join(", "),
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        username: formData.username,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        location: formData.location,
        active: formData.active,
        designation: formData.designation,
        joiningDate: new Date().toISOString().split("T")[0],
      };

      await AxiosServices.addEmployee(payload);

      toast({ title: "Success", description: "Customer support added successfully!" });

      navigate("/customer-support");
    } catch (error) {
      toast({ title: "Error", description: error || "Failed to add customer support", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/customer-support");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Customer Support</h1>
<Button
      variant="outline"
      onClick={() => navigate("/customer-support")}
    >
      Back
    </Button>      </div>

      <Card className="max-w-4xl mx-auto p-5 bg-white shadow rounded-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label htmlFor="username">Full Name</Label>
                <Input id="username" name="username" placeholder="Enter full name" value={formData.username} onChange={handleChange} />
                {formErrors.username && <p className="text-xs text-red-500">{formErrors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Enter email" value={formData.email} onChange={handleChange} />
                {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input id="mobileNumber" name="mobileNumber" placeholder="Enter mobile number" value={formData.mobileNumber} onChange={handleChange} />
                {formErrors.mobileNumber && <p className="text-xs text-red-500">{formErrors.mobileNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="Enter location" value={formData.location} onChange={handleChange} />
                {formErrors.location && <p className="text-xs text-red-500">{formErrors.location}</p>}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formErrors.status && <p className="text-xs text-red-500">{formErrors.status}</p>}
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                    id="joiningDate"
                    name="joiningDate"
                    type="date"
                    value={formData.joiningDate}
                    onChange={handleChange}
                />
                {formErrors.joiningDate && <p className="text-xs text-red-500">{formErrors.joiningDate}</p>}
                </div> */}
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input value={formData.designation} readOnly className="cursor-not-allowed" />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddCustomerSupport;
