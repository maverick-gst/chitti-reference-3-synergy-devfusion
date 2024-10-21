import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { File, Trash2, Download, Search, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface FileMetadata {
  id: string;
  name: string;
  size: number;
  contentType: string;
  url: string;
  productId: string;
  stepId?: number;
  subStepId?: number;
  createdAt: string;
  updatedAt: string;
  systemGenerated: boolean;
  [key: string]: string | number | boolean | undefined; // Update index signature
}

interface FileExplorerProps {
  productId: string;
  stepId?: number;
  subStepId?: number;
}

export default function FileExplorer({ productId, stepId, subStepId }: FileExplorerProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: files, isLoading, error, refetch } = useQuery({
    queryKey: ['files', productId, stepId, subStepId],
    queryFn: async () => {
      const queryParams = new URLSearchParams({ productId });
      if (stepId) queryParams.append('stepId', stepId.toString());
      if (subStepId) queryParams.append('subStepId', subStepId.toString());
      const response = await fetch(`/api/files?${queryParams}`);
      
      if (!response.ok) throw new Error('Failed to fetch files');
      const response_json = await response.json();
      console.log('response_json------files', response_json);
      return response_json;
    },
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof FileMetadata>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof FileMetadata) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredFiles = useMemo(() => {
    if (!files) return [];
    
    return [...files]
      .sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
        if (bValue === undefined) return sortDirection === 'asc' ? -1 : 1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          // Check if the strings represent dates (assuming ISO format)
          if (sortColumn === 'createdAt' || sortColumn === 'updatedAt') {
            const dateA = new Date(aValue).getTime();
            const dateB = new Date(bValue).getTime();
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
          }
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        // If we can't compare, return 0 (no change in order)
        return 0;
      })
      .filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [files, sortColumn, sortDirection, searchTerm]);

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async (file: FileMetadata) => {
    try {
      console.log('Attempting to download file:', file.name);
      const response = await fetch(`/api/files/download/?fileName=${encodeURIComponent(file.name)}`);
      console.log('Download response status:', response.status);
      if (!response.ok) throw new Error('Failed to download file');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Success',
        description: 'File downloaded successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to download file',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (file: FileMetadata) => {
    if (file.systemGenerated) {
      toast({
        title: "Cannot Delete",
        description: "This is a system-generated file and cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        const response = await fetch(`/api/files/delete/${encodeURIComponent(file.id)}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete file');
        queryClient.invalidateQueries({ queryKey: ['files', productId] });
        toast({
          title: 'Success',
          description: 'File deleted successfully',
          variant: 'default',
        });
      } catch (error) {
        console.error('Error deleting file:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete file',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-blue-800 flex items-center">
          <File className="mr-2" size={24} />
          File Explorer
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="text-blue-600 hover:text-blue-800"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500 bg-red-100 rounded-lg">
            <p className="font-semibold">{error instanceof Error ? error.message : 'An error occurred'}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-2 text-red-600 hover:text-red-800"
            >
              Try Again
            </Button>
          </div>
        ) : files && files.length > 0 ? (
          <>
            <div className="bg-white rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                      Name {sortColumn === 'name' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('size')}>
                      Size {sortColumn === 'size' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('contentType')}>
                      Type {sortColumn === 'contentType' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('updatedAt')}>
                      Last Modified {sortColumn === 'updatedAt' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {sortedAndFilteredFiles.map((file) => (
                      <motion.tr
                        key={file.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <File size={16} className="mr-2 text-blue-500" />
                            {file.name}
                          </div>
                        </TableCell>
                        <TableCell>{formatFileSize(file.size)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{file.contentType}</Badge>
                        </TableCell>
                        <TableCell>{new Date(file.updatedAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                    onClick={() => handleDownload(file)}
                                  >
                                    <Download size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Download file</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {file.systemGenerated}
                            {!file.systemGenerated && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-800 hover:bg-red-100"
                                      onClick={() => handleDelete(file)}
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete file</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
            {sortedAndFilteredFiles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg font-semibold">No files found</p>
                <p className="text-sm">Try adjusting your search or upload some files.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg font-semibold">No files available</p>
            <p className="text-sm">Upload some files to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
