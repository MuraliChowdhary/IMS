"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import axios from "axios";

export default function UploadProductCSV() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0] ?? null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://ims-clxd.onrender.com/api/manager/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Axios response already returns JSON data in `res.data`
      toast.success(res.data.message);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <Card className="max-w-xl mx-auto mt-10 p-6 shadow-lg">
        <CardHeader>
          <CardTitle>📦 Bulk Upload Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept=".csv" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={!file}>
            Upload CSV
          </Button>
          <p className="text-sm text-muted-foreground">
            Accepted format: <code>.csv</code> with fields like{" "}
            <code>name, price, stock, SKU...</code>
          </p>
        </CardContent>
      </Card>
    </>
  );
}
