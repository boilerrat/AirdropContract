'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Upload, FileText, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import { parseCSV, validateCSVFile, addressesToCSV, downloadCSV } from '@/lib/utils';

interface CSVUploadProps {
  onAddressesLoaded: (addresses: string[], amounts?: string[]) => void;
  currentAddresses: string[];
  currentAmounts?: string[];
}

export function CSVUpload({ onAddressesLoaded, currentAddresses, currentAmounts }: CSVUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const handleFileSelect = async (file: File) => {
    setUploadStatus({ type: 'idle' });

    // Validate file
    const validation = validateCSVFile(file);
    if (!validation.isValid) {
      setUploadStatus({ type: 'error', message: validation.error });
      return;
    }

    try {
      const text = await file.text();
      const { addresses, amounts } = parseCSV(text);

      if (addresses.length === 0) {
        setUploadStatus({ 
          type: 'error', 
          message: 'No valid addresses found in CSV file' 
        });
        return;
      }

      onAddressesLoaded(addresses, amounts);
      setUploadStatus({ 
        type: 'success', 
        message: `Successfully loaded ${addresses.length} addresses from CSV` 
      });

      // Clear status after 3 seconds
      setTimeout(() => {
        setUploadStatus({ type: 'idle' });
      }, 3000);

    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: 'Failed to read CSV file. Please check the file format.' 
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDownloadTemplate = () => {
    const template = addressesToCSV([
      '0x1234567890123456789012345678901234567890',
      '0x0987654321098765432109876543210987654321'
    ], ['1.5', '2.0']);
    downloadCSV(template, 'recipients_template.csv');
  };

  const handleDownloadCurrent = () => {
    if (currentAddresses.length > 0) {
      const csv = addressesToCSV(currentAddresses, currentAmounts);
      downloadCSV(csv, 'current_recipients.csv');
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop a CSV file here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                browse files
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Supports CSV files with columns: address, amount (optional)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Status Messages */}
          {uploadStatus.type !== 'idle' && (
            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              uploadStatus.type === 'success' 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              {uploadStatus.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{uploadStatus.message}</span>
              <button
                onClick={() => setUploadStatus({ type: 'idle' })}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            
            {currentAddresses.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadCurrent}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Export Current ({currentAddresses.length})
              </Button>
            )}
          </div>

          {/* CSV Format Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm text-gray-900 mb-2">CSV Format</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• First column: Ethereum address (required)</p>
              <p>• Second column: Amount (optional, for individual amounts)</p>
              <p>• Headers are automatically detected and skipped</p>
              <p>• Maximum file size: 5MB</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 