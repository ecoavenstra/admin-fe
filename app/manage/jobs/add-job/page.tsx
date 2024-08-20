import AppLayout from "@/app/AppLayout";
import AddJobs from "@/components/AddJobs";
import Header from "@/components/Header";
import Table from "@/components/ArticleTable";

export default function Home() {
    return (
     <div className="">
        <AppLayout>
      <Header title = {"Jobs"} sTitle='Manage'/>
      <AddJobs/>
      
        </AppLayout>
     </div>
    );
  }
  