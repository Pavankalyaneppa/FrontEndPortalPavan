import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/users/BackButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from 'react-redux';
import { addTeam } from '@/store/reducers/chargerInstallation/ChargerInstallationSlice';
import {
  validateName,
  validateMobileNumber,
  validateEmail,
  validateLocation,
} from '@/pages/validations/Validation';
import { ReloadIcon } from '@radix-ui/react-icons';

const AddTeamMember = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formErrors, setFormErrors] = useState({});
  const chargerInstallationState = useSelector(state => state.chargerInstallation);
  const error = chargerInstallationState?.error || null;

  const [touched, setTouched] = useState({
    username: false,
    mobileNumber: false,
    email: false,
    location: false
  });

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false); 

  const [formData, setFormData] = useState({
    username: "",
    mobileNumber: "",
    email: "",
    location: "",
    active: "true",
    joiningDate: "",
    experience: "",
    country: "",
    state: "",
    designation: "charger installer",
    assignedSites: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validations
  useEffect(() => {
    const errors = {};

    const fullNameError = validateName(formData.username);
    if (fullNameError) errors.username = fullNameError;

    const mobileError = validateMobileNumber(formData.mobileNumber);
    if (mobileError) errors.mobileNumber = mobileError;

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const locationError = validateLocation(formData.location);
    if (locationError) errors.location = locationError;

    setFormErrors(errors);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      username: true,
      mobileNumber: true,
      email: true,
      location: true
    });

    // Check for validation errors
    if (Object.keys(formErrors).length > 0) {
      const firstError = Object.values(formErrors).find(error => error);
      toast({
        title: "Validation Error",
        description: firstError || "Please fix the validation errors",
        variant: "destructive",
      });
      return;
    }

    // Check for empty required fields
    const requiredFields = {
      username: "Full Name",
      mobileNumber: "Mobile Number",
      email: "Email",
      location: "Location"
    };

    const emptyFields = Object.entries(requiredFields)
      .filter(([field]) => !formData[field])
      .map(([_, name]) => name);

    if (emptyFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in the following fields: ${emptyFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        joiningDate: formData.joiningDate ? formData.joiningDate.split('-').map(part => parseInt(part, 10)) : []
      };

      await dispatch(addTeam(payload)).unwrap();

      toast({
        title: "Success",
        description: "Team member added successfully!",
      });

      navigate("/charger-installation-team");
    } catch (error) {
      console.error("Error adding team member:", error);
      toast({
        title: "Error",
        description: error || "Failed to add team member",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Stop loader
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Team Member</h1>
        <BackButton />
      </div>

      <div className="max-w-4xl mx-auto rounded-lg border p-5 bg-white shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="username">Full Name</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter full name"
                required
              />
              {touched.username && formErrors.username && <p className="text-sm text-red-500">{formErrors.username}</p>}
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter mobile number"
                required
              />
              {touched.mobileNumber && formErrors.mobileNumber && <p className="text-sm text-red-500">{formErrors.mobileNumber}</p>}
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
                onBlur={handleBlur}
                placeholder="Enter email address"
                required
              />
              {touched.email && formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter location"
                required
              />
              {touched.location && formErrors.location && <p className="text-sm text-red-500">{formErrors.location}</p>}
            </div>

            {/* Joining Date */}
            <div>
              <Label htmlFor="joiningDate">Joining Date</Label>
              <Input
                type="date"
                id="joiningDate"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            {/* Designation */}
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                readOnly
                className="mt-1"
              />
            </div>

            {/* Active Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.active}
                onValueChange={(value) => setFormData({ ...formData, active: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">active</SelectItem>
                  <SelectItem value="false">inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/charger-installation-team")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddTeamMember;