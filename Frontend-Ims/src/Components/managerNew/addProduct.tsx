/*
File: src/Components/managerNew/AddProductDialog.tsx
Description: A dialog component with a form for adding new products.
*/
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Checkbox } from '@/Components/ui/checkbox';
import { IconLoader2 } from '@tabler/icons-react';

// --- Interfaces ---
interface Supplier {
  id: string;
  name: string;
}

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void; // To refresh product list after adding
}

export const AddProductDialog = ({ isOpen, onClose, onProductAdded }: AddProductDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    supplierId: '',
    SKU: '',
    isPerishable: false,
    seasonality: '',
    shelfLife: '',
    imageUrls: [] as string[],
  });
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch suppliers when the dialog opens
  useEffect(() => {
    if (isOpen) {
      const fetchSuppliers = async () => {
        try {
          // Replace with your actual supplier API endpoint
          // const response = await axios.get('/api/manager/suppliers');
          // setSuppliers(response.data.suppliers);
          
          // Mocking suppliers for now
          setSuppliers([
            { id: 'cm77dfehf0002v1osfa2ne9j6', name: 'Samsung Electronics' },
            { id: 'sup-fresh-produce', name: 'Fresh Produce Inc.' },
            { id: 'sup-national-foods', name: 'National Foods' },
          ]);
        } catch (error) {
          toast.error('Failed to fetch suppliers.');
        }
      };
      fetchSuppliers();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isPerishable: checked }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.info('Uploading image...');

    // --- Image Upload Logic (e.g., to Cloudinary) ---
    // This is a mock. Replace with your actual upload service.
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', 'your_cloudinary_preset'); // Replace with your preset

    try {
        // const response = await axios.post('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', uploadData);
        // const imageUrl = response.data.secure_url;
        
        // Mocking the response
        const mockImageUrl = `https://res.cloudinary.com/demo/image/upload/${file.name}`;
        
        setFormData(prev => ({ ...prev, imageUrls: [mockImageUrl] }));
        toast.success('Image uploaded successfully!');
    } catch (error) {
        toast.error('Image upload failed.');
    } finally {
        setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submissionData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        shelfLife: formData.shelfLife ? parseInt(formData.shelfLife, 10) : null,
    };

    try {
        const token = localStorage.getItem("token");
        await axios.post('http://localhost:5000/api/manager/product', submissionData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast.success('Product added successfully!');
        onProductAdded();
        onClose();
        // Reset form
        setFormData({ name: '', category: '', description: '', price: '', stock: '', supplierId: '', SKU: '', isPerishable: false, seasonality: '', shelfLife: '', imageUrls: [] });
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to add product.';
        toast.error(errorMessage);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="SKU" className="text-right">SKU</Label>
                    <Input id="SKU" name="SKU" value={formData.SKU} onChange={handleInputChange} className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                    <Input id="category" name="category" value={formData.category} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">Price (₹)</Label>
                    <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right">Stock</Label>
                    <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="supplierId" className="text-right">Supplier</Label>
                    <Select onValueChange={(value) => handleSelectChange('supplierId', value)} name="supplierId" required>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a supplier" />
                        </SelectTrigger>
                        <SelectContent>
                            {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="imageUrls" className="text-right">Image</Label>
                    <div className="col-span-3">
                        <Input id="imageUrls" type="file" onChange={handleImageUpload} accept="image/*" className="mb-2" />
                        {isUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                        {formData.imageUrls.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                                <img src={formData.imageUrls[0]} alt="Uploaded preview" className="h-12 w-12 object-cover rounded-md" />
                                <p className="text-sm text-muted-foreground truncate">{formData.imageUrls[0]}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="isPerishable" className="text-right">Perishable</Label>
                    <Checkbox id="isPerishable" checked={formData.isPerishable} onCheckedChange={handleCheckboxChange} />
                </div>
                 {formData.isPerishable && (
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="shelfLife" className="text-right">Shelf Life (days)</Label>
                        <Input id="shelfLife" name="shelfLife" type="number" value={formData.shelfLife} onChange={handleInputChange} className="col-span-3" />
                    </div>
                 )}
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting || isUploading}>
                    {isSubmitting ? <IconLoader2 className="animate-spin mr-2" /> : null}
                    Add Product
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
