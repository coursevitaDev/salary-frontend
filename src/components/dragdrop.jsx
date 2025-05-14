import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdClear } from "react-icons/md";
import "./dragdrop.css";

const DragNdrop = ({
  onFilesSelected,
  width,
  height,
}) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onFilesSelected(files);
  }, [files, onFilesSelected]);

  return (
 <section className="w-full" style={{ width: width, height: height }}>
  <div
    className={`border-2 border-dashed rounded-xl p-6 transition-all duration-200 flex flex-col justify-center items-center gap-3 ${
      files.length > 0 ? "border-purple-500 bg-purple-50" : "border-gray-300 bg-white"
    }`}
    onDrop={handleDrop}
    onDragOver={(event) => event.preventDefault()}
  >
    <div className="text-center text-sm text-gray-600">
      <div className="text-3xl text-purple-700 mb-2 flex justify-center">
        <AiOutlineCloudUpload />
      </div>
      <p className="font-medium">Drag and drop your files here</p>
      <p className="text-xs text-gray-400">
        Limit 15MB per file. Supported: .PDF, .DOCX, .PPTX, .TXT, .XLSX
      </p>
    </div>

    {files.length === 0 && (
      <>
        <input
          type="file"
          hidden
          id="browse"
          onChange={handleFileChange}
          accept=".pdf,.docx,.pptx,.txt,.xlsx"
          multiple
        />
        <label
          htmlFor="browse"
          className="mt-3 inline-block px-4 py-2 bg-purple-700 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-purple-800 transition"
        >
          Browse files
        </label>
      </>
    )}

    {files.length > 0 && (
      <div className="w-full mt-4 space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm"
          >
            <span className="text-sm text-gray-800 truncate">{file.name}</span>
            <MdClear
              onClick={() => handleRemoveFile(index)}
              className="text-red-500 cursor-pointer hover:text-red-700"
            />
          </div>
        ))}
      </div>
    )}
  </div>
</section>

  );
};

export default DragNdrop;