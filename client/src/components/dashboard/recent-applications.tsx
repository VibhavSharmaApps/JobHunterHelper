import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";
import { useApplications } from "@/hooks/use-applications";

export default function RecentApplications() {
  const { data: applications, isLoading } = useApplications();

  const recentApplications = applications?.slice(0, 3) || [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "interview":
        return "default";
      case "rejected":
        return "destructive";
      case "accepted":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "interview":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-slate-200 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Applications</CardTitle>
          <button className="text-sm text-primary hover:text-blue-700 font-medium">
            View All
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {recentApplications.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No applications found. Start by adding some job URLs!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Position</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Date Applied</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Building className="h-4 w-4 text-slate-500" />
                        </div>
                        <span className="font-medium text-slate-900">{app.company}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{app.position}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
