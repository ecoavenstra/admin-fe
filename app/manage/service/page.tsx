import AppLayout from '@/app/AppLayout';
import Header from '@/components/Header';
import ServiceTable from '@/components/ServiceTable'
import React from 'react'
const Service : React.FC = ()=>{
    return(
        <div className="">
              <div className="">
      <AppLayout>
        <Header title={"Services"} sTitle='Manage'/>
        <ServiceTable />
      </AppLayout>
    </div>
            </div>
    )
}

export default Service;


