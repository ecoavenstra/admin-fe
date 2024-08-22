import React, { useState, ChangeEvent } from "react";
import { BACKEND_URl } from "@/constants";
import toast from "react-hot-toast";
import Loader from "./Loader";
import Image from "next/image";

interface EditModalProps {
  article: any; // This should match the article interface/type
  setEditModal: (state: boolean) => void;
  setData: (data: any[]) => void;
  setFilteredData: (data: any[]) => void;
}

const EditArticleModal: React.FC<EditModalProps> = ({
  article,
  setEditModal,
  setData,
  setFilteredData,
}) => {
  const [title, setTitle] = useState(article.title);
  const [description, setDescription] = useState(article.description);
  const [category, setCategory] = useState(article.category);
  const [coverImage, serCoverImage] = useState(article?.coverImage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URl}/admin/articles/${article.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            category,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the article.");
      }

      const updatedArticle = await response.json();
      //@ts-ignore
      setData((prevData: any[]) =>
        prevData.map((item) =>
          item.id === article.id ? updatedArticle.article : item
        )
      );
      //@ts-ignore
      setFilteredData((prevData: any[]) =>
        prevData.map((item) =>
          item.id === article.id ? updatedArticle.article : item
        )
      );

      toast.success("Article updated successfully");
      setEditModal(false);
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error("Failed to update article");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">Edit Article</h2>
        {coverImage && (
          <div className="flex justify-center">
            <Image alt="CoverImage" src={coverImage} height={400} width={200} />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="category">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={handleCategoryChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setEditModal(false)}
            className="bg-gray-300 text-black p-2 rounded"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? <Loader isButton /> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditArticleModal;
