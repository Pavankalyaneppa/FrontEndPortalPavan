import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchOcppStations, sendOcppRequest, clearRequestResponse } from '@/store/reducers/ocpp/ocppSlice';
import {
  ReloadIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon
} from "@radix-ui/react-icons";

const OCPP = () => {
  const dispatch = useDispatch();
  const { stations, status, requestStatus, requestResponse, requestError } = useSelector((state) => state.ocpp);
  
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedPort, setSelectedPort] = useState(null);
  const [selectedSetting, setSelectedSetting] = useState('');
  const [requestData, setRequestData] = useState({});
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    dispatch(fetchOcppStations());
  }, [dispatch]);

  useEffect(() => {
    if (requestStatus === 'succeeded' || requestStatus === 'failed') {
      setShowResponse(true);
    }
  }, [requestStatus]);

  const settings = {
    RemoteStart: {
      description: 'To Initiate a Transaction',
      requiresIdTag: true
    },
    RemoteStop: {
      description: 'To Stop a Transaction'
    },
    Reset: {
      type: ['Soft', 'Hard'],
      description: 'Reset the station or a specific connector'
    },
    TriggerMessage: {
      key: ['BootNotification', 'Heartbeat', 'MeterValues', 'StatusNotification'],
      description: 'Request specific message from the station'
    },
    ChangeAvailability: {
      type: ['Operative', 'Inoperative'],
      description: 'Change the availability of the station or connector'
    },
    ChangeConfiguration: {
      key: [
        'AuthorizationRequired',
        'HeartbeatInterval',
        'ConnectionTimeOut',
        'ResetRetries',
        'BlinkRepeat',
        'LightIntensity',
        'MeterValueSampleInterval',
        'LocalAuthListEnabled',
        'LocalPreAuthorize',
        'StopTransactionOnInvalidId',
        'MaxEnergyOnInvalidId'
      ],
      value: [true, false],
      description: 'Modify station configuration parameters'
    },
    GetConfiguration: {
      key: ['AllKeys'],
      description: 'Retrieve current configuration settings'
    },
    ClearCache: {
      description: 'Clear the authorization cache'
    }
  };

  const handleStationSelect = (stationId) => {
    const station = stations.find(s => s.id.toString() === stationId);
    setSelectedStation(station);
    setSelectedPort(null);
    setSelectedSetting('');
    setRequestData({});
    setShowResponse(false);
  };

  const handlePortSelect = (portId) => {
    const port = selectedStation.ports.find(p => p.id.toString() === portId);
    setSelectedPort(port);
    setShowResponse(false);
  };

  const handleSettingSelect = (setting) => {
    setSelectedSetting(setting);
    setRequestData({
      stationId: selectedStation.id,
      connectorId: selectedPort.id,
      requestType: setting,
      clientId: "Portal"
    });
    setShowResponse(false);
  };

  const handleSettingValueChange = (field, value) => {
    setRequestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    setShowResponse(false);
    dispatch(clearRequestResponse());
    dispatch(sendOcppRequest(requestData));
  };

  const handleCloseResponse = () => {
    setShowResponse(false);
    dispatch(clearRequestResponse());
  };

  const renderSettingInputs = () => {
    const setting = settings[selectedSetting];
    if (!setting) return null;

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{setting.description}</p>
        
        {setting.requiresIdTag && (
          <div className="space-y-2">
            <Label>IdTag (Phone Number or RFID No)*</Label>
            <Input 
              type="text" 
              placeholder="Enter IdTag"
              onChange={(e) => handleSettingValueChange('idTag', e.target.value)}
              required
            />
          </div>
        )}

        {setting.type && (
          <div className="space-y-2">
            <Label>Type</Label>
            <Select onValueChange={(value) => handleSettingValueChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {setting.type.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {setting.key && (
          <div className="space-y-2">
            <Label>Key</Label>
            <Select onValueChange={(value) => handleSettingValueChange('key', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select key" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-72">
                  {setting.key.map(key => (
                    <SelectItem key={key} value={key}>{key}</SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        )}

        {setting.value && requestData.key === 'AuthorizationRequired' && (
          <div className="space-y-2">
            <Label>Value</Label>
            <Select onValueChange={(value) => handleSettingValueChange('value', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                {setting.value.map(val => (
                  <SelectItem key={val.toString()} value={val}>{val.toString()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {setting.value && requestData.key !== 'AuthorizationRequired' && (
          <div className="space-y-2">
            <Label>Value</Label>
            <Input 
              type="text" 
              placeholder="Enter value"
              onChange={(e) => handleSettingValueChange('value', e.target.value)}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>OCPP Stations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'loading' ? (
            <div className="flex justify-center p-4">
              <ReloadIcon className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              {/* Station Selection */}
              <div className="space-y-2">
                <Label>Select Station*</Label>
                <Select 
                  onValueChange={handleStationSelect}
                  value={selectedStation?.id?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map(station => (
                      <SelectItem key={station.id} value={station.id.toString()}>
                        {station.stationName} ({station.referNo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Port Selection */}
              {selectedStation && (
                <div className="space-y-2">
                  <Label>Connector</Label>
                  <RadioGroup 
                    onValueChange={handlePortSelect}
                    value={selectedPort?.id?.toString()}
                    className="flex space-x-4"
                  >
                    {selectedStation.ports.map(port => (
                      <div key={port.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={port.id.toString()} id={`port-${port.id}`} />
                        <Label htmlFor={`port-${port.id}`}>{port.portName}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Settings Selection */}
              {selectedPort && (
                <div className="space-y-2">
                  <Label>Settings</Label>
                  <Select onValueChange={handleSettingSelect} value={selectedSetting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select setting" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(settings).map(setting => (
                        <SelectItem key={setting} value={setting}>{setting}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Setting-specific inputs */}
              {selectedSetting && renderSettingInputs()}

              {/* Submit Button */}
              {selectedSetting && (
                <Button 
                  onClick={handleSubmit} 
                  disabled={requestStatus === 'loading'}
                  className="w-full"
                >
                  {requestStatus === 'loading' ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Sending Request...
                    </>
                  ) : 'Send Request'}
                </Button>
              )}

              {/* Response Dialog */}
              <Dialog open={showResponse} onOpenChange={handleCloseResponse}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center text-lg">
                      {requestResponse?.status === 'Accepted' ? (
                        <CheckCircledIcon className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      {requestResponse?.status || 'Status'}
                    </DialogTitle>
                    <DialogDescription className="pt-4 text-base">
                      {requestResponse?.message || requestError}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OCPP;