'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import Loader  from './Loader';
import toast, { Toaster } from "react-hot-toast";

import { BACKEND_URl } from '@/constants';
import { useRouter } from 'next/navigation';

const AddJob: React.FC = () => {
  const route = useRouter();

  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [category, setCategory] = useState('');
  const [vacancy, setVacancy] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [openTill, setOpenTill] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    const jobData = { 
      companyName, 
      jobTitle, 
      salaryRange, 
      category, 
      vacancy, 
      jobType, 
      jobLocation, 
      jobDescription, 
      contactNumber, 
      openTill 
    };
    console.log(jobData);
    try {
      const response = await fetch('https://ecoavenstra-be.onrender.com/api/v1/admin/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      console.log({jobData})
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Job successfully submitted:', responseData);
      toast.success('Job added successfully!')
      // Handle success (e.g., display a success message, redirect to another page)
    } catch (error) {
      console.error('Failed to submit job:', error);
      // Handle error (e.g., display an error message)
      toast.error('Somethng went wrong!')
    } finally {
      setIsLoading(false);
      route.push('/manage/jobs')
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white mt-2">
      <h1 className="text-2xl font-bold mb-4">Add Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyName" className="block text-sm text-gray-700">Company Name</label>
            <Input 
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="rounded-xl mt-2 border-gray-400"
              placeholder="Enter Company Name"
            />
          </div>
          <div>
            <label htmlFor="jobTitle" className="block text-sm text-gray-700">Job Title</label>
            <Input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="rounded-xl mt-2 border-gray-400"
              placeholder="Enter Job Title"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="salaryRange" className="block text-sm text-gray-700">Salary Range</label>
            <Input
              type="text"
              id="salaryRange"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              className="rounded-xl mt-2 border-gray-400"
              placeholder="Enter Salary Range"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm text-gray-700">Category</label>
            <Input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl mt-2 border-gray-400"
              placeholder="Enter Category"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="vacancy" className="block text-sm text-gray-700">Vacancy</label>
            <Input
              type="text"
              id="vacancy"
              value={vacancy}
              onChange={(e) => setVacancy(e.target.value)}
              className="rounded-xl mt-2 border-gray-400"
              placeholder="Enter Vacancy"
            />
          </div>
          <div>
            <label htmlFor="jobType" className="block text-sm text-gray-700">Job Type</label>
            <Input
              type="text"
              id="jobType"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="rounded-xl mt-2 border-gray-400"
              placeholder="Enter Job Type"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="jobLocation" className="block text-sm text-gray-700">Job Location</label>
            <Input
              type="text"
              id="jobLocation"
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
              className="rounded-xl mt-2 border-gray-400"
              placeholder="Enter Job Location"
            />
          </div>
          <div>
            <label htmlFor="contactNumber" className="block text-sm text-gray-700">Contact Number</label>
            <Input
              type="text"
              id="contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="rounded-xl mt-2 border-gray-400"
              placeholder="Enter Contact Number"
            />
          </div>
        </div>
        <div>
          <label htmlFor="openTill" className="block text-sm text-gray-700">Open Till</label>
          <Input
            type="date"
            id="openTill"
            value={openTill}
            onChange={(e) => setOpenTill(e.target.value)}
            className="rounded-xl mt-2 border-gray-400"
            placeholder="Select Date"
          />
        </div>
        <div>
          <label htmlFor="jobDescription" className="block text-sm text-gray-700">Job Description</label>
          <textarea
            // as="textarea"
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="rounded-xl mt-2 border w-full p-2 border-gray-400"
            placeholder="Enter Job Description"
            rows={6}
          />
          {/* Add rich text editor here if needed */}
        </div>
        <div>
          <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Submit {isLoading && <Loader isButton/>} 
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJob;
