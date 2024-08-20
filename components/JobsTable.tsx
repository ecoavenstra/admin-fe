"use client";
import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { FaFileExcel, FaEye, FaPrint, FaPlusCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { BACKEND_URl } from "@/constants";
import toast from "react-hot-toast";
import Loader from "./Loader";
import ButtonLoader from "./ButtonLoader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

interface Job {
  id: number;
  companyName: string;
  jobTitle: string;
  salaryRange: string;
  category: string;
  vacancy: string;
  jobType: string;
  jobLocation: string;
  jobDescription: string;
  contactNumber: number;
  openTill: string;
  createdAt: string;
}

const JobsTable: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [data, setData] = useState<Job[]>([]);
  const [filteredData, setFilteredData] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [visibleDropdown, setVisibleDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(BACKEND_URl + "/admin/jobs");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        // Ensure the result is an array
        if (Array.isArray(result.jobs)) {
          setData(result.jobs);
          setFilteredData(result.jobs);
        } else {
          console.error("Fetched data is not an array:", result);
          setData([]);
          setFilteredData([]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setData([]);
        setFilteredData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setVisibleDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) => {
      const jobTitle = item.jobTitle?.toLowerCase() ?? "";
      const companyName = item.companyName?.toLowerCase() ?? "";
      const category = item.category?.toLowerCase() ?? "";
      const createdAt = item.createdAt?.toLowerCase() ?? "";

      return (
        jobTitle.includes(searchTerm.toLowerCase()) ||
        companyName.includes(searchTerm.toLowerCase()) ||
        category.includes(searchTerm.toLowerCase()) ||
        createdAt.includes(searchTerm.toLowerCase())
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = Array.isArray(filteredData)
    ? filteredData.slice(indexOfFirstEntry, indexOfLastEntry)
    : [];
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleEntriesChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(event.target.value));
  };

  const toggleDropdown = (id: number) => {
    setVisibleDropdown(visibleDropdown === id ? null : id);
  };

  const handleShow = async (id: number) => {
    try {
      const response = await fetch(BACKEND_URl + `/admin/jobs/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const job = await response.json();
      setSelectedJob(job);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch job:", error);
    }
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setEditModal(true);
  };

  const handleDelete = async () => {
    if (selectedJob) {
      try {
        setDeleteLoading(true);
        const response = await fetch(
          BACKEND_URl + `/admin/jobs/${selectedJob.id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setData(data.filter((job) => job.id !== selectedJob.id));
        setFilteredData(
          filteredData.filter((job) => job.id !== selectedJob.id)
        );
        setDeleteModal(false);
        setSelectedJob(null);
      } catch (error) {
        console.error("Failed to delete job:", error);
      } finally {
        setDeleteLoading(true);
        toast.success("Deleted sucessfully");
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Jobs</h1>
        <button
          onClick={() => router.push("/manage/jobs/add-job")}
          className="text-blue-600 flex items-center"
        >
          <FaPlusCircle className="mr-2" />
          Add New
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="entries" className="text-sm text-gray-700">
            Show
          </label>
          <select
            id="entries"
            className="p-2 border rounded text-sm"
            value={entriesPerPage}
            onChange={handleEntriesChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-700">entries</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
            <FaFileExcel className="mr-2" />
            Excel
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded flex items-center">
            <FaEye className="mr-2" />
            Column visibility
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
            <FaPrint className="mr-2" />
            Print
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="p-2 border rounded text-sm w-full"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">#</th>
              <th className="border-b p-2">Actions</th>
              <th className="border-b p-2">Job Title</th>
              <th className="border-b p-2">Company Name</th>
              <th className="border-b p-2">Category</th>
              <th className="border-b p-2">Description</th>
              <th className="border-b p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  <Loader />
                </td>
              </tr>
            ) : (
              currentEntries.map((item, index) => (
                <tr key={item.id}>
                  <td className="border-b p-2">
                    {indexOfFirstEntry + index + 1}
                  </td>
                  <td className="border-b p-2 relative">
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="px-3 py-1  bg-gray-200 text-gray-800  rounded-md hover:bg-gray-300 ">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleShow(item.id)}
                          className="cursor-pointer"
                        >
                          <FaEye className="mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(item)}
                          className="cursor-pointer"
                        >
                          <FiEdit className="mr-2"/>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setDeleteModal(true);
                          }}
                          className="cursor-pointer"
                        >
                         <MdDeleteOutline size={16} className="mr-2" />
                         Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td className="border-b p-2">{item.jobTitle}</td>
                  <td className="border-b p-2">{item.companyName}</td>
                  <td className="border-b p-2">{item.category}</td>
                  <td className="border-b p-2">{item.jobDescription}</td>
                  <td className="border-b p-2">{formatDate(item.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filteredData.length > entriesPerPage && (
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-700">
            Showing {indexOfFirstEntry + 1} to{" "}
            {Math.min(indexOfLastEntry, filteredData.length)} of{" "}
            {filteredData.length} entries
          </span>
          <div className="flex space-x-1">
            {Array.from(
              { length: Math.ceil(filteredData.length / entriesPerPage) },
              (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </div>
      )}
      {showModal && selectedJob && (
        <div className="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {selectedJob.jobTitle}
            </h2>
            <p>
              <strong>Company Name:</strong> {selectedJob.companyName}
            </p>
            <p>
              <strong>Category:</strong> {selectedJob.category}
            </p>
            <p>
              <strong>Description:</strong> {selectedJob.jobDescription}
            </p>
            <p>
              <strong>Created At:</strong> {formatDate(selectedJob.createdAt)}
            </p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {editModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-1/2 p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Job</h2>
            <form
              onSubmit={async (e) => {
                // e.preventDefault();
                try {
                  setEditLoading(true);
                  const response = await fetch(
                    BACKEND_URl + `/admin/jobs/${selectedJob.id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(selectedJob),
                    }
                  );
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  const updatedJob = await response.json();
                  setData(
                    data.map((job) =>
                      job.id === selectedJob.id ? updatedJob : job
                    )
                  );
                  setFilteredData(
                    filteredData.map((job) =>
                      job.id === selectedJob.id ? updatedJob : job
                    )
                  );
                  setEditModal(false);
                } catch (error) {
                  console.error("Failed to update job:", error);
                } finally {
                  setEditLoading(false);
                  toast.success("Edited Successfully");
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700">Job Title</label>
                <input
                  type="text"
                  className="p-2 border rounded w-full"
                  value={selectedJob.jobTitle}
                  onChange={(e) =>
                    setSelectedJob({ ...selectedJob, jobTitle: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Company Name</label>
                <input
                  type="text"
                  className="p-2 border rounded w-full"
                  value={selectedJob.companyName}
                  onChange={(e) =>
                    setSelectedJob({
                      ...selectedJob,
                      companyName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <input
                  type="text"
                  className="p-2 border rounded w-full"
                  value={selectedJob.category}
                  onChange={(e) =>
                    setSelectedJob({ ...selectedJob, category: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  className="p-2 border rounded w-full"
                  value={selectedJob.jobDescription}
                  onChange={(e) =>
                    setSelectedJob({
                      ...selectedJob,
                      jobDescription: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                <div className="flex justify-center items-center">
                  Save Changes {editLoading && <ButtonLoader />}
                </div>
              </button>
              <button
                type="button"
                className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {deleteModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center">
           <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
           <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10 max-w-md">
             <h2 className="text-xl font-semibold mb-4">Delete Enquiry</h2>
             <p>
               Are you sure you want to delete ths Job!!
             </p>
             <div className="mt-4 flex ">
               <button
                 onClick={() => setDeleteModal(false)}
                 className="bg-gray-500 text-white p-2 rounded mr-2"
               >
                 Cancel
               </button>
               <button
                 onClick={handleDelete}
                 className="bg-red-500 text-white p-2 rounded flex items-center"
                 disabled={deleteLoading}
               >
                 {deleteLoading ? <Loader isButton/> : "Delete"}
               </button>
             </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default JobsTable;
