import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    apiEndpoint: "https://api.jobflow.com/user-preferences",
    syncFrequency: "15min",
    autoSubmit: false,
    confirmations: true,
    actionDelay: 3,
    localBackup: true
  });
  
  const { toast } = useToast();

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('jobflow-settings', JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    });
  };

  const handleExport = (format: 'json' | 'csv') => {
    toast({
      title: "Export started",
      description: `Downloading your data in ${format.toUpperCase()} format`,
    });
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.clear();
      toast({
        title: "Data cleared",
        description: "All application data has been removed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Configure your JobFlow preferences and account settings</p>
      </div>

      <div className="space-y-6">
        {/* API Configuration */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">
                User Preferences API Endpoint
              </Label>
              <Input
                type="url"
                value={settings.apiEndpoint}
                onChange={(e) => setSettings(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                placeholder="https://api.yourservice.com/user-preferences"
                className="mt-2"
              />
              <p className="text-sm text-slate-500 mt-1">
                API endpoint to fetch and sync user preferences
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700">Sync Frequency</Label>
              <Select 
                value={settings.syncFrequency} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, syncFrequency: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="5min">Every 5 minutes</SelectItem>
                  <SelectItem value="15min">Every 15 minutes</SelectItem>
                  <SelectItem value="1hour">Every hour</SelectItem>
                  <SelectItem value="manual">Manual only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Autofill Settings */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Autofill Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-slate-900">Enable Auto-Submit</Label>
                <p className="text-sm text-slate-500">Automatically submit applications after autofill</p>
              </div>
              <Switch
                checked={settings.autoSubmit}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSubmit: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-slate-900">Confirmation Dialogs</Label>
                <p className="text-sm text-slate-500">Show confirmation before each action</p>
              </div>
              <Switch
                checked={settings.confirmations}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, confirmations: checked }))}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700">
                Delay Between Actions (seconds)
              </Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={settings.actionDelay}
                onChange={(e) => setSettings(prev => ({ ...prev, actionDelay: parseInt(e.target.value) || 3 }))}
                className="mt-2"
              />
              <p className="text-sm text-slate-500 mt-1">
                Delay between opening tabs and filling forms
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-slate-900">Local Storage Backup</Label>
                <p className="text-sm text-slate-500">Automatically backup data to local storage</p>
              </div>
              <Switch
                checked={settings.localBackup}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, localBackup: checked }))}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div>
                <Label className="font-medium text-slate-900">Export Data</Label>
                <p className="text-sm text-slate-500">Download your application data</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => handleExport('json')}>
                  Export JSON
                </Button>
                <Button variant="outline" onClick={() => handleExport('csv')}>
                  Export CSV
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-4 border-t border-slate-200">
              <div>
                <Label className="font-medium text-red-600">Clear All Data</Label>
                <p className="text-sm text-slate-500">This action cannot be undone</p>
              </div>
              <Button variant="destructive" onClick={handleClearData}>
                Clear Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
