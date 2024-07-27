import AppLayout from "@/app/AppLayout";
import AddService from "@/components/AddService";
import Header from "@/components/Header";
import Table from "@/components/ArticleTable";

export default function Home() {
    return (
     <div className="">
        <AppLayout>
      <Header title = {"Service"}/>
      <AddService/>
      
        </AppLayout>
     </div>
    );
  }
  