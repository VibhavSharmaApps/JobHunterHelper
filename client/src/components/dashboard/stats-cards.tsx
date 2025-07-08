import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { NotebookPen, ClockIcon, UsersIcon, TrendingUpIcon } from "lucide-react";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Applications",
      value: stats?.totalApplications || 0,
      icon: NotebookPen,
      iconBg: "bg-blue-50",
      iconColor: "text-primary"
    },
    {
      title: "Pending URLs",
      value: stats?.pendingUrls || 0,
      icon: ClockIcon,
      iconBg: "bg-yellow-50",
      iconColor: "text-warning"
    },
    {
      title: "Interviews",
      value: stats?.interviews || 0,
      icon: UsersIcon,
      iconBg: "bg-green-50",
      iconColor: "text-accent"
    },
    {
      title: "Success Rate",
      value: `${stats?.successRate || 0}%`,
      icon: TrendingUpIcon,
      iconBg: "bg-emerald-50",
      iconColor: "text-accent"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
