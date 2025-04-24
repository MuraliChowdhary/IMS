"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import axios from "axios";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons";

export default function UploadProductCSV() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    added?: number;
    duplicates?: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      
      // Basic file validation
      if (selectedFile && selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
        toast.error("Please select a CSV file");
        return;
      }
      
      if (selectedFile) {
        setFile(selectedFile);
      }
      setUploadResult(null); // Reset previous results
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/manager/add/csv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        }
      );

      // Handle successful upload
      setUploadResult({
        success: true,
        message: res.data.message,
        added: res.data.added?.count || 0,
        duplicates: res.data.duplicates || 0,
      });
      toast.success(res.data.message);
      
      // Reset file input after successful upload
      setFile(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
    } catch (err: any) {
      console.error("Upload error:", err);
      
      let errorMessage = "Something went wrong";
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.statusText || 
                      `Server responded with ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "No response from server";
      } else {
        errorMessage = err.message || "Error setting up request";
      }

      setUploadResult({
        success: false,
        message: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-10 p-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📦</span>
          <span>Bulk Upload Products</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <p className="text-sm text-muted-foreground">
            Accepted format: <code>.csv</code> with required fields:{" "}
            <code>name, price, stock</code> and optional fields:{" "}
            <code>category, SKU, isPerishable, seasonality, shelfLife, imageUrls, description, supplierId</code>
          </p>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        {uploadResult && (
          <Alert variant={uploadResult.success ? "default" : "destructive"}>
            {uploadResult.success ? (
              <CheckCircledIcon className="h-4 w-4" />
            ) : (
              <ExclamationTriangleIcon className="h-4 w-4" />
            )}
            <AlertTitle>
              {uploadResult.success ? "Upload Successful" : "Upload Failed"}
            </AlertTitle>
            <AlertDescription>
              {uploadResult.message}
              {uploadResult.success && (
                <>
                  <p>Products added: {uploadResult.added}</p>
                  {uploadResult.duplicates && (
                    <p>Duplicate products skipped: {uploadResult.duplicates}</p>
                  )}
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? "Uploading..." : "Upload CSV"}
        </Button>

        <div className="text-xs text-muted-foreground">
          <p>CSV format example:</p>
          <pre className="bg-muted p-2 rounded mt-1 overflow-x-auto">
            {`name,price,stock,category,SKU,isPerishable\n`}
            {`Milk,2.99,100,Dairy,MILK-001,true\n`}
            {`Bread,1.99,50,Bakery,BRD-001,true\n`}
            {`Notebook,3.49,200,Stationery,NOTE-001,false`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}