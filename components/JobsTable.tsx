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
import DeleteModal from "./DeleteModal";
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
  companyType: string;
  name: string;
  email: string;
  isApproved: any;
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
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    document.title = "Ecoavenstra - Manage";

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
      setSelectedJob(job?.job);
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
      setDeleteLoading(true);
      try {
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
        setDeleteLoading(false);
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
              <th className="border-b p-2">Approve Status</th>
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
              currentEntries.map((item: any, index) => (
                <tr key={item.id}>
                  <td className="border-b p-2">
                    {indexOfFirstEntry + index + 1}
                  </td>
                  <td className="border-b p-2 relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="px-3 py-1  bg-gray-200 text-gray-800  rounded-md hover:bg-gray-300"
                        >
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleShow(item.id)}>
                          <FaEye className="mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <FiEdit className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setDeleteModal(true);
                            setSelectedJob(item);
                          }}
                        >
                          <MdDeleteOutline className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td className="border-b p-2">{item.jobTitle}</td>
                  <td className="border-b p-2">{item.companyName}</td>
                  <td className="border-b p-2">{item.category}</td>
                  <td className="border-b p-2">
                    <span
                      className={`font-bold ${
                        item.isApproved ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {item.isApproved ? "True" : "False"}
                    </span>
                  </td>
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Job Details</h2>
            <p className="mb-2">
              <strong>Recruiter Name:</strong> {selectedJob.name}
            </p>
            <p className="mb-2">
              <strong>Email :</strong> {selectedJob.email}
            </p>
            <p className="mb-2">
              <strong>Company Type:</strong> {selectedJob.companyType}
            </p>
            <p className="mb-2">
              <strong>Job Title:</strong> {selectedJob.jobTitle}
            </p>
            <p className="mb-2">
              <strong>Company Name:</strong> {selectedJob.companyName}
            </p>
            <p className="mb-2">
              <strong>Category:</strong> {selectedJob.category}
            </p>
            <p className="mb-2">
              <strong>Salary Range:</strong> {selectedJob.salaryRange}
            </p>
            <p className="mb-2">
              <strong>Job Location:</strong> {selectedJob.jobLocation}
            </p>
            <p className="mb-2">
              <strong>Contact Number:</strong> {selectedJob.contactNumber}
            </p>
            <p className="mb-2">
              <strong>Open Till:</strong> {formatDate(selectedJob.openTill)}
            </p>
            <p className="mb-2">
              <strong>Created At:</strong> {formatDate(selectedJob.createdAt)}
            </p>
            <p className="mb-2">
              <strong>Approved Status:</strong>{" "}
              <span
                className={`font-bold ${
                  selectedJob.isApproved ? "text-green-500" : "text-red-500"
                }`}
              >
                {selectedJob.isApproved ? "True" : "False"}
              </span>
            </p>
            <p className="mb-2">
              <strong>Description:</strong>
              <div>
                <p className="text-gray-700  max-h-48 overflow-y-auto  border-gray-300 rounded">
                  {!isExpanded &&
                    `${selectedJob.jobDescription
                      .split(" ")
                      .slice(0, 5)
                      .join(" ")} ${
                      selectedJob.jobDescription.split(" ").length > 20 && "..."
                    }`}
                </p>
                {isExpanded && (
                  <div className=" max-h-48 overflow-y-auto  border-gray-300 rounded">
                    <p>{selectedJob.jobDescription}</p>
                  </div>
                )}
                {selectedJob.jobDescription.split(" ").length > 20 && (
                  <button
                    onClick={toggleExpand}
                    className="text-blue-500 hover:underline  text-sm "
                  >
                    {isExpanded ? "View Less" : "View More"}
                  </button>
                )}
              </div>
            </p>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
   {editModal && selectedJob && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 flex flex-col gap-4 rounded shadow-lg w-11/12 max-w-4xl h-[90vh] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Edit Job</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
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
              data.map((job) => (job.id === selectedJob.id ? updatedJob : job))
            );
            setFilteredData(
              filteredData.map((job) =>
                job.id === selectedJob.id ? updatedJob : job
              )
            );
            setEditModal(false);
            toast.success("Edited Successfully");
          } catch (error) {
            console.error("Failed to update job:", error);
          } finally {
            setEditLoading(false);
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              value={selectedJob.name}
              onChange={(e) =>
                setSelectedJob({ ...selectedJob, name: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="p-2 border rounded w-full"
              value={selectedJob.email}
              onChange={(e) =>
                setSelectedJob({ ...selectedJob, email: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Company Type</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              value={selectedJob.companyType}
              onChange={(e) =>
                setSelectedJob({ ...selectedJob, companyType: e.target.value })
              }
            />
          </div>
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
                setSelectedJob({ ...selectedJob, companyName: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Salary Range</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              value={selectedJob.salaryRange}
              onChange={(e) =>
                setSelectedJob({ ...selectedJob, salaryRange: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Vacancy</label>
            <input
              type="number"
              className="p-2 border rounded w-full"
              value={selectedJob.vacancy}
              onChange={(e) =>
                setSelectedJob({ ...selectedJob, vacancy: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Job Type</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              value={selectedJob.jobType}
              onChange={(e) =>
                setSelectedJob({ ...selectedJob, jobType: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Job Location</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              value={selectedJob.jobLocation}
              onChange={(e) =>
                setSelectedJob({ ...selectedJob, jobLocation: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              value={selectedJob.contactNumber}
              onChange={(e) =>
                setSelectedJob({
                  ...selectedJob,
                  contactNumber: parseInt(e.target.value, 10),
                })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Open Till</label>
            <input
              type="date"
              className="p-2 border rounded w-full"
              value={selectedJob.openTill}
              onChange={(e) =>
                setSelectedJob({ ...selectedJob, openTill: e.target.value })
              }
            />
          </div>
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
        <div className="mb-4">
          <label className="block text-gray-700">Is Approved</label>
          <select
            className="p-2 border rounded w-full"
            value={selectedJob.isApproved}
            onChange={(e) =>
              setSelectedJob({
                ...selectedJob,
                isApproved: e.target.value === "true",
              })
            }
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Changes {editLoading && <Loader isButton />}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setEditModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {deleteModal && selectedJob && (
        <div className="">
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Delete Article</h2>
              <p className="mb-6">
                Are you sure you want to delete this article? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="bg-gray-300 text-black p-2 rounded"
                  // disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white p-2 rounded"
                  // disabled={isLoading}
                >
                  {deleteLoading ? <Loader isButton /> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsTable;
