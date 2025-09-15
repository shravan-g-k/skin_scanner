import React, { useState, useRef } from 'react';
import { Upload, Camera, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const ImageUpload = ({ onImageUpload }) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleFileInput = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleFile = (file) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result);
                setFileName(file.name);
                onImageUpload(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setUploadedImage(null);
        setFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-card">
            <CardContent className="p-8">
                <div
                    className={cn(
                        "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
                        dragActive ? "border-primary bg-medical-light" : "border-muted",
                        uploadedImage ? "border-success bg-success/5" : ""
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {uploadedImage ? (
                        <div className="space-y-4">
                            <div className="relative inline-block">
                                <img
                                    src={uploadedImage}
                                    alt="Uploaded skin image"
                                    className="max-w-full max-h-64 rounded-lg shadow-medical"
                                />
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute -top-2 -right-2 rounded-full h-8 w-8 p-0"
                                    onClick={clearImage}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-success">
                                <CheckCircle className="h-5 w-5" />
                                <span className="font-medium">{fileName} uploaded successfully</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <Upload className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">Upload Skin Image</h3>
                                <p className="text-muted-foreground">
                                    Drag and drop your image here, or click to browse
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Supports JPG, PNG, WebP (max 10MB)
                                </p>
                            </div>
                            <div className="flex gap-2 justify-center pt-2">
                                <Button variant="outline" size="sm">
                                    <Camera className="h-4 w-4 mr-2" />
                                    Take Photo
                                </Button>
                                <Button size="sm">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Choose File
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 p-4 bg-warning/10 rounded-lg">
                    <p className="text-sm text-warning-foreground">
                        <strong>Important:</strong> This AI analysis is for informational purposes only.
                        Always consult a qualified dermatologist for professional medical advice and diagnosis.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};