import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useJobUrls } from "@/hooks/use-job-urls";
import { apiRequest } from "@/lib/queryClient";
import AddUrlDialog from "./add-url-dialog";
import { 
  Plus, 
  Wand2, 
  CheckSquare, 
  Search, 
  ExternalLink, 
  Trash2,
  Building,
  Loader2
} from "lucide-react";

export default function UrlManagement() {
  const [selectedUrls, setSelectedUrls] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const { data: urls, isLoading } = useJobUrls();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/job-urls/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-urls"] });
      toast({
        title: "Success",
        description: "Job URL deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete job URL",
        variant: "destructive",
      });
    },
  });

  const handleSelectAll = () => {
    if (selectedUrls.length === filteredUrls.length) {
      setSelectedUrls([]);
    } else {
      setSelectedUrls(filteredUrls.map(url => url.id));
    }
  };

  const handleUrlSelect = (urlId: number, checked: boolean) => {
    if (checked) {
      setSelectedUrls(prev => [...prev, urlId]);
    } else {
      setSelectedUrls(prev => prev.filter(id => id !== urlId));
    }
  };

  const handleAutofill = () => {
    if (selectedUrls.length === 0) {
      toast({
        title: "No URLs selected",
        description: "Please select at least one URL to autofill",
        variant: "destructive",
      });
      return;
    }

    // Open selected URLs in new tabs
    const selectedUrlData = filteredUrls.filter(url => selectedUrls.includes(url.id));
    selectedUrlData.forEach(url => {
      window.open(url.url, '_blank');
    });

    toast({
      title: "URLs Opened",
      description: `Opened ${selectedUrls.length} URLs in new tabs for autofill`,
    });
  };

  const filteredUrls = urls?.filter(url => {
    const matchesSearch = !searchQuery || 
      url.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.url.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || url.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "applied":
        return "bg-green-100 text-green-800";
      case "duplicate":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded w-64 animate-pulse"></div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-slate-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Job URLs Management</h1>
        <p className="text-slate-600">Collect, organize, and manage job opening URLs</p>
      </div>

      {/* URL Actions Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add URL
              </Button>
              <Button 
                className="bg-accent hover:bg-accent/90"
                onClick={handleAutofill}
                disabled={selectedUrls.length === 0}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Autofill Selected ({selectedUrls.length})
              </Button>
              <Button variant="outline" onClick={handleSelectAll}>
                <CheckSquare className="h-4 w-4 mr-2" />
                Select All
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search URLs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="duplicate">Duplicate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* URLs List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Collected Job URLs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredUrls.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Building className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium mb-2">No job URLs found</p>
              <p className="text-sm">Add some job URLs to get started with autofill</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4">
                      <Checkbox
                        checked={selectedUrls.length === filteredUrls.length && filteredUrls.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Company</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Position</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">URL</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Date Added</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUrls.map((url) => (
                    <tr key={url.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedUrls.includes(url.id)}
                          onCheckedChange={(checked) => handleUrlSelect(url.id, !!checked)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-slate-900">{url.company || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-900">{url.position || "Unknown Position"}</span>
                        {url.location && (
                          <p className="text-sm text-slate-500">{url.location}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <a 
                          href={url.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-blue-700 text-sm truncate max-w-xs block"
                        >
                          {url.url.length > 40 ? `${url.url.substring(0, 40)}...` : url.url}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-sm">
                        {new Date(url.dateAdded).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(url.status)}`}>
                          {url.status.charAt(0).toUpperCase() + url.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(url.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(url.id)}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-600" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddUrlDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}
