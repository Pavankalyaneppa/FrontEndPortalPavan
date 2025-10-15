
import { baseURL,baseOCPPURL } from '@/config';
import { data } from 'autoprefixer';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const ocppApi = axios.create({
  baseURL: baseOCPPURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
     const roleId = localStorage.getItem('roleId');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Add role-based API validation
  // if (config.url.includes('/admin') && Number(roleId) !== 1) {
  //   return Promise.reject(new Error('Unauthorized access'));
  // }
  
  if (config.url.includes('/franchise') && Number(roleId) !== 4) {
    return Promise.reject(new Error('Unauthorized access'));
  }
    return config;
  },
  (error) => Promise.reject(error)
);

const AxiosServices = {
  
  registerUser: async (userData) => {
    try {
      const response = await axiosInstance.post('/login/registration', userData);
        return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  loginUser: async (userData) => {
    try {
      const response = await axiosInstance.post('/login/authenticate', userData)
      console.log(response.data);
        return response;
    } catch (error) {
      throw error.response.data;
    }
  },
 
  getCountries: async () => {
    try {
      const response = await axiosInstance.get('/common/getcountries');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

 // Specific API methods
 getSites: (params) => {
  return axios.get(`${API_URL}/site/siteList`, { params })
    .then(response => response.data);
},
addSite: (siteData) => {
  return axios.post(`${API_URL}/site/add`, siteData)
    .then(response => ({ data: response.data }));
},

//
getStationBySiteId:(id)=> {
  return axios.post(`${API_URL}/site/stationDetailsbysiteid`, siteData)
    .then(response => ({ data: response.data }));
},

  // New method to get list of owners
  getOwners: () => {
    return axios.get(`${API_URL}/userprofile/getOwners`)
      .then(response => response.data);
  },
  fetchSingleSiteDetails: (id) => {
    return axios.get(`${API_URL}/site/siteDetails/${id}`)
      .then(response => ({ data: response.data }));
  },
  fetchSiteRevenue: async (id) => {
    try {
      const response = await axiosInstance.get(`\/site/info/${id}`);
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },
  fetchSiteOwnerDetails: async (id) => {
    try {
      const response = await axiosInstance.get(`/services/reports/21/365/?type=${id}`);
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },
  fetchStations: async (siteId, params) => {
    try {
      const response = await axiosInstance.get(`/services/table_data/station/site/${siteId}`, { params });
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },
//   searchStations: async ({ search, page, size, searchField }) => {
//   try {
//     const response = await axios.get('http://localhost:8800/services/userprofile/unified-search', {
//       params: { search, page, size, type: 'station', searchField }
//     });
//     return response.data.station; 
//   } catch (error) {
//     throw error.response?.data || 'Search failed';
//   }
// },

searchStations: async ({ siteName, stationStatus, currentType, page = 0, size = 10 }) => {
  try {
    const response = await axiosInstance.get("/services/station/search", {
      params: { siteName, stationStatus, currentType, page, size },
    });

    return {
      stations: response.data.stations || [],
      currentPage: response.data.currentPage,
      totalItems: response.data.totalItems,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    throw error.response?.data || "Search failed";
  }
},

  addStation: async (stationData) => {
    try {
      const response = await axiosInstance.post('/services/station/add', stationData);
      return response
    } catch (error) {
      throw error.response.data;
    }
  },
  // getStations: async (params) => {
  //   try {
  //     const response = await axiosInstance.get('/services/station/stationList', { params });
  //     return response;
  //   } catch (error) {
  //     throw error.response.data;
  //   }
  // },

  getStations: async (params) => {
  try {
    const response = await axiosInstance.get('/services/station/stationList', { params });

    return {
      data: response.data.stations || [],
      currentPage: response.data.currentPage,
      totalItems: response.data.totalItems,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    throw error.response?.data || "Failed to fetch stations";
  }
},

  getStationDetails: async (id) => {
    try {
      const response = await axiosInstance.get(`/services/station/stationDetails/${id}`);
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },
  // getProfiles: async (type, params) => {
  //   try {
  //     const response = await axiosInstance.get(`/services/userprofile/table_data/${type}/`, { params });
  //     return response;
  //   } catch (error) {
  //     throw error.response.data;
  //   }
  // },
  unifiedSearch: async (params) => {
  try {
    const response = await axiosInstance.get('/services/userprofile/unified-search', {params});
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to perform unified search' };
  }
},
  
   getOwnerlist: async (params) => {
    try {
      const response = await axiosInstance.get('/services/userprofile/ownerList', { params });
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },
  // addProfile: async (data) => {
  //   try {
  //     const response = await axiosInstance.post('/services/userprofile/add/', data);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || { message: 'Failed to add profile' };
  //   }
  // },

  // Updated getProfiles to handle both whitelabel and driver profiles with new endpoints
  // getProfiles: async (type, params) => {
  //   try {
  //     let endpoint;
      
  //     // Use the appropriate endpoint based on type
  //     if (type === 'whitelabel') {
  //       endpoint = '/services/userprofile/whitelabelList';
  //     } else if (type === 'driver') {
  //       endpoint = '/services/userprofile/driverList';
  //     } else {
  //       // Fallback for any other types
  //       endpoint = '/services/userprofile/table_data/' + type;
  //     }
      
  //     const response = await axiosInstance.get(endpoint, { params });
  //     return response;
  //   } catch (error) {
  //     throw error.response.data;
  //   }
  // },

  getOrganizations: async () => {
    try {
      const response = await axiosInstance.get('/services/orgs/dealer');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch organizations' };
    }
  },

  // updateUserProfile: async (userId, data) => {
  //   try {
  //     const response = await axiosInstance.put(`/services/users/${userId}`, data);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || { message: 'Failed to update user profile' };
  //   }
  // },

  deleteUserProfile: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/services/userprofile/delete/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user profile' };
    }
  },
  
  deleteRfid: async (id) => {
    try {
      const response = await axiosInstance.delete(`/services/rfid/deleteRfidRequest/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete RFID request' };
    }
  },
  searchRfidRequests: async ({ search, page, size, searchField }) => {
  try {
    const response = await axios.get('http://localhost:8800/services/userprofile/unified-search', {
      params: { search, page, size, type: 'rfid', searchField }
    });
    return response.data.rfid; 
  } catch (error) {
    throw error.response?.data || 'Search failed';
  }
},

  // issue related all apis here

  getIssues: async () => {
    try {
      const response = await axiosInstance.get(`/services/issues/tickets?orgId=${localStorage.getItem("orgId")}`);
      // console.log(response.data);
      return response.data;
    } catch (error) {
          throw error.response?.data || new Error('Failed to fetch issues');
    }
  },
   getIssueById: async (id) => {
    try {
      const response = await axiosInstance.get(`/services/issues/tickets/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || new Error("Failed to fetch issue by ID");
    }
  },
  fetchIssueByTicketId : async (ticketId) => {
  try {
    const response = await axiosInstance.get(`/services/issues/${ticketId}`);
    return response;
  } catch (error) {
    console.error("Error fetching issue by ticket ID:", error);
    throw error;
  }
},
getIssuesByStatus : async (params = {}) => {
  const response = await axiosInstance.get('/services/issues/status', {
    params: {
      page: params.page || 0,
      size: params.size || 10,
      sortBy: params.sortBy || 'createdDate',
      orderBy: params.orderBy || 'desc',
      orgId: params.orgId,
      filter: params.filter || null
    }
  });
  return response;
},

  // addIssue: async (issueData) => {
  //   try {
  //     const response = await axiosInstance.post('/services/issues/createticket', issueData);
  //     return response;
  //   } catch (error) {
  //     throw error.response.data;
  //   }
  // },

  addIssue: async (issueData) => {
  try {
    const response = await axiosInstance.post('/services/issues/createticket', issueData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
},


  updateIssue: async (issueData,id) => {
    try {
      const response = await axiosInstance.put(`/services/issues/UpdateTicket/${id}`, issueData);
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },

  deleteIssue: async (id) => {
    try {
      const response = await axiosInstance.delete(`/services/issues/table_data/ticket/${id}`);
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },

  addNoteToTicket: async (id, note) => {
    try {
      const response = await axiosInstance.post(
        `/services/issues/notes/${id}`,
        note
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Failed to add note";
    }
  },

  // Update Note
  updateNote: async (ticketId, noteId, noteDto) => {
    try {
      const response = await axiosInstance.put(
        `/services/issues/${ticketId}/notes/${noteId}`,
        noteDto
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Failed to update note";
    }
  },

  // Delete Note
  deleteNote: async (ticketId, noteId) => {
    try {
      const response = await axiosInstance.delete(
        `/services/issues/${ticketId}/notes/${noteId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Failed to delete note";
    }
  },
  //  untill here issue related apis
  
  getSitesList: async (tablename) => {
    try {
      const response = await axiosInstance.get(`/services/site/getAllByTable?tableName=${tablename}&OrgId=${localStorage.getItem("orgId")}`);
      console.log(localStorage.getItem("orgId"));
    console.log("Sites:", response.data);
         return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

 getStationsList: async (tablename) => {
  try {
    const response = await axiosInstance.get(`/services/site/getAllByTable?tableName=${tablename}&OrgId=${localStorage.getItem("orgId")}`);
    console.log("Stations:", response.data);
    return response.data; // make sure this is the array of stations
  } catch (error) {
    throw error.response?.data || error;
  }
},

  getReportData: async (params) => {
    try {
      const response = await axiosInstance.get('/services/userprofile/getreport', { params });
      // console.log( "Axios:",response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to fetch report data';
    }
  },
  getOcppStations: async () => {
    try {
      const response = await axiosInstance.get('/services/ocpp/station');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  
  sendOcppRequest: async (data) => {
    try {
      const response = await ocppApi.post('/ocpp/request', data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  getFranchiseOwners: async () => {
    try {
      const response = await axiosInstance.get('/services/franchiseOwners');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
 AddChargers: async (formattedData,id) => {
    try {
      const response = await axiosInstance.get(`/services/manufacturer/update${id}`,formattedData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

///////////////////////////////////////////////////////////api adding///////////////////

getRfidRequestsList: async (params) => {
    try {
      const response = await axiosInstance.get('/services/rfid/RequestedRfidList',{params})
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Add to AxiosServices object
requestRfid: async (rfidData,id) => {
  try {
    const response = await axiosInstance.post(`/services/rfid/request/${id}`, rfidData);
    console.log(response);
    return response.data;
  } catch (response) {
    throw response|| error.message || "Failed to submit RFID request";
  }
},

getRfidCard: async (rfid) => {
    try {
      const response = await axiosInstance.get(`/services/rfid/singleRfid/${rfid}`);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch RFID cards' };
    }
  },
  setRfidCard: async (rfid,payload,id) => {
    try {
      const response = await axiosInstance.post(`/services/rfid/update/${rfid}?id=${id}`,payload);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch RFID cards'};
    }
  },
updateRfidStatus: async (rfId) => {
  try {
    const response = await axiosInstance.post(`/services/rfid/toggle-status/${rfId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update RFID status";
  }
},

getRfidRequests: async (userId) => {
  try {
    const response = await axiosInstance.get(`/services/rfid/SingleUserRfid/${userId}`);
    console.log("singleuserdata",response);
    return response;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch RFID requests";
  }
},

addVehicle: async (vehicleData) => {
  try {
    const response = await axiosInstance.post('/api/mobile/addEV', vehicleData);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},
updateVehicle: async (vehicleId, vehicleData) => {
  try {
    const response = await axiosInstance.put(`/api/mobile/updateEV/${vehicleId}`, vehicleData);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

updateUserProfile: async (id, userData) => {
  try {
    const response = await axiosInstance.put(`/services/userprofile/updateUser/${id}`, userData);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log("Axios error:", error);
    // Just re-throw the whole error object
    throw error;
  }
},

updateUser: async (id, userData) => {
  try {
    const response = await axiosInstance.put(`/services/userprofile/updateUser/${id}`, userData);
    console.log(response);
    return response;
  } catch (error) {
    console.log("Axios error:", error);
    // Just re-throw the whole error object
    throw error;
  }
},

getUserDetails: async (userId) => {
    try {
      const response = await axiosInstance.get(`/services/userprofile/userDetails/${userId}`);
      console.log(response);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user details' };
    }
  },

// Add to your AxiosServices object
// getEVUsers: async (page, size,orgId,searchInput) => {
//   try {
//     const response = await axiosInstance.get('/services/userprofile/driverList', {
//       params: {
//         page,
//         size,
//         orgId,
//         search:searchInput,
//       }
//     });
//     console.log(orgId);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data?.message || error.message || "Failed to fetch EV users";
//   }
// },

getEVUsers: async (page, size,orgId,searchInput) => {
  try {
    const response = await axiosInstance.get('/services/userprofile/driverList', {
      params: {
        page,
        size,
        orgId,
        search:searchInput,
      }
    });
    console.log(orgId);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch EV users";
  }
},

// searchEVUser: async ({ search, page, size, searchField }) => {
//   try {
//     const response = await axiosInstance.get('http://localhost:8800/services/userprofile/driverList', {
//       params: { search, page, size, searchField }
//     });
//     return {
//       data: response.data.driverList || [] ,
//       totalElements: response.data.totalElements || 0,
//       totalPages: response.data.totalPages || 1
//     };
//   } catch (error) {
//     throw error.response?.data || error.message || 'Search failed';
//   }
// },

addEVUser: async (userData) => {
  try {
    const response = await axiosInstance.post('/services/userprofile/add', {
      ...userData,
      rolename: "Driver"
    });
    console.log(response);
    return response;
  } catch (response) {
    throw response;
  }
},

// deleteEVUser: async (userId) => {
//   try {
//     const response = await axiosInstance.delete(`/services/userprofile/deleteUser/${userId}`);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data?.message || error.message || "Failed to delete EV user";
//   }
// },

  addWhiteLabel: async (userData) => {
    try {
      const response = await axiosInstance.post('/services/userprofile/add', {
        ...userData,
        rolename: "WhiteLabel"
      });
      return response;
    } catch (response) {
      throw response
  }},
  // deleteWhiteLabel: async (userId) => {
  //   try {
  //     const response = await axiosInstance.delete(`/services/userprofile/deleteUser/${userId}`);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data?.message || error.message || "Failed to delete white label";
  //   }
  // },

  getWhiteLabelDetails: async (userId, orgId) => {
    try {
      const [userResponse, orgResponse] = await Promise.all([
        axiosInstance.get(`/services/userprofile/userDetails/${userId}`),
        axiosInstance.get(`/services/userprofile/userOrgDetails/${orgId}`)
      ]);
      return {
        ...userResponse.data,
        orgDetails: orgResponse.data
      };
    } catch (error) {
      throw error.response?.data?.message || error.message || "Failed to fetch white label details";
    }
  },

  // In your AxiosServices.js file
getFranchiseOwnersByOrg: async (orgId) => {
  try {
    const response = await axiosInstance.get(`/services/userprofile/OwnerDetailsbyOrg/${orgId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch franchise owners";
  }
},

getWhitelabel: async (params) => {
    try {
      const response = await axiosInstance.get('/services/userprofile/whitelabelList', { params });
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },
getWhiteLabels: async () => {
  try {
    const response = await axiosInstance.get('/services/userprofile/getwhiteLabels');
    return response;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch white labels";
  }
},
 addFranchise: async (userData) => {
    try {
      const response = await axiosInstance.post('/services/userprofile/add', {
        ...userData,
        rolename: "FranchiseOwner"
      });
      return response;
    } catch (response) {
      throw response;
    }
  },

getSitesByOrg: async (orgId) => {
  try {
    const response = await axiosInstance.get(`/services/site/siteDetailsbyOrg/${orgId}`);
    return response.data || [];
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch sites";
  }
},

 updateSiteStatus : async (id, newStatus) => {
    try {
      const response = await axiosInstance.put(
        '/services/site/site-operations/edit',
        { id, siteStatus: newStatus }
      );
      return response;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Failed to update status";
    }
  },

  // Fetch manufacturers
 getManufacturers :async () => {
    try {
      const response = await axiosInstance.get('/services/manufacturer/getManufracturer');
      return response.data || [];
    } catch (error) {
      throw error.response?.data?.message || error.message || "Failed to fetch manufacturers";
    }
  },
  searchManufacturers: async (params) => {
  try {
    const response = await axiosInstance.get('services/userprofile/', { params });
    // Example transformation if needed
    return{
   manufacturers: response.data.content || response.data.manufacturers || [],
      totalItems: response.data.totalElements || response.data.totalItems || 0,
      totalPages: response.data.totalPages || 0,
      currentPage: response.data.number || response.data.currentPage || 0,
    };
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to search manufacturers";
  }
},

  // Fetch sites
 getSites :async () => {
    try {
      const response = await axiosInstance.get(`/services/site/getAllByTable?tableName=site&OrgId=${localStorage.getItem("orgId")}`);
      return response.data || [];
    } catch (error) {
      throw error.response?.data?.message || error.message || "Failed to fetch sites";
    }
  },

  // Add a new station
   addStation : async (formData) => {
    try {
      const response = await axiosInstance.post('/services/station/add', formData);
      return response;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Failed to add station";
    }
  },
updateStationStatus :async (stationId, newStatus) => {
    try {
      const response = await axiosInstance.put(
        '/services/station/station_status',
        null, // No body needed for this endpoint
        {
          params: {
            stationId,
            stationStatus: newStatus
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Failed to update station status";
    }
  },
  getStationsByFilters: async (siteName, stationStatus, currentType, page = 0, size = 10) => {
  try {
    const params = new URLSearchParams();
    if (siteName) params.append('siteName', siteName); 
    if (stationStatus) params.append('stationStatus', stationStatus);
    if (currentType) params.append('currentType', currentType);
    params.append('page', page);
    params.append('size', size);

    const response = await axiosInstance.get(`/services/station/search?${params.toString()}`);
    console.log('Filtered stations response:', response);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to fetch stations';
  }
},

getStationStats: async (orgId, config) => {
  try {
    const response = await axiosInstance.get(`/services/dashboard/stationStats/${orgId}`
  //     , {
  //     params : {
  //       ...config.params
  //     }
  //  } 
  );
    return response;
  } catch (error) {
    throw error.response.data;
  }
},

// epmloyee integration here

getAllEmployees : async () => {
  try {
    const response = await axiosInstance.get(`/services/employee/getAllEmployees`);
    return response.data || [];
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch employees";
  }
},

//  getAllEmployees : async () => {
//   try {
//     const response = await axiosInstance.get("/services/employee/getAllEmployees");
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// },

addEmployee: async (employeeData) => {
  try {
    const response = await axiosInstance.post(`/services/employee/addEmployee`, employeeData);
    return response.data;
  }
  catch (error) {
    throw error.response?.data?.message || error.message || "Failed to add employee";
  }
},

getEmployeeById: async (id) => {
  try {
    const response = await axiosInstance.get(`/services/employee/getEmployee/${id}`);
   return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

updateEmployee: async (id, data) => {
  try {
    const response = await axiosInstance.put(`/services/employee/updateEmployee/${id}`, data);
      return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

getEmployeesByDesignation: async (designation) => {
  try {
    const response = await axiosInstance.get(`/services/employee/empByDesignation`, {
      params: { designation }
    });
    return response.data || [];
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch employees by designation";
  }
},

getIssuesByEmployeeId: async (employeeId) => {
  try {
    const response = await axiosInstance.get(`/services/employee/issues/${employeeId}`);
    return response.data || [];
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch employee issues";
  }
},

updateIssueStatus: async (issueId, newStatus) => {
  try {
    const response = await axiosInstance.put(
      `/services/employee/updateIssueStatus/${issueId}`,
      null,
      {
        params: { status: newStatus }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update issue status";
  }
},

getEmployeesPaginated: async (page = 0, size = 10, designation = "", search = "") => {
    try {
      const response = await axiosInstance.get(`/services/employee/employeeList`, {
        params: {
          page,
          size,
          ...(designation && { designation }),
          ...(search && { search }),
        },
      });
      // Backend returns { employees, currentPage, totalItems, totalPages }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Failed to fetch paginated employees";
    }
  },
  
updateIssuePriority: async (issueId, newPriority) => {
  try {
    const response = await axiosInstance.put(
      `/services/employee/updateIssuePriority/${issueId}` , null,
      {
        params: {priority: newPriority}
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update issue priority"; 
  }
},

getResolvedIssues: async () => {
  try {
    const response = await axiosInstance.get(`/services/employee/resolvedIssues`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch resolved issues";
  }
},

getResolvedIssuesByEmployeeId: async (employeeId) => {
  try {
    const response = await axiosInstance.get(
      `/services/employee/resolvedIssues/${employeeId}`
    );
    return response.data || [];
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch resolved issues";
  }
},

//apis for requesting franchsies

requestFranchise: async (requestData) => {
  try {
    // requestData should match backend's RequestedFranchises model
    const response = await axiosInstance.post(
      `/services/station/request-franchise`,
      requestData
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to request franchise/site/station"
    );
  }
},

//fetching data from json
getRequestedFranchises: async (params = {}) => {
  try {
    const response = await axiosInstance.get('/services/station/getstationsjson', { params });
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch requested data";
  }
},

//this is fetching data from db
getRequestedFranchisesList: async (params = {}) => {
  try {
    const response = await axiosInstance.get(
      "/services/station/requestedFranchisesList",
      { params }
    );
    
    console.log('Raw API Response:', response); // Debug log
    
    // Return the data property which contains the actual response
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch requested data"
    );
  }
},

// AxiosServices.jsx
getStationsRequest: async ({ latitude, longitude, radiusKm, nameFilter, fromAddress, toAddress, search }) => {
  try {
    const params = { latitude, longitude, radiusKm, nameFilter, fromAddress, toAddress, search };
    const response = await axiosInstance.get("/services/station/getstationsjson", { params });
    return response.data; // array of stations
  } catch (error) {
    throw error.response?.data || error.message || "Failed to fetch stations";
  }
},

//apis for adding notes to an issue

addIssueNote: async (noteData) => {
  try {
    // noteData is the same shape as your backend DTO:
    // {
    //   employeeId, recipientId, issueId,
    //   title, description, createdByRole
    // }
    const response = await axiosInstance.post(
      `/services/notes/add`,
      noteData
    );
    return response.data; // backend returns { message: "Note added successfully with ID: ..." }
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to add note";
  }
},

// Get all notes for a specific issue
getNotesByIssueId: async (issueId) => {
  try {
    const response = await axiosInstance.get(`/services/notes/issue/${issueId}`);
    // backend returns an array of Notes
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch notes for this issue"
    );
  }
},

updateNote: async (noteId, data) => {
  try {
    const response = await axiosInstance.put(`/services/notes/update/${noteId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update note";
  }
},

//pavan's apis added here 

 updateTeam : async (id, teamData) => {
  try {
    const response = await axiosInstance.put(`/services/employee/updateEmployee/${id}`, teamData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

 deleteTeam : async (id) => {
  try {
    const response = await axios.delete(`/services/employee/deleteEmployee/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

 assignTask : async (taskData) => {
  try {
    const response = await axiosInstance.post('/tasks/assignTask', taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

 updateTaskProgress : async (teamId, taskName, progress) => {
  try {
    const response = await axios.put(`/services/employee/${teamId}/updateTask`, {
      name: taskName,
      progress: progress
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

// Technician APIs integrated by pavan
 getTechnicianById : async (id) => {
  try {
    const response = await axios.get(`/services/employee/getEmployees/${id}`);
    console.log("Technician API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching technician:", error);
    throw error.response?.data || error.message;
  }
},

updateTechnician : async (id, technicianData) => {
  try {
    const response = await axiosInstance.put(`/services/employee/updateEmployee/${id}`, technicianData);
    console.log("Update technician response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating technician:", error);
    throw error.response?.data || error.message;
  }
},

 getTechnicianJobs : async (technicianId) => {
  try {
    const response = await axios.get(`/services/jobs/technician/${technicianId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching technician jobs:", error);
    throw error.response?.data || error.message;
  }
},

 getTechnicianStats : async (technicianId) => {
  try {
    const response = await axios.get(`/services/dashboard/technician-stats/${technicianId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching technician stats:", error);
    throw error.response?.data || error.message;
  }
},

 getTasksByEmployee : async (employeeId) => {
  try {
    const response = await axiosInstance.get(`/tasks/employee/${employeeId}/tasks`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

 getTaskCount : async () => {
  try {
    const response = await axiosInstance.get("/tasks/count");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

 getTaskCountByEmployee : async (employeeId) => {
  try {
    const response = await axiosInstance.get(`/tasks/employee/${employeeId}/count`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

// pavan's backend related api

 getEmployeesByDesignation : async (designation) => {
  try {
    const response = await axiosInstance.get(`/services/employee/empByDesignation`, {
      params: { designation },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

 getEmployeeTasks : async (employeeId) => {
  try {
    const response = await axiosInstance.get(`/tasks/employee/${employeeId}/tasks`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

// for updateTaskStatus....

 updateTaskStatusAPI : async (taskId, status) => {
  try {
    const response = await axiosInstance.put(`/tasks/${taskId}/status`, null, {
      params: { status }
    });
    console.log(status)
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},


//For The Task Notes....
 getNotesByTaskId : async (taskId) => {
  try {
    const response = await axiosInstance.get(`/services/notes/task/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Get notes by task error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
},

// Add a new note for a task
 addNoteToTask : async (noteData) => {
  try {
    const response = await axiosInstance.post('/services/notes/add', noteData);
    return response.data;
  } catch (error) {
    console.error('Add note error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
},

// Update a note
 updateNote : async (noteId, noteData) => {
  try {
    const response = await axiosInstance.put(`/services/notes/update/${noteId}`, noteData);
    return response.data;
  } catch (error) {
    console.error('Update note error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
},

// Delete a note
 deleteNote : async (noteId) => {
  try {
    const response = await axiosInstance.delete(`/services/notes/delete/${noteId}`);
    return response.data;
  } catch (error) {
    console.error('Delete note error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
},

// Get note by ID
 getNoteById : async (noteId) => {
  try {
    const response = await axiosInstance.get(`/services/notes/${noteId}`);
    return response.data;
  } catch (error) {
    console.error('Get note by ID error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
},

//for chargerInstallationTeam pagination..

 getPaginatedEmployees : async ({ page = 0, size = 10, search = '', designation = '' }) => {
  try {
    const response = await axiosInstance.get(`services/employee/employeeList`, {
      params: { page,
                size, 
                search, 
                designation:"charger installer", }
    });
    return response.data; 
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

// for techncian pagination and search..
 getPaginatedTasks : async ({ page = 0, size = 10, search = '', status = '', employeeId }) => {
  try {
    const response = await axiosInstance.get(`/tasks/paged`, {
      params: { page, size, search, status, employeeId } 
    });
    return response.data;   
  } catch (error) {
    throw error.response?.data || error.message;
  }
},


// Fleet APIs integrated  by pavan......
 getAllFleets : async (params = {}) => {
  try {
    const response = await axiosInstance.get('/services/fleet/getAllFleets', { params });
    return response.data;
  } catch (error) {
    console.error('Get all fleets error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
},
 getFleetDetails : async (id) => {
  try {
    const response = await axiosInstance.get(`/services/fleet/fleetDetails/${id}`);
    console.log("fleet from axios", response.data);
    return response.data;  
  } catch (error) {
    console.error('Get fleet details error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
},

 addFleet : async (fleetData) => {
  try {
    console.log('API - Sending fleet data:', fleetData);
    const response = await axiosInstance.post('/services/fleet/addFleet', fleetData);
    console.log('API - Fleet added successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('API - Add fleet error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error.response?.data || error.message;
  }
},

 updateFleet : async (id, fleetData) => {
  try {
    const response = await axiosInstance.put(`/services/fleet/edit/${id}`, fleetData);
    return response.data;
  } catch (error) {
    console.error('Update fleet error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
},

 deleteFleet : async (id) => {
  try {
    const response = await axiosInstance.delete(`/services/fleet/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete fleet error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
},

 getFleetVehicles : async (fleetId) => {
  try {
    const response = await axiosInstance.get(`/services/fleet/${fleetId}/vehicles`);
    
    console.log("Fleet vehicles API response:", response.data);
    
    return response.data;
  } catch (error) {
    console.error('Get fleet vehicles error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
},

 addVehicleToFleet : async (fleetId, vehicleData) => {
  try {
    const response = await axiosInstance.post(`/services/fleet/${fleetId}/addVehicle`, vehicleData);
    return response.data;
  } catch (error) {
    console.error('Add vehicle error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
},

 getVehicleDetails : async (vehicleId) => {
  try {
    const response = await axiosInstance.get(`/services/fleet/vehicle/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error('Get vehicle details error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
},

 updateVehicle : async (vehicleId, vehicleData) => {
  try {
    const response = await axiosInstance.put(`/services/fleet/update/${vehicleId}`, vehicleData);
    return response.data;
  } catch (error) {
    console.error('Update vehicle error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
},

 deleteVehicleFromFleet : async (fleetId, vehicleId) => {
  try {
    const response = await axiosInstance.delete(`/services/fleet/${fleetId}/vehicle/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error('Delete vehicle error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
},

// for all employees tasks..........
getAllTasks: async ({ page = 0, size = 10, search = '' } = {}) => {
  try {
    const response = await axiosInstance.get(`/tasks/allTasks`, {
      params: { page, size, search }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},


};
////////////////////////////////////////////////////////api adding//////////////////////////

AxiosServices.getDashboardStats = async (orgId, config = {}) => {
  try {
    const response = await axiosInstance.get(`/services/dashboard/stats/${orgId}`, {
      params: {
        ...config.params
      }
    });
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

AxiosServices.getRevenueGraph = async (orgId, config = {}) => {
  try {
    const response = await axiosInstance.get(`/services/dashboard/revenueGraph/${orgId}`, {
      params : {
        ...config.params
      }
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

AxiosServices.getSessionGraph = async (orgId, config) => {
  try {
    const response = await axiosInstance.get(`/services/dashboard/sessionGraph/${orgId}`, {
      params : {
        ...config.params
      }
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

//i removed this for not gettign dashboard stats and replaced (sukanya) 
// AxiosServices.getStationStats = async (orgId, config) => {
//   try {
//     const response = await axiosInstance.get(`/services/dashboard/stationStats/${orgId}`
//   //     , {
//   //     params : {
//   //       ...config.params
//   //     }
//   //  } 
//   );
//     return response;
//   } catch (error) {
//     throw error.response.data;
//   }
// };

// pavan's apis added for fleet and charger installation and tasks

// Fleet APIs integrated  by pavan......
export const getAllFleets = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/services/fleet/getAllFleets', { params });
    return response.data;
  } catch (error) {
    console.error('Get all fleets error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
export const getFleetDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`/services/fleet/fleetDetails/${id}`);
    console.log("fleet from axios", response.data);
    return response.data;  
  } catch (error) {
    console.error('Get fleet details error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const addFleet = async (fleetData) => {
  try {
    console.log('API - Sending fleet data:', fleetData);
    const response = await axiosInstance.post('/services/fleet/addFleet', fleetData);
    console.log('API - Fleet added successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('API - Add fleet error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error.response?.data || error.message;
  }
};

export const updateFleet = async (id, fleetData) => {
  try {
    const response = await axiosInstance.put(`/services/fleet/edit/${id}`, fleetData);
    return response.data;
  } catch (error) {
    console.error('Update fleet error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const deleteFleet = async (id) => {
  try {
    const response = await axiosInstance.delete(`/services/fleet/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete fleet error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getFleetVehicles = async (fleetId) => {
  try {
    const response = await axiosInstance.get(`/services/fleet/${fleetId}/vehicles`);
    
    console.log("Fleet vehicles API response:", response.data);
    
    return response.data;
  } catch (error) {
    console.error('Get fleet vehicles error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const addVehicleToFleet = async (fleetId, vehicleData) => {
  try {
    const response = await axiosInstance.post(`/services/fleet/${fleetId}/addVehicle`, vehicleData);
    return response.data;
  } catch (error) {
    console.error('Add vehicle error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getVehicleDetails = async (vehicleId) => {
  try {
    const response = await axiosInstance.get(`/services/fleet/vehicle/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error('Get vehicle details error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const updateVehicle = async (vehicleId, vehicleData) => {
  try {
    const response = await axiosInstance.put(`/services/fleet/update/${vehicleId}`, vehicleData);
    return response.data;
  } catch (error) {
    console.error('Update vehicle error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const deleteVehicleFromFleet = async (fleetId, vehicleId) => {
  try {
    const response = await axiosInstance.delete(`/services/fleet/${fleetId}/vehicle/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error('Delete vehicle error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
// ChargerInstallationTeam Api's integrated by pavan.......

export const createTeam = async (teamData) => {
  try {
    const response = await axiosInstance.post('/services/employee/addEmployee', teamData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateTeam = async (id, teamData) => {
  try {
    const response = await axiosInstance.put(`/services/employee/updateEmployee/${id}`, teamData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteTeam = async (id) => {
  try {
    const response = await axios.delete(`/services/employee/deleteEmployee/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const assignTask = async (taskData) => {
  try {
    const response = await axiosInstance.post('/tasks/assignTask', taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateTaskProgress = async (teamId, taskName, progress) => {
  try {
    const response = await axios.put(`/services/employee/${teamId}/updateTask`, {
      name: taskName,
      progress: progress
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Technician APIs integrated by pavan
export const getTechnicianById = async (id) => {
  try {
    const response = await axios.get(`/services/employee/getEmployees/${id}`);
    console.log("Technician API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching technician:", error);
    throw error.response?.data || error.message;
  }
};

export const updateTechnician = async (id, technicianData) => {
  try {
    const response = await axiosInstance.put(`/services/employee/updateEmployee/${id}`, technicianData);
    console.log("Update technician response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating technician:", error);
    throw error.response?.data || error.message;
  }
};

export const getTechnicianStats = async (technicianId) => {
  try {
    const response = await axios.get(`/services/dashboard/technician-stats/${technicianId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching technician stats:", error);
    throw error.response?.data || error.message;
  }
};

export const getTasksByEmployee = async (employeeId) => {
  try {
    const response = await axiosInstance.get(`/tasks/employee/${employeeId}/tasks`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTaskCount = async () => {
  try {
    const response = await axiosInstance.get("/tasks/count");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTaskCountByEmployee = async (employeeId) => {
  try {
    const response = await axiosInstance.get(`/tasks/employee/${employeeId}/count`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getEmployeeTasks = async (employeeId) => {
  try {
    const response = await axiosInstance.get(`/tasks/employee/${employeeId}/tasks`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// for updateTaskStatus....

export const updateTaskStatusAPI = async (taskId, status) => {
  try {
    const response = await axiosInstance.put(`/tasks/${taskId}/status`, null, {
      params: { status }
    });
    console.log(status)
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Note-related APIs
export const getEmployeeNotes = async (employeeId) => {
  try {
    const response = await axiosInstance.get(`/api/notes/employee/${employeeId}`);
    console.log("notes",response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createAdminNote = async (adminId, employeeId, title, description, taskId = null) => {
  try {
    const response = await axiosInstance.post(`/api/notes/admin/create`, null, {
      params: {
        adminId,
        employeeId,
        title,
        description,
        taskId: taskId || null,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const replyToEmployeeNote = async (originalNoteId, employeeId, description) => {
  try {
    const response = await axiosInstance.post(`/api/notes/employee/reply`, null, {
      params: {
        originalNoteId,
        employeeId,
        description,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getConversationThreadAPI = async (parentNoteId) => {
  try {
    const response = await axiosInstance.get(`/api/notes/conversation/${parentNoteId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markNoteAsReadAPI = async (noteId, employeeId) => {
  try {
    const response = await axiosInstance.put(`/api/notes/mark-as-read/${noteId}`, null, {
      params: { employeeId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
//.................................................................

AxiosServices.getPortStats = async (orgId,config) => {
  try {
    const response = await axiosInstance.get(`/services/dashboard/portStats/${orgId}`
      //     , {
  //     params : {
  //       ...config.params
  //     }
  //  } 
    );
     console.log(' ports stats ',response)
    return response;
   
  } catch (error) {
    throw error.response.data;
  }
};

  ///// new api adding before the deploy 
 export const getVehicles = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/mobile/myEV/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

{/* <ValidationRoute logindata={loginUser}/> */}
export default AxiosServices;
//LATEST PORTAL........