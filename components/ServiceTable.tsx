"use client";
import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { FaFileExcel, FaEye, FaPrint, FaPlusCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:9999/api/v1/admin/services");
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
  const currentEntries = Array.isArray(filteredData) ? filteredData.slice(indexOfFirstEntry, indexOfLastEntry) : [];

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
      const response = await fetch(`http://localhost:9999/api/v1/admin/services/${id}`);
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
        const response = await fetch(`http://localhost:9999/api/v1/admin/services/${selectedService.id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setData(data.filter((service) => service.id !== selectedService.id));
        setFilteredData(filteredData.filter((service) => service.id !== selectedService.id));
        setDeleteModal(false);
        setSelectedService(null);
      } catch (error) {
        console.error("Failed to delete service:", error);
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
                <td colSpan={7} className="text-center p-4">Loading...</td>
              </tr>
            ) : (
              currentEntries.map((item, index) => (
                <tr key={item.id}>
                  <td className="border-b p-2">{indexOfFirstEntry + index + 1}</td>
                  <td className="border-b p-2 relative">
                    <button
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded"
                      onClick={() => toggleDropdown(item.id)}
                    >
                      Action
                    </button>
                    {visibleDropdown === item.id && (
                      <div
                        ref={dropdownRef}
                        className="absolute z-10 bg-white border rounded shadow-md mt-1"
                      >
                        <button
                          className="block hover:bg-gray-200 w-full text-left px-4 py-2 text-sm"
                          onClick={() => handleShow(item.id)}
                        >
                          Show
                        </button>
                        <button
                          className="block hover:bg-gray-200 w-full text-left px-4 py-2 text-sm"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="block hover:bg-gray-200 w-full text-left px-4 py-2 text-sm"
                          onClick={() => {
                            setSelectedService(item);
                            setDeleteModal(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="border-b p-2">{item.title}</td>
                  <td className="border-b p-2">{item.type}</td>
                  <td className="border-b p-2">{item.shortDescription}</td>
                  <td className="border-b p-2">{item.description}</td>
                  <td className="border-b p-2">{formatDate(item.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filteredData.length > entriesPerPage && (
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div>
            Page {currentPage} of {Math.ceil(filteredData.length / entriesPerPage)}
          </div>
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredData.length / entriesPerPage)}
          >
            Next
          </button>
        </div>
      )}
      {showModal && selectedService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">Service Details</h2>
            <p><strong>Title:</strong> {selectedService.title}</p>
            <p><strong>Type:</strong> {selectedService.type}</p>
            <p><strong>Short Description:</strong> {selectedService.shortDescription}</p>
            <p><strong>Description:</strong> {selectedService.description}</p>
            <p><strong>Created At:</strong> {formatDate(selectedService.createdAt)}</p>
            <button
              className="mt-4 bg-gray-300 px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {editModal && selectedService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">Edit Service</h2>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                if (!selectedService) return;

                const formData = new FormData(event.target as HTMLFormElement);
                const updatedService = {
                  ...selectedService,
                  title: formData.get("title") as string,
                  type: formData.get("type") as string,
                  shortDescription: formData.get("shortDescription") as string,
                  description: formData.get("description") as string,
                };

                try {
                  const response = await fetch(`http://localhost:9999/api/v1/admin/services/${selectedService.id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedService),
                  });
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  const updatedServices = data.map((service) =>
                    service.id === selectedService.id ? updatedService : service
                  );
                  setData(updatedServices);
                  setFilteredData(updatedServices);
                  setEditModal(false);
                  setSelectedService(null);
                } catch (error) {
                  console.error("Failed to update service:", error);
                }
              }}
            >
              <div className="mb-4">
                <label htmlFor="title" className="block mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={selectedService.title}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="type" className="block mb-2">
                  Type
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  defaultValue={selectedService.type}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="shortDescription" className="block mb-2">
                  Short Description
                </label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  defaultValue={selectedService.shortDescription}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={selectedService.description}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Delete Service</h2>
            <p>Are you sure you want to delete this service?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTable;
