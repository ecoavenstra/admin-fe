import AppLayout from "@/app/AppLayout";
import Header from "@/components/Header";
import JobsTable from "@/components/JobsTable";
import React from "react";
const Service: React.FC = () => {
  return (
    <div className="">
      <div className="">
        <AppLayout>
          <Header title={"Jobs"} sTitle='Manage'/>
          <JobsTable />
        </AppLayout>
      </div>
    </div>
  );
};

export default Service;
