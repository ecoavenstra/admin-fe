  "use client";
  import React, { useState, useEffect, ChangeEvent } from "react";
  import { FaEye } from "react-icons/fa";
  import { useRouter } from "next/navigation";
  import { BACKEND_URl } from "@/constants";
  import toast from "react-hot-toast";
  import ButtonLoader from "./ButtonLoader";
  import Loader from "./Loader";
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

  interface Enquiry {
    id: number;
    name: string;
    email: string;
    subject: string;
    category: string;
    contactNumber: string;
    status: string;
    message: string;
    createdAt: string;
    updatedAt: string;
  }

  const EnquiryTable: React.FC = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [data, setData] = useState<Enquiry[]>([]);
    const [filteredData, setFilteredData] = useState<Enquiry[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editLoading, setEditLoading] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    useEffect(() => {
      const fetchData = async () => {
        document.title = "Ecoavenstra - Enquiry";

        try {
          setIsLoading(true);
          const response = await fetch(BACKEND_URl + "/admin/enquiries");
          // const response = await fetch("http://localhost:9999/api/v1/admin/enquiries");

          if (!response.ok) {

            throw new Error("Network response was not ok");
          }
          const result = await response.json();
          if (Array.isArray(result)) {
            setData(result);
            setFilteredData(result);
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
      const filtered = data.filter((item) => {
        const name = item.name?.toLowerCase() ?? "";
        return name.includes(searchTerm.toLowerCase());
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

    const handleShow = async (id: number) => {
      try {
        const response = await fetch(BACKEND_URl + `/admin/enquiries/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const enquiry = await response.json();
        console.log(enquiry)

        setSelectedEnquiry(enquiry);
        setShowModal(true);
      } catch (error) {
        console.error("Failed to fetch enquiry:", error);
      }
    };

    const handleEdit = (enquiry: Enquiry) => {
      setSelectedEnquiry(enquiry);
      setEditModal(true);
    };

    const handleStatusChange = async (status: string) => {
      if (selectedEnquiry) {
        try {
          setEditLoading(true);
          const response = await fetch(
            BACKEND_URl + `/admin/enquiries/${selectedEnquiry.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status }),
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const updatedEnquiries = data.map((enquiry) =>
            enquiry.id === selectedEnquiry.id ? { ...enquiry, status } : enquiry
          );
          setData(updatedEnquiries);
          setFilteredData(updatedEnquiries);
          setEditModal(false);
          setSelectedEnquiry(null);
          toast.success("Status updated successfully");
        } catch (error) {
          console.error("Failed to update status:", error);
        } finally {
          setEditLoading(false);
        }
      }
    };

    const handleDelete = async () => {
      if (selectedEnquiry) {
        try {
          setDeleteLoading(true);
          const response = await fetch(
            BACKEND_URl + `/admin/enquiries/${selectedEnquiry.id}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          setData(data.filter((enquiry) => enquiry.id !== selectedEnquiry.id));
          setFilteredData(
            filteredData.filter((enquiry) => enquiry.id !== selectedEnquiry.id)
          );
          setDeleteModal(false);
          setSelectedEnquiry(null);
          toast.success("Deleted successfully");
        } catch (error) {
          console.error("Failed to delete enquiry:", error);
        } finally {
          setDeleteLoading(false);
        }
      }
    };

    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Enquiries</h1>
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
                <th className="border-b p-2">Name</th>
                <th className="border-b p-2">Email</th>
                <th className="border-b p-2">Subject</th>
                <th className="border-b p-2">Category</th>
                <th className="border-b p-2">Contact Number</th>
                <th className="border-b p-2">Status</th>
                <th className="border-b p-2">Message</th>
                <th className="border-b p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="text-center p-4">
                    <Loader />
                  </td>
                </tr>
              ) : (
                currentEntries.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border-b p-2">{index + 1}</td>
                    <td className="border-b p-2">
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
                              setSelectedEnquiry(item);
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
                    <td className="border-b p-2">{item.name}</td>
                    <td className="border-b p-2">{item.email}</td>
                    <td className="border-b p-2">{item.subject}</td>
                    <td className="border-b p-2">{item.category}</td>
                    <td className="border-b p-2">{item.contactNumber}</td>
                    <td className="border-b p-2">{item.status}</td>
                    <td className="border-b p-2">{item.message}</td>
                    <td className="border-b p-2">{formatDate(item.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-end">
          <nav>
            <ul className="flex list-none space-x-2">
              {Array.from(
                { length: Math.ceil(filteredData.length / entriesPerPage) },
                (_, i) => (
                  <li key={i}>
                    <button
                      onClick={() => handlePageChange(i + 1)}
                      className={`p-2 border rounded ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>

        {/* Modals */}
        {/* Show Modal */}
        {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-gray-900 opacity-50 rounded-lg"></div>
        <div className="bg-white p-8 w-full max-w-lg rounded-lg shadow-2xl z-10 transform transition-transform duration-300 scale-95">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Enquiry Details</h2>
          <div className="space-y-4 text-gray-700">
            <p><strong>Name:</strong> {selectedEnquiry?.name}</p>
            <p><strong>Email:</strong> {selectedEnquiry?.email}</p>
            <p><strong>Subject:</strong> {selectedEnquiry?.subject}</p>
            <p><strong>Category:</strong> {selectedEnquiry?.category}</p>
            <p><strong>Contact Number:</strong> {selectedEnquiry?.contactNumber}</p>
            <p><strong>Message:</strong> {selectedEnquiry?.message}</p>
            <p><strong>Status:</strong> {selectedEnquiry?.status}</p>
            <p><strong>Created At:</strong> {selectedEnquiry ? formatDate(selectedEnquiry?.createdAt) : ""}</p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
      
        )}

        {/* Edit Modal */}
        {editModal && (
          <div className="fixed inset-0 z-50  flex items-center justify-center">
            <div className="absolute inset-0  bg-gray-900 opacity-50"></div>
            <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10 max-w-md">
              <h2 className="text-xl font-semibold mb-4">Edit Enquiry Status</h2>
              <p>
                <strong>Name:</strong> {selectedEnquiry?.name}
              </p>
              <p>
                <strong>Current Status:</strong> {selectedEnquiry?.status}
              </p>
              <div className="mt-4">
                <label htmlFor="status" className="block text-sm font-medium">
                  Update Status
                </label>
                <select
                  id="status"
                  className="mt-1 block w-full p-2 border rounded"
                  value={selectedEnquiry?.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="pending">pending</option>
                  <option value="resolved">resolved</option>
                </select>
              </div>
              <div className="mt-4 flex">
                <button
                  onClick={() => setEditModal(false)}
                  className="bg-gray-500 text-white p-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusChange(selectedEnquiry?.status!)}
                  className="bg-blue-500 text-white p-2 rounded flex items-center"
                  disabled={editLoading}
                >
                  {editLoading ? <Loader isButton = {true} /> : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Delete Enquiry</h2>
            <p>
              Are you sure you want to delete the enquiry from{" "}
              <strong>{selectedEnquiry?.name}</strong>?
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

  export default EnquiryTable;
