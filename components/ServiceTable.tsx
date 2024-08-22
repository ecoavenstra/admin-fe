"use client";
import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { FaFileExcel, FaEye, FaPrint, FaPlusCircle } from "react-icons/fa";
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

interface Service {
  id: number;
  title: string;
  type: string;
  shortDescription: string;
  description: string;
  createdAt: string;
}

const ServiceTable: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [data, setData] = useState<Service[]>([]);
  const [filteredData, setFilteredData] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [visibleDropdown, setVisibleDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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
        const response = await fetch(BACKEND_URl + "/admin/services");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (Array.isArray(result.services)) {
          setData(result.services);
          setFilteredData(result.services);
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
      const title = item.title?.toLowerCase() ?? "";
      return title.includes(searchTerm.toLowerCase());
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
      const response = await fetch(BACKEND_URl + `/admin/services/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const service = await response.json();
      setSelectedService(service?.service);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch service:", error);
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setEditModal(true);
  };

  const handleDelete = async () => {
    if (selectedService) {
      try {
        setDeleteLoading(true);
        const response = await fetch(
          BACKEND_URl + `/admin/services/${selectedService.id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setData(data.filter((service) => service.id !== selectedService.id));
        setFilteredData(
          filteredData.filter((service) => service.id !== selectedService.id)
        );
        setDeleteModal(false);
        setSelectedService(null);
      } catch (error) {
        console.error("Failed to delete service:", error);
      } finally {
        setDeleteLoading(false);
        toast.success("Deleted Successfully");
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Service</h1>
        <button
          onClick={() => router.push("/manage/service/add-service")}
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
              <th className="border-b p-2">Title</th>
              <th className="border-b p-2">Type</th>
              <th className="border-b p-2">Short Description</th>
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
                  <td className="border-b p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="px-3 py-1  bg-gray-200 text-gray-800  rounded-md hover:bg-gray-300 "
                        >
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-24 bg-white">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleShow(item.id)}
                        >
                          <FaEye className="mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleEdit(item)}
                        >
                          <FiEdit className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedService(item);
                            setDeleteModal(true);
                          }}
                        >
                          <MdDeleteOutline className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td className="border-b p-2">{item.title}</td>
                  <td className="border-b p-2">{item.type}</td>
                  <td className="border-b p-2">
                    {item.shortDescription.split(" ").slice(0, 4).join(" ")}...
                  </td>
                  <td className="border-b p-2">
                    {item.description.split(" ").slice(0, 4).join(" ")}...
                  </td>
                  <td className="border-b p-2">{formatDate(item.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {indexOfFirstEntry + 1} to{" "}
          {Math.min(indexOfLastEntry, filteredData.length)} of{" "}
          {filteredData.length} entries
        </div>
        <div className="flex space-x-2">
          {Array.from({
            length: Math.ceil(filteredData.length / entriesPerPage),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              } px-3 py-1 rounded`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this service?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                {deleteLoading ? <Loader isButton /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="bg-white p-6 w-1/2 rounded-lg shadow-lg z-10 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Service</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setEditLoading(true);
                try {
                  const response = await fetch(
                    BACKEND_URl + `/admin/services/${selectedService.id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(selectedService),
                    }
                  );
                  if (!response.ok) {
                    throw new Error("Failed to update service");
                  }
                  const updatedService = await response.json();
                  setData((prevData) =>
                    prevData.map((service) =>
                      service.id === selectedService.id
                        ? updatedService.service
                        : service
                    )
                  );
                  setFilteredData((prevData) =>
                    prevData.map((service) =>
                      service.id === selectedService.id
                        ? updatedService.service
                        : service
                    )
                  );
                  setEditModal(false);
                  toast.success("Service updated successfully");
                } catch (error) {
                  console.error("Failed to update service:", error);
                  toast.error("Failed to update service");
                } finally {
                  setEditLoading(false);
                }
              }}
            >
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={selectedService.title}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      title: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium">
                  Type
                </label>
                <input
                  type="text"
                  id="type"
                  value={selectedService.type}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      type: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="shortDescription"
                  className="block text-sm font-medium"
                >
                  Short Description
                </label>
                <textarea
                  id="shortDescription"
                  value={selectedService.shortDescription}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      shortDescription: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={selectedService.description}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editLoading ? <Loader isButton /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0  bg-black  bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg flex flex-col gap-3">
            <h2 className="text-xl font-semibold mb-4">Service Details</h2>
            <p>
              <strong>Title:</strong> {selectedService.title}
            </p>
            <p>
              <strong>Type:</strong> {selectedService.type}
            </p>
            <p>
              <strong>Short Description:</strong>{" "}
              {selectedService.shortDescription}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              <div>
                <p className="text-gray-700 ">
                  {!isExpanded &&
                    `${selectedService.description
                      .split(" ")
                      .slice(0, 10)
                      .join(" ")}...`}
                </p>
                {isExpanded && (
                  <div className=" max-h-48 overflow-y-auto p-2  border-gray-300 rounded">
                    <p>{selectedService.description}</p>
                  </div>
                )}
                {selectedService.description.split(" ").length > 20 && (
                  <button
                    onClick={toggleExpand}
                    className="text-blue-500 hover:underline text-xs ml-1"
                  >
                    {isExpanded ? "View Less" : "View More"}
                  </button>
                )}
               
              </div>
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {formatDate(selectedService.createdAt)}
            </p>
            <div className="flex justify-end mt-4">
              {deleteLoading ? (
                <Loader isButton />
              ) : (
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTable;
