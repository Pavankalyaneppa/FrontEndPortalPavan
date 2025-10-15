
// const safeStringValidation = (value, fieldName = 'Field') => {
//   if (value === undefined || value === null) {
//     return `${fieldName} is required`;
//   }
  
//   if (typeof value !== 'string') {
//     if (typeof value === 'number' || typeof value === 'boolean') {
//       value = String(value);
//     } else {
//       return `${fieldName} must be a string`;
//     }
//   }
  
//   const trimmed = value.trim();
//   if (!trimmed) {
//     return `${fieldName} is required`;
//   }
  
//   return null; 
// };

// export const validateName = (value) => {
//   const error = safeStringValidation(value, 'Name');
//   if (error) return error;
  
//   const trimmed = value.trim();
//   if (trimmed.length < 3) return 'Name must be at least 3 characters';
//   if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(trimmed)) {
//     return "Name should contain only letters and single spaces between words";
//   }
//   return "";
// };

// export const validateMobileNumber = (value) => {
//   const error = safeStringValidation(value, 'Mobile number');
//   if (error) return error;

//   const trimmedValue = value.trim();
  
//   if (/^\d{10}\D+/.test(trimmedValue)) {
//     return "Mobile number should contain only digits after the first 10 digits";
//   }

//   const digitsOnly = trimmedValue.replace(/\D/g, '');
// if (/\D/.test(trimmedValue)) {
//     return "Mobile number should contain only digits";
//   }
//   if (digitsOnly.length !== 10) {
//     return "Mobile number must be exactly 10 digits";
//   }

//   if (!/^[6-9]/.test(digitsOnly)) {
//     return "Mobile number must start with 6, 7, 8, or 9";
//   }

//   if (/^(\d)\1{9}$/.test(digitsOnly)) {
//     return "Mobile number cannot be all the same digit";
//   }

//   if (/^(\d{3})\1{2}$/.test(digitsOnly)) {
//     return "Mobile number contains repeating patterns";
//   }

//   const invalidPrefixes = ['666', '777', '888', '999', '555', '444', '333', '222'];
//   const prefix = digitsOnly.substring(0, 3);
//   if (invalidPrefixes.includes(prefix)) {
//     return "This mobile number prefix is not valid";
//   }

//   return "";
// };
// export const validateCity = (value) => {
//   const error = safeStringValidation(value, 'City');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   if (trimmedValue.length < 2) return "City name is too short";
//   if (trimmedValue.length > 85) return "City name is too long (max 85 characters)";
//   if (!/^[\p{L}\s'-.]*$/u.test(trimmedValue)) return "City name contains invalid characters";
//   if (/^[-'.]|[-'.]$/.test(trimmedValue)) return "City name cannot start or end with special characters";
//   if (/['-.]{2,}/.test(trimmedValue)) return "City name cannot have consecutive special characters";
//   if (/\d/.test(trimmedValue)) return "City name cannot contain numbers";
//   if (/^[A-Za-z]{1}$/.test(trimmedValue)) return "City name is too short";
//   if (/([A-Za-z])\1{3,}/i.test(trimmedValue)) return "City name has too many repeating characters";

//   const invalidNames = ['test', 'unknown', 'na', 'n/a', 'null', 'undefined', 'xxxx', 'aaaa'];
//   if (invalidNames.includes(trimmedValue.toLowerCase())) {
//     return "Please enter a valid city name";
//   }

//   return ""; 
// };

// export const validateZipCode = (value) => {
//   if (typeof value !== 'string') return "Zip code must be a string";
  
//   const trimmedValue = value.trim();
//   if (!trimmedValue) return "Zip code is required";
  
//   if (/[^0-9]/.test(trimmedValue)) return "Zip code must contain only numbers";
  
//   if (trimmedValue.length !== 6) return "Zip code must be exactly 6 digits";
  
//   if (/^0{6}$/.test(trimmedValue)) return "Zip code cannot be all zeros";
//   if (/^0/.test(trimmedValue)) return "Zip code cannot start with zero";
//   if (/^(\d)\1{5}$/.test(trimmedValue)) return "Zip code cannot be all the same digit";
//   if (/^(\d{3})\1$/.test(trimmedValue)) return "Zip code cannot have repeating 3-digit patterns";
  
//   const firstDigit = trimmedValue.charAt(0);
//   if (firstDigit === '0') return "Invalid zip code format for this region";
  
//   const fakeZipCodes = ['123456', '654321', '111111', '999999', '010101'];
//   if (fakeZipCodes.includes(trimmedValue)) return "This appears to be a test zip code";
  
//   return ""; 
// };

// export const validateEmail = (value) => {
//   const error = safeStringValidation(value, 'Email');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
//   if (!emailRegex.test(trimmedValue)) return "Invalid email format";
//   if (/\.\./.test(trimmedValue)) return "Email cannot contain consecutive dots";
  
//   const [local, domain] = trimmedValue.split("@");
//   if (local?.startsWith(".") || local?.endsWith(".") || domain?.startsWith(".") || domain?.endsWith(".")) {
//     return "Email cannot start or end with a dot";
//   }
  
//   return "";
// };

// export const validateUsername = (value) => {
//   const error = safeStringValidation(value, 'Username');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   if (trimmedValue.length < 2) return "Username must be at least 2 characters";
//   if (trimmedValue.length > 30) return "Username cannot exceed 30 characters";
//   if (!/^[a-zA-Z0-9_\-]+(?: [a-zA-Z0-9_\-]+)*$/.test(trimmedValue)) {
//     return "Username can only contain letters, numbers, underscores, and single hyphens";
//   }
//   if (/^[-_]|[-_]$/.test(trimmedValue)) return "Username cannot start or end with special characters";
//   if (/[-_]{2,}/.test(trimmedValue)) return "Username cannot have consecutive special characters";
//   if (/^\d+$/.test(trimmedValue)) return "Username cannot be all numbers";
//   if (/^[0-9]/.test(trimmedValue)) return "Username cannot start with a number";
//   if (/([a-zA-Z0-9])\1{3,}/i.test(trimmedValue)) return "Username has too many repeating characters";

//   const restrictedWords = ['admin', 'root', 'system', 'null', 'undefined', 'guest', 'anonymous'];
//   if (restrictedWords.includes(trimmedValue.toLowerCase())) return "This username is not allowed";
//   if (/^[A-Z]+$/.test(trimmedValue)) return "Username cannot be all uppercase letters";

//   return ""; 
// };

// // export const validateConnectorType = (value) => {
// //   const error = safeStringValidation(value, 'Connector type');
// //   if (error) return error;

// //   const trimmedValue = value.trim();
// //   const validConnectorTypes = [
// //     'AC', 'DC'];

// //   if (/[^a-zA-Z0-9 /-]/.test(trimmedValue)) {
// //     return "Only letters, numbers, spaces, hyphens and forward slashes are allowed";
// //   }
// //   if (/\s{2,}/.test(trimmedValue)) return "Multiple consecutive spaces are not allowed";
// //   if (/^[ /-]|[ /-]$/.test(trimmedValue)) return "Cannot start or end with special characters";
  
// //   const isKnownType = validConnectorTypes.some(type => 
// //     trimmedValue.toLowerCase().includes(type.toLowerCase())
// //   );

// //   if (!isKnownType) {
// //     return `Unknown connector type. Common types: ${validConnectorTypes.slice(0, 5).join(', ')}...`;
// //   }
// //   if (trimmedValue.length > 30) return "Connector type should not exceed 30 characters";
  
// //   return "";
// // };


// export const validateConnectorType = (value) => {
//   const error = safeStringValidation(value, 'Connector type');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   const validConnectorTypes = [
//     'Type 1', 'J1772',        // AC (North America/Japan)
//     'Type 2', 'Mennekes',     // AC (Europe/Global)
//     'CCS1',                   // DC Fast (North America)
//     'CCS2',                   // DC Fast (Europe/Global)
//     'CHAdeMO',                // DC Fast (Japan/Legacy)
//     'GB/T',                   // DC Fast (China)
//     'NACS', 'Tesla'          // Tesla connector (now open standard)
//   ];

//   // Case-insensitive check (allows "type 2", "Type 2", "CCS2", etc.)
//   const normalizedValue = trimmedValue.toLowerCase();
//   const isValid = validConnectorTypes.some(
//     type => type.toLowerCase() === normalizedValue
//   );

//   if (!isValid) {
//     return `Invalid connector type. Valid types: ${validConnectorTypes.join(', ')}`;
//   }

//   return "";
// };

// export const validateVIN = (value) => {
//   const error = safeStringValidation(value, 'VIN');
//   if (error) return error;

//   const trimmedValue = value.trim().toUpperCase();
//   if (!/^[A-HJ-NPR-Z0-9]{11,17}$/i.test(trimmedValue)) {
//     return "VIN should be 11-17 characters, letters (except I,O,Q) and digits only";
//   }
//   return "";
// };

// export const validateRegistrationNo = (value) => {
//   const error = safeStringValidation(value, 'Registration number');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   if (!/^[a-zA-Z0-9\s\-]+$/.test(trimmedValue)) {
//     return "Registration No should contain only letters, digits, spaces, or hyphens";
//   }
//   return "";
// };

// export const validateMake = (value) => {
//   const error = safeStringValidation(value, 'Make');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   if (!/^[a-zA-Z0-9\s\-]+$/.test(trimmedValue)) {
//     return "Make should contain only letters, digits, spaces, or hyphens";
//   }
//   return "";
// };

// export const validateModel = (value) => {
//   const error = safeStringValidation(value, 'Model');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   if (!/^[a-zA-Z0-9\s\-]+$/.test(trimmedValue)) {
//     return "Model should contain only letters, digits, spaces, or hyphens";
//   }
//   return "";
// };

// export const validateVehicleType = (value) => {
//   const error = safeStringValidation(value, 'Vehicle type');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   if (!/^[a-zA-Z0-9\s\-]+$/.test(trimmedValue)) {
//     return "Vehicle Type should contain only letters, digits, spaces, or hyphens";
//   }
//   return "";
// };

// export const validateManufacturerName = (value) => {
//   const error = safeStringValidation(value, 'Manufacturer name');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(trimmedValue)) {
//     return "Manufacturer name should contain only letters and single spaces between words";
//   }
//   return "";
// };


// export const validateIDName = (value) => {
//   const error = safeStringValidation(value, 'IssueTracker ID');
//   if (error) return error;

//   const trimmedValue = value.trim();
  
//   if (!/^[a-zA-Z0-9]+$/.test(trimmedValue)) {
//     return "IssueTracker ID can only contain letters and numbers (no spaces or special characters)";
//   }

//   if (trimmedValue.length < 3) {
//     return "IssueTracker ID must be at least 3 characters long";
//   }

//   if (trimmedValue.length > 20) {
//     return "IssueTracker ID cannot exceed 20 characters";
//   }

//   if (!/[0-9]/.test(trimmedValue)) {
//     return "IssueTracker ID must contain at least one number";
//   }

//   if (!/[a-zA-Z]/.test(trimmedValue)) {
//     return "IssueTracker ID must contain at least one letter";
//   }

//   return "";
// };

// export const validateManufacturerCountry = (value) => {
//   const error = safeStringValidation(value, 'Manufacturer country');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(trimmedValue)) {
//     return "Country should contain only letters";
//   }
//   return "";
// };

// export const validateChargerType = (value) => {
//   const error = safeStringValidation(value, 'Charger type');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   const validChargerTypes = [
//     'AC', 'Alternating Current', 'DC', 'Direct Current', 'Fast Charger', 
//     'Rapid Charger', 'Level 1', 'L1', 'Level 2', 'L2', 'Level 3', 'L3', 
//     'DCFC', 'Ultra Fast', 'High Power', 'Bidirectional', 'V2G', 
//     'Vehicle-to-Grid', 'Wireless', 'Inductive'
//   ];

//   if (/[^a-zA-Z0-9 /-]/.test(trimmedValue)) {
//     return "Only letters, numbers, spaces, and hyphens are allowed";
//   }
//   if (/\s{2,}/.test(trimmedValue)) return "Multiple consecutive spaces are not allowed";
//   if (/^[ /-]|[ /-]$/.test(trimmedValue)) return "Cannot start or end with special characters";
  
//   const isKnownType = validChargerTypes.some(type => 
//     new RegExp(`\\b${type}\\b`, 'i').test(trimmedValue)
//   );

//   if (!isKnownType) {
//     const commonTypes = ['AC', 'DC', 'Level 2', 'DCFC', 'V2G'];
//     return `Unknown charger type. Common types: ${commonTypes.join(', ')}`;
//   }
//   if (trimmedValue.length > 30) return "Charger type should not exceed 30 characters";
//   if (/\bLevel\s*[1-3]\b/i.test(trimmedValue)) {
//     const level = trimmedValue.match(/\bLevel\s*([1-3])\b/i)[1];
//     if (level === '1' && /DC|Fast|Rapid/i.test(trimmedValue)) {
//       return "Level 1 chargers are always AC";
//     }
//     if (level === '3' && /AC/i.test(trimmedValue)) {
//       return "Level 3 implies DC fast charging";
//     }
//   }

//   return "";
// };




// export const validateTotalCapacity = (value) => {
//   if (value === null || value === undefined) return 'Total capacity is required';
  
//   const stringValue = value?.toString() || '';
//   const trimmedValue = stringValue.trim();
//   if (!trimmedValue) return 'Total capacity is required';
  
//   const num = Number(trimmedValue);
//   if (isNaN(num)) return 'Must be a valid number';
//   if (num <= 0) return 'Must be greater than 0';
  
//   return '';
// };

// export const validateCurrentType = (value) => {
//   const error = safeStringValidation(value, 'Current type');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   const validTypes = [
//     'AC', 'DC', 'AC SINGLE PHASE', 'AC THREE PHASE',
//     'AC SINGLE-PHASE', 'AC THREE-PHASE', 'ALTERNATING CURRENT', 
//     'DIRECT CURRENT', 'SINGLE PHASE AC', 'THREE PHASE AC'
//   ];

//   const normalizedInput = trimmedValue
//     .toUpperCase()
//     .replace(/\s+/g, ' ')      
//     .replace(/-/g, ' ')         
//     .replace(/\bAC\b/g, 'AC')   
//     .replace(/\bDC\b/g, 'DC')   
//     .trim();
    
//   const isValid = validTypes.some(type => 
//     type === normalizedInput || 
//     type.replace(/-/g, ' ') === normalizedInput
//   );

//   if (!isValid) {
//     const commonExamples = ['AC', 'DC', 'AC Single Phase', 'AC Three Phase'];
//     return `Invalid current type. Valid examples: ${commonExamples.join(', ')}`;
//   }
//   if (/PHASE/i.test(normalizedInput) && !/AC/i.test(normalizedInput)) {
//     return "Phase specification only applies to AC current";
//   }
//   if (/DC/i.test(normalizedInput) && /PHASE/i.test(normalizedInput)) {
//     return "DC current cannot have phase specification";
//   }

//   return ""; 
// };

// export const validatePortCapacity = (value) => {
//   if (value === null || value === undefined) return 'Port capacity is required';
  
//   const stringValue = String(value).trim();
//   if (!stringValue) return 'Port capacity is required';
  
//   const num = Number(stringValue);
//   if (isNaN(num)) return 'Must be a valid number';
//   if (num <= 0) return 'Must be greater than 0';
  
//   return '';
// };

// export const validateSiteName = (value) => {
//   const error = safeStringValidation(value, 'Site name');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   const stationNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
//   if (!stationNameRegex.test(trimmedValue)) {
//     return 'Site name can only contain letters, numbers, spaces, hyphens, and underscores';
//   }
//   if (trimmedValue.length > 50) {
//     return 'Site name must be 50 characters or less';
//   }
//   return "";
// };

// export const validateManagerName = (value) => {
//   const error = safeStringValidation(value, 'Manager name');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(trimmedValue)) {
//     return "Manager name should contain only letters and single spaces between words";
//   }
//   return "";
// };

// export const validateManagerEmail = (value) => {
//   const error = safeStringValidation(value, 'Manager email');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
//   if (!emailRegex.test(trimmedValue)) return "Invalid email format";
//   if (/\.\./.test(trimmedValue)) return "Email cannot contain consecutive dots";
  
//   const [local, domain] = trimmedValue.split("@");
//   if (local?.startsWith(".") || local?.endsWith(".") || domain?.startsWith(".") || domain?.endsWith(".")) {
//     return "Email cannot start or end with a dot";
//   }
  
//   return "";
// };

// export const validatePortDisplayName = (value) => {
//   const error = safeStringValidation(value, 'Port display name');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   if (!/^[a-zA-Z0-9\s-]+$/.test(trimmedValue)) {
//     return "Port display name should only contain letters, numbers, spaces, and hyphens";
//   }
//   if (trimmedValue.length > 50) {
//     return "Port display name must be 50 characters or less";
//   }
//   return "";
// };

// export const validateManagerPhone = (value) => {
//   const error = safeStringValidation(value, 'Manager phone');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   const mobileRegex = /^[6-9]\d{9}$/;
//   if (!mobileRegex.test(trimmedValue)) {
//     return 'Mobile Number must start with 6, 7, 8, or 9 and be 10 digits';
//   }
//   return "";
// };

// export const validateStationName = (value) => {
//   const error = safeStringValidation(value, 'Station name');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   const stationNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
//   if (!stationNameRegex.test(trimmedValue)) {
//     return 'Station name can only contain letters, numbers, spaces, hyphens, and underscores';
//   }
//   if (trimmedValue.length > 50) {
//     return 'Station name must be 50 characters or less';
//   }
//   return "";
// };

// export const validateOcppId = (value) => {
//   const error = safeStringValidation(value, 'OCPP ID');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   const ocppIdRegex = /^[a-zA-Z0-9\-_]{1,36}$/;  
//   if (!ocppIdRegex.test(trimmedValue)) {
//     return 'OCPP ID must be 1-36 characters (letters, numbers, hyphens, or underscores)';
//   }
//   return "";
// };

// export const validateSerialNumber = (value) => {
//   const error = safeStringValidation(value, 'Serial number');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   const serialRegex = /^[a-zA-Z0-9\-]{6,20}$/;
//   if (!serialRegex.test(trimmedValue)) {
//     return 'Serial number must be 6-20 characters (letters, numbers, or hyphens)';
//   }
//   return "";
// };

// export const validateFirmwareVersion = (value) => {
//   const error = safeStringValidation(value, 'Firmware version');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   const versionRegex = /^\d+(\.\d+){0,2}$/;
//   if (!versionRegex.test(trimmedValue)) {
//     return 'Firmware version must be in format X.Y or X.Y.Z (numbers separated by dots)';
//   }
//   return "";
// };

// export const validateVoltageRange = (value) => {
//   if (value === null || value === undefined || value === '') {
//     return "Voltage range is required";
//   }

//   if (typeof value === 'number') {
//     if (value <= 0) return "Voltage must be positive";
//     if (value > 1000) return "Voltage too high (max 1000V)";
//     return "";
//   }

//   if (typeof value === 'string') {
//     const trimmedValue = value.trim();
//     if (!trimmedValue) return "Voltage range is required";
    
//     const voltageRegex = /^(\d{1,3}(?:\.\d{1,2})?(?:\s*-\s*\d{1,3}(?:\.\d{1,2})?)?(?:\s*V(?:\s*AC)?)?$)/i;
//     if (!voltageRegex.test(trimmedValue)) {
//       return 'Valid formats: "220", "220V", "100-240", "100-240V AC"';
//     }

//     const numbers = trimmedValue.match(/\d+(?:\.\d+)?/g) || [];
//     const minVoltage = parseFloat(numbers[0]);
//     const maxVoltage = numbers[1] ? parseFloat(numbers[1]) : null;

//     if (minVoltage <= 0) return "Voltage must be positive";
//     if (minVoltage > 1000) return "Voltage too high (max 1000V)";
//     if (maxVoltage && maxVoltage <= minVoltage) {
//       return "Max voltage must be greater than min voltage";
//     }
//   }

//   return "";
// };

// export const validateTimezone = (value) => {
//   if (!value || typeof value !== 'string') {
//     return 'Timezone is required';
//   }

//   const trimmedValue = value.trim();
  
//   // List of common timezone abbreviations to accept
//   const validAbbreviations = [
//     'IST', 'UTC', 'GMT', 'EST', 'EDT', 'CST', 'CDT', 
//     'MST', 'MDT', 'PST', 'PDT', 'AEST', 'AEDT', 'BST', 
//     'CET', 'CEST', 'EET', 'EEST', 'WET', 'WEST'
//   ];

//   // IANA timezone format validation (Region/City)
//   const ianaRegex = /^[A-Za-z_]+\/[A-Za-z_]+(\/[A-Za-z_]+)*$/;
  
//   // UTC/GMT offset format validation
//   const utcRegex = /^(UTC|GMT)([\+\-]\d{1,2}(:\d{2})?)?$/i;

//   // Check if value matches any valid format
//   if (
//     validAbbreviations.includes(trimmedValue) || 
//     ianaRegex.test(trimmedValue) || 
//     utcRegex.test(trimmedValue)
//   ) {
//     return ""; // No error - valid timezone
//   }

//   return 'Timezone must be a valid abbreviation (e.g., IST, UTC) or IANA format (e.g., America/New_York)';
// };

// export const validateLatitude = (value) => {
//   if (value === null || value === undefined || value === '') {
//     return "Latitude is required";
//   }

//   const num = Number(value);
//   if (isNaN(num)) return "Latitude must be a number";
//   if (num < -90 || num > 90) return "Latitude must be between -90 and 90";
//   return "";
// };

// export const validateLongitude = (value) => {
//   if (value === null || value === undefined || value === '') {
//     return "Longitude is required";
//   }

//   const num = Number(value);
//   if (isNaN(num)) return "Longitude must be a number";
//   if (num < -180 || num > 180) return "Longitude must be between -180 and 180";
//   return "";
// };

// export const validateForm = (formData) => {
//   const errors = {};
  
//   errors.orgName = safeStringValidation(formData.orgName, "Organization name") || "";
//   errors.fullname = validateName(formData.fullname);
//   errors.username = validateUsername(formData.username);
//   errors.email = validateEmail(formData.email);
//   errors.mobileNumber = validateMobileNumber(formData.mobileNumber);
//   errors.address = safeStringValidation(formData.address, "Address") || "";
//   errors.city = validateCity(formData.city);
//   errors.country = safeStringValidation(formData.country, "Country") || "";
//   errors.state = safeStringValidation(formData.state, "State") || "";
//   errors.zipCode = validateZipCode(formData.zipCode);
//   errors.password = validatePassword(formData.password);
//   errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
//   errors.siteName = validateSiteName(formData.siteName);
//   errors.managerName = validateManagerName(formData.managerName);
//   errors.managerPhone = validateManagerPhone(formData.managerPhone);
//   errors.managerEmail = validateManagerEmail(formData.managerEmail);
//   errors.latitude = validateLatitude(formData.latitude);
//   errors.longitude = validateLongitude(formData.longitude);
  
//   const isValid = !Object.values(errors).some(error => error !== "");
  
//   return { isValid, errors };
// };

// export const validateEditForm = (formData, passwordChangeEnabled = false) => {
//   const errors = {};
  
//   errors.fullname = validateName(formData.fullname);
//   errors.mobileNumber = validateMobileNumber(formData.mobileNumber);
//   errors.address = safeStringValidation(formData.address, "Address") || "";
//   errors.city = validateCity(formData.city);
//   errors.country = safeStringValidation(formData.country, "Country") || "";
//   errors.state = safeStringValidation(formData.state, "State") || "";
//   errors.zipCode = validateZipCode(formData.zipCode);
//   errors.siteName = validateSiteName(formData.siteName);
//   errors.managerName = validateManagerName(formData.managerName);
//   errors.managerPhone = validateManagerPhone(formData.managerPhone);
//   errors.managerEmail = validateManagerEmail(formData.managerEmail);
//   errors.latitude = validateLatitude(formData.latitude);
//   errors.longitude = validateLongitude(formData.longitude);
//   errors.username = validateUsername(formData.username);
  
//   if (passwordChangeEnabled) {
//     errors.password = validatePassword(formData.password);
//     errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
//   }
  
//   const isValid = !Object.values(errors).some(error => error !== "");
  
//   return { isValid, errors };
// };

// export const validatePassword = (value) => {
//   const error = safeStringValidation(value, 'Password');
//   if (error) return error;

//   const trimmedValue = value.trim();
//   if (trimmedValue.length < 8) return "Password must be at least 8 characters";
//   if (!/[a-z]/.test(trimmedValue)) return "Password must contain at least one lowercase letter";
//   if (!/[A-Z]/.test(trimmedValue)) return "Password must contain at least one uppercase letter";
//   if (!/[0-9]/.test(trimmedValue)) return "Password must contain at least one number";
//   if (!/[@$!%*?&]/.test(trimmedValue)) return "Password must contain at least one special character";
  
//   return "";
// };

// export const validateConfirmPassword = (password, confirmPassword) => {
//   const error = safeStringValidation(confirmPassword, 'Confirm password');
//   if (error) return error;

//   if (password !== confirmPassword) return "Passwords do not match";
//   return "";
// };





const safeStringValidation = (value, fieldName = 'Field') => {
  if (value === undefined || value === null) {
    return `${fieldName} is required`;
  }
 
  if (typeof value !== 'string') {
    if (typeof value === 'number' || typeof value === 'boolean') {
      value = String(value);
    } else {
      return `${fieldName} must be a string`;
    }
  }
 
  const trimmed = value.trim();
  if (!trimmed) {
    return `${fieldName} is required`;
  }
 
  return null;
};

export const validateName = (value) => {
  const error = safeStringValidation(value, 'Name');
  if (error) return error;
 
  const trimmed = value.trim();
  if (trimmed.length < 3) return 'Name must be at least 3 characters';
  if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(trimmed)) {
    return "Name should contain only letters and single spaces between words";
  }
  return "";
};

export const validateMobileNumber = (value) => {
  const error = safeStringValidation(value, 'Mobile number');
  if (error) return error;

  const trimmed = value.trim();
 
  if (/^\d{10}\D+/.test(trimmed)) {
    return "Mobile number should contain only digits after the first 10 digits";
  }

  const digitsOnly = trimmed.replace(/\D/g, '');

  if (/\D/.test(trimmed)) {
    return "Mobile number should contain only digits";
  }

  if (digitsOnly.length !== 10) {
    return "Mobile number must be exactly 10 digits";
  }

  if (!/^[6-9]/.test(digitsOnly)) {
    return "Mobile number must start with 6, 7, 8, or 9";
  }

  if (/^(\d)\1{9}$/.test(digitsOnly)) {
    return "Mobile number cannot be all the same digit";
  }

  if (/^(\d{3})\1{2}$/.test(digitsOnly)) {
    return "Mobile number contains repeating patterns";
  }

  const invalidPrefixes = ['666', '777', '888', '999', '555', '444', '333', '222'];
  const prefix = digitsOnly.substring(0, 3);
  if (invalidPrefixes.includes(prefix)) {
    return "This mobile number prefix is not valid";
  }

  return "";
};

export const validateTaskName = (value) => {
  const error = safeStringValidation(value, 'Task name');
  if (error) return error;

  const trimmedValue = value.trim();

  // Allowed: letters, numbers, spaces, hyphens, underscores
  if (!/^[a-zA-Z0-9\s_-]+$/.test(trimmedValue)) {
    return "Task name can only contain letters, numbers, spaces, hyphens, and underscores";
  }

  // Minimum length
  if (trimmedValue.length < 3) {
    return "Task name must be at least 3 characters long";
  }

  // Maximum length
  if (trimmedValue.length > 50) {
    return "Task name cannot exceed 50 characters";
  }

  // No repeating same character (e.g., "aaaaaa", "111111")
  if (/^(\w)\1{4,}$/.test(trimmedValue.replace(/\s/g, ''))) {
    return "Task name cannot contain only repeating characters";
  }

  // Should not be only digits
  if (/^\d+$/.test(trimmedValue)) {
    return "Task name cannot be only numbers";
  }

  // Prevent meaningless task names like "test", "task"
  const invalidNames = ['task', 'test', 'todo', 'sample'];
  if (invalidNames.includes(trimmedValue.toLowerCase())) {
    return "Please provide a more descriptive task name";
  }

  return "";
};


export const validateDescription = (value) => {
  const error = safeStringValidation(value, 'Description');
  if (error) return error;

  const trimmedValue = value.trim();

  // Allowed: letters, numbers, spaces, punctuation (, . - _ ! ? : ;)
  if (!/^[a-zA-Z0-9\s,.\-_:;!?()]+$/.test(trimmedValue)) {
    return "Description can only contain letters, numbers, spaces, and basic punctuation";
  }

  // Minimum length
  if (trimmedValue.length < 5) {
    return "Description must be at least 5 characters long";
  }

  // Maximum length
  if (trimmedValue.length > 300) {
    return "Description cannot exceed 300 characters";
  }

  // Prevent descriptions that are only numbers
  if (/^\d+$/.test(trimmedValue)) {
    return "Description cannot be only numbers";
  }

  // Prevent meaningless filler like "aaa", "111"
  if (/^(\w)\1{4,}$/.test(trimmedValue.replace(/\s/g, ''))) {
    return "Description cannot contain only repeating characters";
  }

  return "";
};



export const validateLocation = (value) => {
  const error = safeStringValidation(value, 'Location');
  if (error) return error;

  const trimmedValue = value.trim();

  if (!/^[a-zA-Z0-9\s,.-]+$/.test(trimmedValue)) {
    return "Location can only contain letters, numbers, spaces, commas, hyphens, and periods";
  }

  if (trimmedValue.length < 3) {
    return "Location must be at least 3 characters long";
  }

  if (trimmedValue.length > 100) {
    return "Location cannot exceed 100 characters";
  }

  if (/^(\w)\1{2,}$/.test(trimmedValue.replace(/\s/g, ''))) {
    return "Location contains repeating characters";
  }

  if (/^\d+$/.test(trimmedValue)) {
    return "Location cannot be only numbers";
  }

  return "";
};

export const validateChargerType = (value) => {
  const error = safeStringValidation(value, 'Charger type');
  if (error) return error;

  const trimmedValue = value.trim();
  const validChargerTypes = [
    'AC', 'Alternating Current', 'DC', 'Direct Current', 'Fast Charger', 
    'Rapid Charger', 'Level 1', 'L1', 'Level 2', 'L2', 'Level 3', 'L3', 
    'DCFC', 'Ultra Fast', 'High Power', 'Bidirectional', 'V2G', 
    'Vehicle-to-Grid', 'Wireless', 'Inductive'
  ];

  if (/[^a-zA-Z0-9 /-]/.test(trimmedValue)) {
    return "Only letters, numbers, spaces, and hyphens are allowed";
  }
  if (/\s{2,}/.test(trimmedValue)) return "Multiple consecutive spaces are not allowed";
  if (/^[ /-]|[ /-]$/.test(trimmedValue)) return "Cannot start or end with special characters";
  
  const isKnownType = validChargerTypes.some(type => 
    new RegExp(`\\b${type}\\b`, 'i').test(trimmedValue)
  );

  if (!isKnownType) {
    const commonTypes = ['AC', 'DC', 'Level 2', 'DCFC', 'V2G'];
    return `Unknown charger type. Common types: ${commonTypes.join(', ')}`;
  }
  if (trimmedValue.length > 30) return "Charger type should not exceed 30 characters";
  if (/\bLevel\s*[1-3]\b/i.test(trimmedValue)) {
    const level = trimmedValue.match(/\bLevel\s*([1-3])\b/i)[1];
    if (level === '1' && /DC|Fast|Rapid/i.test(trimmedValue)) {
      return "Level 1 chargers are always AC";
    }
    if (level === '3' && /AC/i.test(trimmedValue)) {
      return "Level 3 implies DC fast charging";
    }
  }

  return "";
};



export const validateZipCode = (value) => {
  if (typeof value !== 'string') return "Zip code must be a string";
 
  const trimmedValue = value.trim();
  if (!trimmedValue) return "Zip code is required";
 
  if (/[^0-9]/.test(trimmedValue)) return "Zip code must contain only numbers";
 
  if (trimmedValue.length !== 6) return "Zip code must be exactly 6 digits";
 
  if (/^0{6}$/.test(trimmedValue)) return "Zip code cannot be all zeros";
  if (/^0/.test(trimmedValue)) return "Zip code cannot start with zero";
  if (/^(\d)\1{5}$/.test(trimmedValue)) return "Zip code cannot be all the same digit";
  if (/^(\d{3})\1$/.test(trimmedValue)) return "Zip code cannot have repeating 3-digit patterns";
 
  const firstDigit = trimmedValue.charAt(0);
  if (firstDigit === '0') return "Invalid zip code format for this region";
 
  const fakeZipCodes = ['123456', '654321', '111111', '999999', '010101'];
  if (fakeZipCodes.includes(trimmedValue)) return "This appears to be a test zip code";
 
  return "";
};

export const validateEmail = (value) => {
  const error = safeStringValidation(value, 'Email');
  if (error) return error;

  const trimmedValue = value.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 
  if (!emailRegex.test(trimmedValue)) return "Invalid email format";
  if (/\.\./.test(trimmedValue)) return "Email cannot contain consecutive dots";
 
  const [local, domain] = trimmedValue.split("@");
  if (local?.startsWith(".") || local?.endsWith(".") || domain?.startsWith(".") || domain?.endsWith(".")) {
    return "Email cannot start or end with a dot";
  }
 
  return "";
};

export const validateUsername = (value) => {
  const error = safeStringValidation(value, 'Username');
  if (error) return error;

  const trimmedValue = value.trim();
  if (trimmedValue.length < 2) return "Username must be at least 2 characters";
  if (trimmedValue.length > 30) return "Username cannot exceed 30 characters";
  if (!/^[a-zA-Z0-9_\-]+(?: [a-zA-Z0-9_\-]+)*$/.test(trimmedValue)) {
    return "Username can only contain letters, numbers, underscores, and single hyphens";
  }
  if (/^[-_]|[-_]$/.test(trimmedValue)) return "Username cannot start or end with special characters";
  if (/[-_]{2,}/.test(trimmedValue)) return "Username cannot have consecutive special characters";
  if (/^\d+$/.test(trimmedValue)) return "Username cannot be all numbers";
  if (/^[0-9]/.test(trimmedValue)) return "Username cannot start with a number";
  if (/([a-zA-Z0-9])\1{3,}/i.test(trimmedValue)) return "Username has too many repeating characters";

  const restrictedWords = ['admin', 'root', 'system', 'null', 'undefined', 'guest', 'anonymous'];
  if (restrictedWords.includes(trimmedValue.toLowerCase())) return "This username is not allowed";
  if (/^[A-Z]+$/.test(trimmedValue)) return "Username cannot be all uppercase letters";

  return "";
};

export const validateConnectorType = (value) => {
  const error = safeStringValidation(value, 'Connector type');
  if (error) return error;

  const trimmedValue = value.trim();
  const validConnectorTypes = [
    'Type 1', 'J1772',        
    'Type 2', 'Mennekes',    
    'CCS1',                  
    'CCS2',                
    'CHAdeMO',              
    'GB/T',                  
    'NACS', 'Tesla'          
  ];

  const normalizedValue = trimmedValue.toLowerCase();
  const isValid = validConnectorTypes.some(
    type => type.toLowerCase() === normalizedValue
  );

  if (!isValid) {
    return `Invalid connector type. Valid types: ${validConnectorTypes.join(', ')}`;
  }

  return "";
};

export const validateVIN = (value) => {
  const error = safeStringValidation(value, 'VIN');
  if (error) return error;

  const trimmedValue = value.trim().toUpperCase();
  if (!/^[A-HJ-NPR-Z0-9]{11,17}$/i.test(trimmedValue)) {
    return "VIN should be 11-17 characters, letters (except I,O,Q) and digits only";
  }
  return "";
};

export const validateRegistrationNo = (value) => {
  const error = safeStringValidation(value, 'Registration number');
  if (error) return error;

  const trimmedValue = value.trim();
  if (!/^[a-zA-Z0-9\s\-]+$/.test(trimmedValue)) {
    return "Registration No should contain only letters, digits, spaces, or hyphens";
  }
  return "";
};

export const validateMake = (value) => {
  const error = safeStringValidation(value, 'Make');
  if (error) return error;

  const trimmedValue = value.trim();
  if (!/^[a-zA-Z0-9\s\-]+$/.test(trimmedValue)) {
    return "Make should contain only letters, digits, spaces, or hyphens";
  }
  return "";
};

export const validateModel = (value) => {
  const error = safeStringValidation(value, 'Model');
  if (error) return error;

  const trimmedValue = value.trim();
  if (!/^[a-zA-Z0-9\s\-]+$/.test(trimmedValue)) {
    return "Model should contain only letters, digits, spaces, or hyphens";
  }
  return "";
};

export const validateVehicleType = (value) => {
  const error = safeStringValidation(value, 'Vehicle type');
  if (error) return error;

  const trimmedValue = value.trim();
  if (!/^[a-zA-Z0-9\s\-]+$/.test(trimmedValue)) {
    return "Vehicle Type should contain only letters, digits, spaces, or hyphens";
  }
  return "";
};

export const validateManufacturerName = (value) => {
  const error = safeStringValidation(value, 'Manufacturer name');
  if (error) return error;

  const trimmedValue = value.trim();
  if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(trimmedValue)) {
    return "Manufacturer name should contain only letters and single spaces between words";
  }
  return "";
};


export const validateIDName = (value) => {
  const error = safeStringValidation(value, 'IssueTracker ID');
  if (error) return error;

  const trimmedValue = value.trim();
 
  if (!/^[a-zA-Z0-9]+$/.test(trimmedValue)) {
    return "IssueTracker ID can only contain letters and numbers (no spaces or special characters)";
  }

  if (trimmedValue.length < 3) {
    return "IssueTracker ID must be at least 3 characters long";
  }

  if (trimmedValue.length > 20) {
    return "IssueTracker ID cannot exceed 20 characters";
  }

  if (!/[0-9]/.test(trimmedValue)) {
    return "IssueTracker ID must contain at least one number";
  }

  if (!/[a-zA-Z]/.test(trimmedValue)) {
    return "IssueTracker ID must contain at least one letter";
  }

  return "";
};

export const validateManufacturerCountry = (value) => {
  const error = safeStringValidation(value, 'Manufacturer country');
  if (error) return error;

  const trimmedValue = value.trim();
  if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(trimmedValue)) {
    return "Country should contain only letters";
  }
  return "";
};

export const validateChargerName = (value) => {
  const error = safeStringValidation(value, 'Charger type');
  if (error) return error;

  const trimmedValue = value.trim();
  const validChargerTypes = [
    'Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla NACS'
  ];

  if (/[^a-zA-Z0-9 /-]/.test(trimmedValue)) {
    return "Only letters, numbers, spaces, and hyphens are allowed";
  }
  if (/\s{2,}/.test(trimmedValue)) return "Multiple consecutive spaces are not allowed";
  if (/^[ /-]|[ /-]$/.test(trimmedValue)) return "Cannot start or end with special characters";
 
  const isKnownType = validChargerTypes.some(type =>
    new RegExp(`\\b${type}\\b`, 'i').test(trimmedValue)
  );

  if (!isKnownType) {
    const commonTypes = ['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'tesla NACS'];
    return `Unknown charger type. Common types: ${commonTypes.join(', ')}`;
  }
  if (trimmedValue.length > 30) return "Charger type should not exceed 15 characters";
  if (/\bLevel\s*[1-3]\b/i.test(trimmedValue)) {
    const level = trimmedValue.match(/\bLevel\s*([1-3])\b/i)[1];
    if (level === '1' && /DC|Fast|Rapid/i.test(trimmedValue)) {
      return "Level 1 chargers are always AC";
    }
    if (level === '3' && /AC/i.test(trimmedValue)) {
      return "Level 3 implies DC fast charging";
    }
  }

  return "";
};

export const validateTotalCapacity = (value) => {
  if (value === null || value === undefined) return 'Total capacity is required';
 
  const stringValue = value?.toString() || '';
  const trimmedValue = stringValue.trim();
  if (!trimmedValue) return 'Total capacity is required';
 
  const num = Number(trimmedValue);
  if (isNaN(num)) return 'Must be a valid number';
  if (num <= 0) return 'Must be greater than 0';
 
  return '';
};

export const validateCurrentType = (value) => {
  const error = safeStringValidation(value, 'Current type');
  if (error) return error;

  const trimmedValue = value.trim();
  const validTypes = [
    'AC', 'DC', 'AC SINGLE PHASE', 'AC THREE PHASE',
    'AC SINGLE-PHASE', 'AC THREE-PHASE', 'ALTERNATING CURRENT',
    'DIRECT CURRENT', 'SINGLE PHASE AC', 'THREE PHASE AC'
  ];

  const normalizedInput = trimmedValue
    .toUpperCase()
    .replace(/\s+/g, ' ')      
    .replace(/-/g, ' ')        
    .replace(/\bAC\b/g, 'AC')  
    .replace(/\bDC\b/g, 'DC')  
    .trim();
   
  const isValid = validTypes.some(type =>
    type === normalizedInput ||
    type.replace(/-/g, ' ') === normalizedInput
  );

  if (!isValid) {
    const commonExamples = ['AC', 'DC', 'AC Single Phase', 'AC Three Phase'];
    return `Invalid current type. Valid examples: ${commonExamples.join(', ')}`;
  }
  if (/PHASE/i.test(normalizedInput) && !/AC/i.test(normalizedInput)) {
    return "Phase specification only applies to AC current";
  }
  if (/DC/i.test(normalizedInput) && /PHASE/i.test(normalizedInput)) {
    return "DC current cannot have phase specification";
  }

  return "";
};

export const validatePortCapacity = (value) => {
  if (value === null || value === undefined) return 'Port capacity is required';
 
  const stringValue = String(value).trim();
  if (!stringValue) return 'Port capacity is required';
 
  const num = Number(stringValue);
  if (isNaN(num)) return 'Must be a valid number';
  if (num <= 0) return 'Must be greater than 0';
 
  return '';
};

export const validateSiteName = (value) => {
  const error = safeStringValidation(value, 'Site name');
  if (error) return error;

  const trimmedValue = value.trim();
  const stationNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
  if (!stationNameRegex.test(trimmedValue)) {
    return 'Site name can only contain letters, numbers, spaces, hyphens, and underscores';
  }
  if (trimmedValue.length > 100) {
    return 'Site name must be 50 characters or less';
  }
  return "";
};

export const validateManagerName = (value) => {
  const error = safeStringValidation(value, 'Manager name');
  if (error) return error;

  const trimmedValue = value.trim();
  if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(trimmedValue)) {
    return "Manager name should contain only letters and single spaces between words";
  }
  return "";
};

export const validateManagerEmail = (value) => {
  const error = safeStringValidation(value, 'Manager email');
  if (error) return error;

  const trimmedValue = value.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 
  if (!emailRegex.test(trimmedValue)) return "Invalid email format";
  if (/\.\./.test(trimmedValue)) return "Email cannot contain consecutive dots";
 
  const [local, domain] = trimmedValue.split("@");
  if (local?.startsWith(".") || local?.endsWith(".") || domain?.startsWith(".") || domain?.endsWith(".")) {
    return "Email cannot start or end with a dot";
  }
 
  return "";
};

export const validatePortDisplayName = (value) => {
  const error = safeStringValidation(value, 'Port display name');
  if (error) return error;

  const trimmedValue = value.trim();
  if (!/^[a-zA-Z0-9\s-]+$/.test(trimmedValue)) {
    return "Port display name should only contain letters, numbers, spaces, and hyphens";
  }
  if (trimmedValue.length > 50) {
    return "Port display name must be 50 characters or less";
  }
  return "";
};

export const validateManagerPhone = (value) => {
  const error = safeStringValidation(value, 'Manager phone');
  if (error) return error;

  const trimmedValue = value.trim();
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(trimmedValue)) {
    return 'Mobile Number must start with 6, 7, 8, or 9 and be 10 digits';
  }
  return "";
};

export const validateStationName = (value) => {
  const error = safeStringValidation(value, 'Station name');
  if (error) return error;

  const trimmedValue = value.trim();
  const stationNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
  if (!stationNameRegex.test(trimmedValue)) {
    return 'Station name can only contain letters, numbers, spaces, hyphens, and underscores';
  }
  if (trimmedValue.length > 50) {
    return 'Station name must be 50 characters or less';
  }
  return "";
};

export const validateOcppId = (value) => {
  if (!value || value.trim() === '') {
    return 'OCPP ID is required';
  }

  const trimmedValue = value.trim();
  const ocppIdRegex = /^[a-zA-Z0-9\-_]{1,36}$/;

    if (/^0+$/.test(trimmedValue)) {
    return 'OCPPID cannot be all zeros';
  }

  if (!ocppIdRegex.test(trimmedValue)) {
    return 'OCPP ID must be 1-36 characters (letters, numbers, hyphens, or underscores)';
  }

  if (/^[-_]|[-_]$/.test(trimmedValue)) {
    return 'OCPP ID cannot start or end with hyphen/underscore';
  }

  return "";
};

export const validateCountry = (value) => {
  if (!value || value.trim() === '') {
    return 'Country is required';
  }
}

export const validateState = (value) => {
  if (!value || value.trim() === '') {
    return 'State is required';
  }
}

export const validateCity = (value) => {
  if (!value || value.trim() === '') {
    return 'City is required';
  }
}

export const validateAddress = (value) => {
  if (!value || value.trim() === '') {
    return 'Address is required';
  }
}
export const validateSerialNumber = (value) => {
  if (!value || value.trim() === '') {
    return 'Serial number is required';
  }

  const trimmedValue = value.trim();
 
  if (/^0+$/.test(trimmedValue)) {
    return 'Serial number cannot be all zeros';
  }
 
  if (!/^[0-9]{6,20}$/.test(trimmedValue)) {
    return 'Serial number must be 6-20 digits (numbers only)';
  }
 
  return "";
};

export const validateFirmwareVersion = (value) => {
  const error = safeStringValidation(value, 'Firmware version');
  if (error) return error;

  const trimmedValue = value.trim();
  const versionRegex = /^\d+\.\d+(\.\d+)?$/;
  if (!versionRegex.test(trimmedValue)) {
    return 'Firmware version must be in format X.Y or X.Y.Z (e.g., 1.0 or 1.0.2)';
  }
  return "";
};


export const validateVoltageRange = (value) => {
  if (value === null || value === undefined || value === '') {
    return "Voltage range is required";
  }

  if (typeof value === 'number') {
    if (value <= 0) return "Voltage must be positive";
    if (value > 1000) return "Voltage too high (max 1000V)";
    return "";
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue) return "Voltage range is required";
   
    const voltageRegex = /^(\d{1,3}(?:\.\d{1,2})?(?:\s*-\s*\d{1,3}(?:\.\d{1,2})?)?(?:\s*V(?:\s*AC)?)?$)/i;
    if (!voltageRegex.test(trimmedValue)) {
      return 'Valid formats: "220", "220V", "100-240", "100-240V AC"';
    }

    const numbers = trimmedValue.match(/\d+(?:\.\d+)?/g) || [];
    const minVoltage = parseFloat(numbers[0]);
    const maxVoltage = numbers[1] ? parseFloat(numbers[1]) : null;

    if (minVoltage <= 0) return "Voltage must be positive";
    if (minVoltage > 1000) return "Voltage too high (max 1000V)";
    if (maxVoltage && maxVoltage <= minVoltage) {
      return "Max voltage must be greater than min voltage";
    }
  }

  return "";
};

export const validateTimezone = (value) => {
  const error = safeStringValidation(value, 'Timezone');
  if (error) return error;

  const trimmedValue = value.trim();

  const indianFriendlyAliases = ['IST','ist', 'Indian Standard Time', 'India'];
  if (indianFriendlyAliases.includes(trimmedValue)) {
    return "";
  }

  const validRegions = [
    'Africa', 'America', 'Antarctica', 'Arctic', 'Asia',
    'Atlantic', 'Australia', 'Europe', 'Indian', 'Pacific'
  ];

  if (trimmedValue.includes('/')) {
    const [region] = trimmedValue.split('/');
    if (!validRegions.includes(region)) {
      return `Please enter a valid timezone region like "Asia/Kolkata", "Europe/London", or "America/New_York"`;
    }
    return "";
  }

  const simpleTimezoneRegex = /^(UTC|GMT)([\+\-]\d{1,2}(:\d{2})?)?$/i;
  if (simpleTimezoneRegex.test(trimmedValue)) {
    return "";
  }

  return `Invalid timezone. Please enter:
- A standard name like "Asia/Kolkata" (for India)
- Or "IST", "Indian Standard Time", or "India"
- Or UTC/GMT format like "GMT+5:30"`;
};


export const validateLatitude = (value) => {
  if (value === null || value === undefined || value === '') {
    return "Latitude is required";
  }

  const num = Number(value);
  if (isNaN(num)) return "Latitude must be a number";
  if (num < -90 || num > 90) return "Latitude must be between -90 and 90";
  return "";
};

export const validateLongitude = (value) => {
  if (value === null || value === undefined || value === '') {
    return "Longitude is required";
  }

  const num = Number(value);
  if (isNaN(num)) return "Longitude must be a number";
  if (num < -180 || num > 180) return "Longitude must be between -180 and 180";
  return "";
};

export const validateForm = (formData) => {
  const errors = {};
 
  errors.orgName = safeStringValidation(formData.orgName, "Organization name") || "";
  errors.fullname = validateName(formData.fullname);
  errors.username = validateUsername(formData.username);
  errors.email = validateEmail(formData.email);
  errors.mobileNumber = validateMobileNumber(formData.mobileNumber);
  errors.address = safeStringValidation(formData.address, "Address") || "";
  errors.city = validateCity(formData.city);
  errors.country = safeStringValidation(formData.country, "Country") || "";
  errors.state = safeStringValidation(formData.state, "State") || "";
  errors.zipCode = validateZipCode(formData.zipCode);
  errors.password = validatePassword(formData.password);
  errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
  errors.siteName = validateSiteName(formData.siteName);
  errors.managerName = validateManagerName(formData.managerName);
  errors.managerPhone = validateManagerPhone(formData.managerPhone);
  errors.managerEmail = validateManagerEmail(formData.managerEmail);
  errors.latitude = validateLatitude(formData.latitude);
  errors.longitude = validateLongitude(formData.longitude);
 
  const isValid = !Object.values(errors).some(error => error !== "");
 
  return { isValid, errors };
};

export const validateEditForm = (formData, passwordChangeEnabled = false) => {
  const errors = {};
 
  errors.fullname = validateName(formData.fullname);
  errors.mobileNumber = validateMobileNumber(formData.mobileNumber);
  errors.address = safeStringValidation(formData.address, "Address") || "";
  errors.city = validateCity(formData.city);
  errors.country = safeStringValidation(formData.country, "Country") || "";
  errors.state = safeStringValidation(formData.state, "State") || "";
  errors.zipCode = validateZipCode(formData.zipCode);
  errors.siteName = validateSiteName(formData.siteName);
  errors.managerName = validateManagerName(formData.managerName);
  errors.managerPhone = validateManagerPhone(formData.managerPhone);
  errors.managerEmail = validateManagerEmail(formData.managerEmail);
  errors.latitude = validateLatitude(formData.latitude);
  errors.longitude = validateLongitude(formData.longitude);
  errors.username = validateUsername(formData.username);
 
  if (passwordChangeEnabled) {
    errors.password = validatePassword(formData.password);
    errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
  }
 
  const isValid = !Object.values(errors).some(error => error !== "");
 
  return { isValid, errors };
};

export const validatePassword = (value) => {
  const error = safeStringValidation(value, 'Password');
  if (error) return error;

  const trimmedValue = value.trim();
  if (trimmedValue.length < 8) return "Password must be at least 8 characters";
  if (!/[a-z]/.test(trimmedValue)) return "Password must contain at least one lowercase letter";
  if (!/[A-Z]/.test(trimmedValue)) return "Password must contain at least one uppercase letter";
  if (!/[0-9]/.test(trimmedValue)) return "Password must contain at least one number";
  if (!/[@$!%*?&]/.test(trimmedValue)) return "Password must contain at least one special character";
 
  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  const error = safeStringValidation(confirmPassword, 'Confirm password');
  if (error) return error;

  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};