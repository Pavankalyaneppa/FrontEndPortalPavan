import React from 'react';

function Chargerhealth() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-lg font-semibold text-gray-700 mb-4">
        Please connect the charger...
      </div>
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export default Chargerhealth;
