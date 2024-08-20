import AppLayout from "@/app/AppLayout";
import AddArticle from "@/components/AddArticle";
import Header from "@/components/Header";
import Table from "@/components/ArticleTable";

export default function Home() {
    return (
     <div className="">
        <AppLayout>
      <Header title = {"Article"} sTitle="Manage"/>
      <AddArticle/>
      
        </AppLayout>
     </div>
    );
  }
  