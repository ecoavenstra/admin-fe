import AppLayout from "./AppLayout";
import Dashboard from "../components/Dashboard";
import withAuth from "../components/withAuth"; // Adjust the import path as necessary

function Home() {
  return (
    <div>
      <AppLayout>
        {/* <Table/> */}
        <Dashboard />
      </AppLayout>
    </div>
  );
}

export default withAuth(Home);
