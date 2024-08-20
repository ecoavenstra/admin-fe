import AppLayout from "@/app/AppLayout";
import Header from "@/components/Header";
import EnquiryTable from "@/components/EnquiryTable";

export default function Home() {
  return (
    <div className="">
      <AppLayout>
        <Header title={"Enquiry"} sTitle='Manage'/>
        <EnquiryTable />
      </AppLayout>
    </div>
  );
}
