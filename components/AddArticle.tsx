"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { BACKEND_URl } from "@/constants";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import ButtonLoader from "./ButtonLoader";
import Image from "next/image";
import Loader from "./Loader";

const AddArticle: React.FC = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const route = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("seoKeywords", seoKeywords);
    formData.append("shortDescription", shortDescription);
    formData.append("description", description);
    formData.append("user", user);
    formData.append("seoTitle", seoTitle);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      const response = await fetch(
        "https://ecoavenstra-be.onrender.com/api/v1/admin/articles",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Article successfully submitted:", responseData);
      toast.success("Article Created Successfully");
    } catch (error) {
      console.error("Failed to submit article:", error);
      toast.error("Failed to create article");
    } finally {
      setIsLoading(false);
      route.push("/manage/article");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white mt-2">
      <h1 className="text-2xl font-bold mb-4">Add Article</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm text-gray-700">
              Title
            </label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl mt-2 border-gray-400"
              placeholder="Enter Title"
            />
          </div>
          <div>
            <label htmlFor="user" className="block text-sm text-gray-700">
              User
            </label>
            <Input
              type="text"
              id="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="rounded-xl mt-2 border-gray-400"
              placeholder="Enter User"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm text-gray-700">
              Category
            </label>
            <Input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl mt-2 border-gray-400"
              placeholder="Enter Category"
            />
          </div>
          <div>
            <label htmlFor="seoTitle" className="block text-sm text-gray-700">
              SEO Title
            </label>
            <Input
              type="text"
              id="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="rounded-xl mt-2 border-gray-400"
              placeholder="Enter SEO Title"
            />
          </div>
        </div>
        <div>
          <label htmlFor="seoKeywords" className="block text-sm text-gray-700">
            SEO Keywords
          </label>
          <Input
            id="seoKeywords"
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            className="rounded-xl mt-2 border-gray-400"
            placeholder="Enter SEO Keywords"
          />
        </div>
        <div>
          <label
            htmlFor="shortDescription"
            className="block text-sm text-gray-700"
          >
            Short Description
          </label>
          <Input
            id="shortDescription"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="rounded-xl mt-2 border-gray-400"
            placeholder="Enter Short Description"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm text-gray-700">
            Description
          </label>
          <textarea
          rows={4}
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl mt-2 border-gray-800 w-full p-2 border"
            placeholder="Enter Description"
          />
        </div>
        <div>
          <label htmlFor="coverImage" className="block text-sm text-gray-700">
            Cover Image
          </label>
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
          {preview && (
            <Image
              height={20}
              width={20}
              src={preview}
              alt="Cover Preview"
              className="mt-4 w-full h-48 object-cover rounded-lg shadow-md"
            />
          )}
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <div className="flex gap-3">
              <div className="">Submit</div>
              {isLoading && <Loader isButton />}  
            </div>
            <Toaster />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddArticle;
