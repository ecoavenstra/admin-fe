"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { FaFileExcel, FaEye, FaPrint, FaPlusCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { BACKEND_URl } from "@/constants";
import toast from "react-hot-toast";
import Loader from "./Loader";
import Image from "next/image";
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
import DeleteModal from "@/components/DeleteModal"; // Assuming you have a DeleteModal component like in the EnquiryTable
import EditArticleModal from "./EditArticleModal";
// import EditModal from "@/components/EditModal"; // Assuming you have an EditModal component

interface Article {
  id: number;
  title: string;
  user: string;
  category: string;
  coverImage: string;
  createdAt: string;
  description: string;
}

const ArticleTable: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [data, setData] = useState<Article[]>([]);
  const [filteredData, setFilteredData] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(BACKEND_URl + "/admin/articles");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (Array.isArray(result.articles)) {
          setData(result.articles);
          setFilteredData(result.articles);
        } else {
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
      const title = item.title?.toLowerCase() ?? "";
      const user = item.user?.toLowerCase() ?? "";
      const category = item.category?.toLowerCase() ?? "";
      const createdAt = item.createdAt?.toLowerCase() ?? "";

      return (
        title.includes(searchTerm.toLowerCase()) ||
        user.includes(searchTerm.toLowerCase()) ||
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

  const handleShow = async (id: number) => {
    try {
      setViewLoading(true);
      const response = await fetch(BACKEND_URl + `/admin/articles/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const article = await response.json();
      setSelectedArticle(article?.article);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch article:", error);
    } finally {
      setViewLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setEditModal(true);
  };

  const handleDelete = async () => {
    if (selectedArticle) {
      try {
        setDeleteLoading(true);
        const response = await fetch(
          BACKEND_URl + `/admin/articles/${selectedArticle.id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setData(data.filter((article) => article.id !== selectedArticle.id));
        setFilteredData(
          filteredData.filter((article) => article.id !== selectedArticle.id)
        );
        setDeleteModal(false);
        setSelectedArticle(null);
      } catch (error) {
        console.error("Failed to delete article:", error);
      } finally {
        toast.success("Article deleted successfully");
        setDeleteLoading(false);
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Article</h1>
        <button
          onClick={() => router.push("/manage/article/add-article")}
          className="text-blue-600 flex items-center"
        >
          <FaPlusCircle className="mr-2" />
          Add New
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex  items-center space-x-2">
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
        <table className="w-full  text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">#</th>
              <th className="border-b p-2">Actions</th>
              <th className="border-b p-2">Title</th>
              <th className="border-b p-2">Creator</th>
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
                            setSelectedArticle(item);
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
                  <td className="border-b p-2">{item.user}</td>
                  <td className="border-b p-2">{item.category}</td>
                  <td className="border-b p-2">
                    {item.description.split(" ").slice(0, 5).join(" ")}...
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
          {Array.from(
            { length: Math.ceil(filteredData.length / entriesPerPage) },
            (_, i) => i + 1
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`px-4 py-2 border ${
                pageNumber === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>

      {/* View Modal */}
      {showModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">Article Details</h2>
            <div className="flex flex-col items-center mb-4">
              {selectedArticle.coverImage && (
                <div className="mb-4">
                  <Image
                    src={selectedArticle.coverImage}
                    alt="Cover Image"
                    width={400}
                    height={100}
                    className="object-cover rounded-md"
                  />
                </div>
              )}

              <h3 className="text-xl font-bold mb-2">
                {selectedArticle.title}
              </h3>
              <p className="text-gray-700 mb-4">
                <div>
                  <p className="text-gray-700  max-h-48 overflow-y-auto  border-gray-300 rounded">
                    {!isExpanded &&
                      `${selectedArticle.description
                        .split(" ")
                        .slice(0, 5)
                        .join(" ")} ${
                        selectedArticle.description.split(" ").length > 20 &&
                        "..."
                      }`}
                  </p>
                  {isExpanded && (
                    <div className=" max-h-48 overflow-y-auto  border-gray-300 rounded">
                      <p>{selectedArticle.description}</p>
                    </div>
                  )}
                  {selectedArticle.description.split(" ").length > 20 && (
                    <button
                      onClick={toggleExpand}
                      className="text-blue-500 hover:underline  text-sm "
                    >
                      {isExpanded ? "View Less" : "View More"}
                    </button>
                  )}
                </div>
              </p>
              <p className="text-sm text-gray-500">
                Created by: {selectedArticle.user}
              </p>
              <p className="text-sm text-gray-500">
                Created at: {formatDate(selectedArticle.createdAt)}
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black p-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && selectedArticle && (
        <EditArticleModal
          article={selectedArticle}
          setEditModal={setEditModal}
          setData={setData}
          setFilteredData={setFilteredData}
        />
      )}

      {/* Delete Modal */}
      {deleteModal && selectedArticle && (
        <DeleteModal
          item={selectedArticle}
          onClose={() => setDeleteModal(false)}
          onConfirm={handleDelete}
          isLoading={deleteLoading}
          title="Delete Article"
          description="Are you sure you want to delete this article? This action cannot be undone."
        />
      )}
    </div>
  );
};

export default ArticleTable;
