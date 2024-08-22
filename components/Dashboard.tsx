import { BACKEND_URl } from "@/constants";
import React, { useEffect, useState } from "react";
import { FaBox, FaUser } from "react-icons/fa";

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    document.title = "Ecoavenstra - Dashboard";
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(BACKEND_URl + "/admin/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    {
      icon: <FaBox className="text-3xl text-gray-600" />,
      label: "Total Enquiry",
      value: dashboardData?.totalEnquiry,
      color: "text-blue-600",
    },
    {
      icon: <FaBox className="text-3xl text-gray-600" />,
      label: "Total Job",
      value: dashboardData?.totalJobs,
      color: "text-blue-600",
    },
    {
      icon: <FaBox className="text-3xl text-gray-600" />,
      label: "Total Service",
      value: dashboardData?.totalService,
      color: "text-blue-600",
    },
    {
      icon: <FaUser className="text-3xl text-gray-600" />,
      label: "Pending Enquiry",
      value: dashboardData?.pendingEnquiries,
      color: "text-red-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? stats.map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 p-6 rounded-lg shadow-lg flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))
          : stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white border shoadow-xl p-6 rounded-lg shadow-lg flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="mr-4">{stat.icon}</div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </h2>
                    <h1 className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </h1>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Dashboard;
