import { useState } from "react";
import { Navigation } from "@components/Navigation";

export default function UploadTest() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("idle");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus("Please select a file.");
      return;
    }

    setStatus("Getting upload URL...");

    try {
      // 1. Get presigned URL from our server
      const presignedUrlResponse = await fetch("/api/upload/presigned-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!presignedUrlResponse.ok) {
        throw new Error("Failed to get presigned URL.");
      }

      const { url: signedUrl, key } = await presignedUrlResponse.json();
      setStatus("Uploading...");

      // 2. Upload file directly to R2 using the presigned URL
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed.");
      }

      setStatus("Upload successful!");
      // Construct the public URL
      const publicUrl = `${process.env.VITE_R2_PUBLIC_URL}/${key}`;
      setUploadedFileUrl(publicUrl);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Test File Upload to R2
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            This page tests the file upload functionality.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Select a file to upload
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-jobequal-green-light file:text-jobequal-green hover:file:bg-jobequal-green/20"
              />
            </div>
            <button
              type="submit"
              disabled={!file || status === "Uploading..."}
              className="w-full bg-jobequal-green text-white py-2 px-4 rounded-md hover:bg-jobequal-green-hover disabled:opacity-50"
            >
              Upload File
            </button>
          </form>

          {status !== "idle" && (
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Status: {status}
            </p>
          )}

          {uploadedFileUrl && (
            <div className="mt-4 text-center">
              <p className="text-green-600 font-semibold">
                File uploaded successfully!
              </p>
              <a
                href={uploadedFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline break-all"
              >
                {uploadedFileUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
