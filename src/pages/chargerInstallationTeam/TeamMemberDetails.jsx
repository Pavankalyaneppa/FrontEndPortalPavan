import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import NotesSection from './NotesSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, ChevronDown, Check, Clock, Plus, Edit, Trash2, InfoIcon } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BackButton from '@/users/BackButton';
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  validateTaskName,
  validateCity, 
  validateDescription
} from '@/pages/validations/Validation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { 
  fetchEmployeeById, 
  assignTeamTask, 
  updateTeamTaskProgress,
  fetchTaskNotes,
  addTaskNote,
  updateTaskNote,
  deleteTaskNote,
  fetchAllEmployees,
} from '@/store/reducers/chargerInstallation/ChargerInstallationSlice';
import { 
  fetchTasksByEmployee,
  updateTaskStatus 
} from "../../store/reducers/tasks/technicianTasksSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "@/components/ui/use-toast";

const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

// Utility function to calculate time duration from createdAt
const calculateTaskDuration = (createdAt) => {
  if (!createdAt) return 'N/A';
  
  try {
    const createdTime = new Date(createdAt);
    const now = new Date();
    const diffMs = now - createdTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${remainingHours}h`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  } catch (error) {
    console.error('Error calculating task duration:', error);
    return 'N/A';
  }
};

// Component for displaying time badge
const TimeBadge = ({ task }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [duration, setDuration] = useState('N/A');
  
  useEffect(() => {
    // Calculate initial duration
    setDuration(calculateTaskDuration(task.createdAt));
    
    // Update time every minute for real-time duration
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setDuration(calculateTaskDuration(task.createdAt));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [task.createdAt]);
  
  // Different styles based on duration and status
  const getBadgeStyle = () => {
    if (task.status === 'COMPLETED') {
      return "bg-green-100 text-green-800 border-green-200";
    }
    
    // Parse duration to get hours
    const hoursMatch = duration.match(/(\d+)d\s*(\d+)h/) || duration.match(/(\d+)h/);
    let hours = 0;
    
    if (hoursMatch) {
      if (hoursMatch[1] && hoursMatch[2]) {
        // Format: Xd Yh
        hours = parseInt(hoursMatch[1]) * 24 + parseInt(hoursMatch[2]);
      } else if (hoursMatch[1]) {
        // Format: Xh
        hours = parseInt(hoursMatch[1]);
      }
    }
    
    if (hours > 48) { // More than 2 days
      return "bg-red-100 text-red-800 border-red-200";
    } else if (hours > 24) { // More than 1 day
      return "bg-orange-100 text-orange-800 border-orange-200";
    } else {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };
  
  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 ${getBadgeStyle()}`}
      title={`Task created at: ${task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}`}
    >
      <Clock className="h-3 w-3" />
      {duration}
    </Badge>
  );
};

const TeamMemberDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth?.currentUser);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [viewingTaskNotes, setViewingTaskNotes] = useState(false);

  const [assigningTaskLoading, setAssigningTaskLoading] = useState(false);
  const { currentTeam, loading, error } = useSelector(state => state.chargerInstallation);
  
  // Correct state access for tasksByEmployee
  const { 
    tasksByEmployee, 
    loading: tasksLoading, 
    error: tasksError 
  } = useSelector((state) => state.technicianTasks);
  
  // For all employees
  const allEmployees = useSelector(state => state.chargerInstallation?.allEmployees || []);
  console.log("allEmployees:", allEmployees);

  const employeesLoading = useSelector(state => state.chargerInstallation?.allEmployeesLoading || false);
  const [activeTab, setActiveTab] = useState("basic");
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const filterRef = useRef(null);
  
  const [taskFilter, setTaskFilter] = useState("PENDING");
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({
    taskName: false,
    location: false,
    description: false
  });

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const availableEmployees = allEmployees.filter(employee => 
    employee.id !== parseInt(id)
  );
  
  const [newTask, setNewTask] = useState({
    taskName: '',
    location: '',
    priority: 'Medium',
    dueDate: '',
    description: '',
    employeeId: id
  });

  useEffect(() => {
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  useEffect(() => {
    console.log("TeamMemberDetails mounted with ID:", id);
    if (id) {
      dispatch(fetchEmployeeById(id));
    }
  }, [id, dispatch]);

  // Fetch tasks for the specific employee using fetchTasksByEmployee
  useEffect(() => {
    if (id) {
      dispatch(fetchTasksByEmployee(id));
      console.log("TasksByEmployee response:", tasksByEmployee);
    }
  }, [id, dispatch]);

  useEffect(() => {
    console.log("Fetched currentTeam:", currentTeam);
    if (currentTeam) {
      console.log("All properties:", Object.keys(currentTeam));
      if (currentTeam.tasks) {
        console.log("Tasks found:", currentTeam.tasks);
      }
      if (currentTeam.assignedTasks) {
        console.log("Assigned tasks found:", currentTeam.assignedTasks);
      }
      if (currentTeam.installationTasks) {
        console.log("Installation tasks found:", currentTeam.installationTasks);
      }
    }
  }, [currentTeam]);

  // Log tasksByEmployee changes
  useEffect(() => {
    console.log("tasksByEmployee updated:", tasksByEmployee);
  }, [tasksByEmployee]);

  useEffect(() => {
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
    }
    if (state?.assignNewTask) {
      setIsAssigningTask(true);
    }
  }, [state]);

  // Add validation effect
  useEffect(() => {
    const errors = {};

    const taskNameError = validateTaskName(newTask.taskName);
    if (taskNameError) errors.taskName = taskNameError;

    const locationError = validateCity(newTask.location);
    if (locationError) errors.location = locationError;

    const descriptionError = validateDescription(newTask.description);
    if (descriptionError) errors.description = descriptionError;

    setFormErrors(errors);
  }, [newTask]);

  useClickOutside(filterRef, () => {
    setDropdownOpen(null);
  });
  
  const handleAssignTask = async () => {
    // Mark all fields as touched when form is submitted
    setTouched({
      taskName: true,
      location: true,
      description: true
    });

    // Check if there are any validation errors
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
    if (!newTask.taskName.trim()) {
      toast({
        title: "Validation Error",
        description: "Task name is required",
        variant: "destructive",
      });
      return;
    }

    setAssigningTaskLoading(true); 

    try {
      await dispatch(assignTeamTask({
        employeeId: id,
        taskData: {
          taskName: newTask.taskName,
          description: newTask.description,
          employeeId: id,
          location: newTask.location,
          priority: newTask.priority,
          dueDate: newTask.dueDate,
          status: "PENDING" 
        }
      })).unwrap();

      setNewTask({
        taskName: '',
        location: '',
        priority: 'Medium',
        dueDate: '',
        description: '',
        employeeId: id
      });
      setIsAssigningTask(false);
      
      toast({
        title: "Success",
        description: "Task assigned successfully",
        variant: "default",
      });
      
      dispatch(fetchEmployeeById(id));
      // Refresh tasks using fetchTasksByEmployee
      dispatch(fetchTasksByEmployee(id));
      
    } catch (error) {
      console.error('Failed to assign task:', error);
      
      toast({
        title: "Error",
        description: 'Failed to assign task: ' + (error.message || 'Unknown error'),
        variant: "destructive",
      });
    } finally{
      setAssigningTaskLoading(false);
    }
  };

  const handleUpdateTaskProgress = async (taskName, progress) => {
    if (progress < 0 || progress > 100) {
      alert('Progress must be between 0 and 100');
      return;
    }

    try {
      await dispatch(updateTeamTaskProgress({
        id: id,
        taskName: taskName,
        progress: progress
      })).unwrap();

      dispatch(fetchEmployeeById(id));
      
    } catch (error) {
      console.error('Failed to update task progress:', error);
      alert('Failed to update progress: ' + (error.message || 'Unknown error'));
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const result = await dispatch(updateTaskStatus({ taskId, status: newStatus })).unwrap();
      
      toast({
        title: "Success",
        description: "Status updated successfully",
        variant: "default",
      });

      // Refresh the tasks list using fetchTasksByEmployee
      dispatch(fetchTasksByEmployee(id));

    } catch (error) {
      console.error("Failed to update status:", error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setDropdownOpen(null);
    }
  };

  const handleViewTaskNotes = (taskId) => {
    setSelectedTaskId(taskId);
    setViewingTaskNotes(true);
  };

  const handleCloseTaskNotes = () => {
    setSelectedTaskId(null);
    setViewingTaskNotes(false);
  };

  // Get tasks from tasksByEmployee state
  const getTasksFromState = () => {
    // Try different possible locations in the state
    if (tasksByEmployee?.items && tasksByEmployee.items.length > 0) {
      return tasksByEmployee.items;
    }
    if (tasksByEmployee?.pending && tasksByEmployee.pending.length > 0) {
      return [...tasksByEmployee.pending, ...(tasksByEmployee.inProgress || []), ...(tasksByEmployee.completed || [])];
    }
    if (Array.isArray(tasksByEmployee) && tasksByEmployee.length > 0) {
      return tasksByEmployee;
    }
    
    // Fallback to currentTeam tasks if available
    return currentTeam?.installationTasks || currentTeam?.tasks || currentTeam?.assignedTasks || [];
  };

  const tasks = getTasksFromState();
  
  console.log("Final tasks array:", tasks);

  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sortedEmployeeTasks = tasks
    ? [...tasks].sort((a, b) => {
        const pA = priorityOrder[a.priority?.toLowerCase()] || 4;
        const pB = priorityOrder[b.priority?.toLowerCase()] || 4;
        return pA - pB;
      })
    : [];

  const filteredTasks = sortedEmployeeTasks.filter((task) => {
    if (taskFilter === "ALL") return true;
    const normalizedStatus = task.status?.replace("_", "") || '';
    const normalizedFilter = taskFilter.replace("_", "");
    return normalizedStatus === normalizedFilter;
  });

  if (loading && !currentTeam) {
    return <div className="text-center py-8">Loading member details...</div>;
  }

  if (error && !currentTeam) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8 text-red-500">
          Error: {error}
        </div>
        <div className="text-center">
          <Button onClick={() => navigate('/charger-installation-team')}>
            Back to Team List
          </Button>
        </div>
      </div>
    );
  }

  if (!currentTeam) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          Team member not found or data not loaded yet.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Member Details</h1>
        <div className="flex gap-2">
          <BackButton />
          <Button 
            variant="outline" 
            onClick={() => navigate(`/charger-installation-team/edit/${id}`)}
          >
            Edit
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="basic">Basic Details</TabsTrigger>
          <TabsTrigger value="tasks">Assigned Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{currentTeam.username || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{currentTeam.mobileNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{currentTeam.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{currentTeam.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentTeam.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"
                    }`}>
                      {currentTeam.active ? "Active" : "Inactive"}
                    </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium">
                    {currentTeam.joiningDate ? 
                      (Array.isArray(currentTeam.joiningDate) ? 
                        currentTeam.joiningDate.join('-') : 
                        currentTeam.joiningDate
                      ) : 
                      'N/A'
                    }
                  </p>
                </div>
                {currentTeam.experience && (
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{currentTeam.experience}</p>
                  </div>
                )}
                {currentTeam.designation && (
                  <div>
                    <p className="text-sm text-muted-foreground">Designation</p>
                    <p className="font-medium">{currentTeam.designation}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          {viewingTaskNotes ? (
            <div>
              <NotesSection 
                taskId={parseInt(selectedTaskId)} 
                currentUser={currentUser}
                employeeId={id}
                isTechnicianPortal={false}
                availableEmployees={availableEmployees} 
                employeesLoading={employeesLoading}
              />
            </div>
          ) : (
            <>
              <div className='flex justify-between items-center mb-6'>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAssigningTask(!isAssigningTask)}
                >
                  {isAssigningTask ? 'Cancel' : 'Assign New Task'}
                </Button>
              </div>
              
              {/* Task Assignment Form */}
              {isAssigningTask && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Assign New Task</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="taskName">Task Name *</Label>
                        <Input
                          id="taskName"
                          value={newTask.taskName}
                          onChange={(e) => setNewTask({...newTask, taskName: e.target.value})}
                          onBlur={handleBlur}
                          placeholder="Enter task name"
                          required
                        />
                         {touched.taskName && formErrors.taskName && (<p className="text-sm text-red-500 mt-1">{formErrors.taskName}</p>)}
                      </div>
                      <div>
                        <Label htmlFor="taskLocation">Location</Label>
                        <Input
                          id="taskLocation"
                          value={newTask.location}
                          onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                          onBlur={handleBlur}
                          placeholder="Enter location"
                        />
                        {touched.location && formErrors.location && (<p className="text-sm text-red-500 mt-1">{formErrors.location}</p>)}
                      </div>
                      <div>
                        <Label htmlFor="taskPriority">Priority</Label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value) => setNewTask({...newTask, priority: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="taskDescription">Description</Label>
                        <Textarea
                          id="taskDescription"
                          value={newTask.description}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                          onBlur={handleBlur}
                          placeholder="Enter task description"
                          rows={3}
                        />
                        {touched.description && formErrors.description && (<p className="text-sm text-red-500 mt-1">{formErrors.description}</p>)}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleAssignTask} disabled={assigningTaskLoading}>
                        {assigningTaskLoading ? "Assigning..." : "Assign Task"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAssigningTask(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}  
              
              <div className="flex justify-left mb-4">
                <Select value={taskFilter} onValueChange={setTaskFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>   
                  </SelectContent>
                </Select>
              </div>

              <Card className="mb-6">
                <CardContent>
                  {tasksLoading ? (
                    <div className="text-center py-4">Loading tasks...</div>
                  ) : tasksError ? (
                    <div className="text-center py-4 text-red-500">
                      Error loading tasks: {tasksError}
                      <div className="mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => dispatch(fetchTasksByEmployee(id))}
                        >
                          Retry
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task ID</TableHead>
                          <TableHead>Task Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>

                          {/* <TableHead>Duration</TableHead> */}
                          
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTasks.length > 0 ? (
                          filteredTasks.map((task) => (
                            <TableRow key={task.id}>
                              <TableCell>{task.id}</TableCell>
                              <TableCell className="font-medium">
                                {task.taskName || "N/A"}
                              </TableCell>
                              <TableCell>{task.description || "N/A"}</TableCell>
                              <TableCell>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    task.priority === "high" || task.priority === "High"
                                      ? "bg-red-100 text-red-800"
                                      : task.priority === "medium" || task.priority === "Medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : task.priority === "low" || task.priority === "Low"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {task.priority || "N/A"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="relative" ref={filterRef}>
                                  <button
                                    className={`flex items-center px-4 py-1.5 border rounded-full transition ${
                                      task.status === "COMPLETED"
                                        ? "bg-green-100 text-green-800 border-green-400"
                                        : task.status === "PENDING"
                                        ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                                        : task.status === "INPROGRESS" || task.status === "IN_PROGRESS"
                                        ? "bg-blue-100 text-blue-800 border-blue-400"
                                        : "bg-gray-100 text-gray-800 border-gray-400"
                                    }`}
                                  >
                                    {task.status}
                                  </button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewTaskNotes(task.id)}
                                  className="flex items-center gap-1"
                                >
                                  <InfoIcon className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan="7" className="text-center">
                              No {taskFilter === "ALL" ? "" : taskFilter.toLowerCase()} tasks found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="notes">
          <div className="text-center py-8 text-muted-foreground">
            <InfoIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Task notes are now available in the "Assigned Tasks" tab.</p>
            <p className="text-sm">Click on the "Notes" button next to any task to view and manage its notes.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setActiveTab("tasks")}
            >
              Go to Assigned Tasks
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamMemberDetails;