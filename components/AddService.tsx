"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import Loader from "./Loader";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BACKEND_URl } from "@/constants";

const AddService: React.FC = () => {
  const route = useRouter();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    const serviceData = { title, type, shortDescription, description };

    try {
      const response = await fetch(
        BACKEND_URl + "/admin/services",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviceData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
    } catch (error) {
      console.error("Failed to submit service:", error);
    } finally {
      toast.success("Service added successfully!");

      setIsLoading(false);
      route.push("/manage/service");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white mt-2 mb-7">
      <h1 className="text-2xl font-bold mb-4">Add Service</h1>
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
            <label htmlFor="type" className="block text-sm text-gray-700">
              Type
            </label>
            <Input
              type="text"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-xl mt-2 border-gray-400"
              placeholder="Enter Type"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="shortDescription"
            className="block text-sm text-gray-700"
          >
            Short Description
          </label>
          <Input
            // as="textarea"
            id="shortDescription"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="rounded-xl mt-2 border-gray-400"
            placeholder="Enter Short Description"
            // rows={3}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm text-gray-700">
            Description
          </label>
          <textarea
            // as="textarea"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl mt-2 border p-2 w-full border-gray-400"
            placeholder="Enter Description"
            rows={6}
          />
          {/* Add rich text editor here if needed */}
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit {isLoading && <Loader isButton/>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;
