import React, { useState, useEffect } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReloadIcon, ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons";

const OCPP = () => {
  // ---------- STATIC DATA ----------
  const stations = [
    {
      id: 1,
      stationName: "Delta Charger",
      referNo: "DELTA-001",
      ports: [
        { id: 101, portName: "Connector 1" },
        { id: 102, portName: "Connector 2" },
      ],
    },
    {
      id: 2,
      stationName: "ABB Charger",
      referNo: "ABB-007",
      ports: [{ id: 201, portName: "Connector 1" }],
    },
  ];

  const settings = {
    RemoteStart: { description: "Start charging session", requiresIdTag: true },
    RemoteStop: { description: "Stop an ongoing session" },
    Reset: {
      type: ["Soft", "Hard"],
      description: "Reset the station or specific connector",
    },
    TriggerMessage: {
      key: ["BootNotification", "Heartbeat", "MeterValues", "StatusNotification"],
      description: "Request a specific message from the station",
    },
    ChangeAvailability: {
      type: ["Operative", "Inoperative"],
      description: "Change station/connector availability",
    },
    ChangeConfiguration: {
      key: [
        "AuthorizationRequired",
        "HeartbeatInterval",
        "ConnectionTimeOut",
        "ResetRetries",
      ],
      value: [true, false],
      description: "Modify configuration parameters",
    },
    GetConfiguration: {
      key: ["AllKeys"],
      description: "Retrieve configuration settings",
    },
    ClearCache: {
      description: "Clear authorization cache",
    },
  };

  // ---------- STATE ----------
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedPort, setSelectedPort] = useState(null);
  const [selectedSetting, setSelectedSetting] = useState("");
  const [requestData, setRequestData] = useState({});
  const [showResponse, setShowResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  // ---------- HANDLERS ----------
  const handleStationSelect = (stationId) => {
    const station = stations.find((s) => s.id.toString() === stationId);
    setSelectedStation(station);
    setSelectedPort(null);
    setSelectedSetting("");
    setRequestData({});
  };

  const handlePortSelect = (portId) => {
    const port = selectedStation.ports.find((p) => p.id.toString() === portId);
    setSelectedPort(port);
  };

  const handleSettingSelect = (setting) => {
    setSelectedSetting(setting);
    setRequestData({
      stationId: selectedStation.id,
      connectorId: selectedPort.id,
      requestType: setting,
      clientId: "Portal",
    });
  };

  const handleSettingValueChange = (field, value) => {
    setRequestData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setResponse(null);

    // simulate API call
    setTimeout(() => {
      setLoading(false);
      setResponse({
        status: "Accepted",
        message: `${requestData.requestType} command executed successfully!`,
      });
      setShowResponse(true);
    }, 1200);
  };

  const handleCloseResponse = () => {
    setShowResponse(false);
    setResponse(null);
  };

  const renderSettingInputs = () => {
    const setting = settings[selectedSetting];
    if (!setting) return null;

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{setting.description}</p>

        {setting.requiresIdTag && (
          <div className="space-y-2">
            <Label>IdTag (RFID or Phone)*</Label>
            <Input
              type="text"
              placeholder="Enter IdTag"
              onChange={(e) => handleSettingValueChange("idTag", e.target.value)}
            />
          </div>
        )}

        {setting.type && (
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              onValueChange={(value) => handleSettingValueChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {setting.type.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {setting.key && (
          <div className="space-y-2">
            <Label>Key</Label>
            <Select
              onValueChange={(value) => handleSettingValueChange("key", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select key" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-48">
                  {setting.key.map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        )}

        {setting.value && requestData.key === "AuthorizationRequired" && (
          <div className="space-y-2">
            <Label>Value</Label>
            <Select
              onValueChange={(value) => handleSettingValueChange("value", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                {setting.value.map((val) => (
                  <SelectItem key={val.toString()} value={val.toString()}>
                    {val.toString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>OCPP Command Panel (Static Demo)</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
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
                {stations.map((station) => (
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
                {selectedStation.ports.map((port) => (
                  <div key={port.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={port.id.toString()}
                      id={`port-${port.id}`}
                    />
                    <Label htmlFor={`port-${port.id}`}>{port.portName}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Settings */}
          {selectedPort && (
            <div className="space-y-2">
              <Label>Settings</Label>
              <Select
                onValueChange={handleSettingSelect}
                value={selectedSetting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select setting" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(settings).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Setting inputs */}
          {selectedSetting && renderSettingInputs()}

          {/* Submit */}
          {selectedSetting && (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Sending Request...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          )}

          {/* Response Dialog */}
          <Dialog open={showResponse} onOpenChange={handleCloseResponse}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center text-lg">
                  {response?.status === "Accepted" ? (
                    <CheckCircledIcon className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  {response?.status || "Status"}
                </DialogTitle>
                <DialogDescription className="pt-4 text-base">
                  {response?.message || "Something went wrong"}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default OCPP;
