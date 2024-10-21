'use client'

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ProductGrid } from "@/components/product-grid";
import { ProductCard } from "./components/product-card";
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Import your product data here
import { products, Product } from './products-data';

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) { // 2xl breakpoint
        setItemsPerPage(10); // 5 columns * 3 rows
      } else if (window.innerWidth >= 1280) { // xl breakpoint
        setItemsPerPage(8); // 4 columns * 3 rows
      } else if (window.innerWidth >= 1024) { // lg breakpoint
        setItemsPerPage(6); // 3 columns * 3 rows
      } else {
        setItemsPerPage(4); // 2 columns * 3 rows for smaller screens
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = products.filter(product =>
    (statusFilter === 'all' || product.status === statusFilter) &&
    (tagFilter === 'all' || product.tag === tagFilter) &&
    (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.status && product.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.parent && product.parent.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const uniqueStatuses = Array.from(new Set(products.map(p => p.status).filter(Boolean))) as string[];
  const uniqueTags = Array.from(new Set(products.map(p => p.tag)));

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'SaaS': return 'bg-blue-100 text-blue-800';
      case 'Micro SaaS': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <header className="mb-12">

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-3xl mx-auto">
            
            <div className="relative w-full sm:w-1/2">
            
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-1/4">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-full sm:w-1/4">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                <SelectItem value="all">All Tags</SelectItem>
                {uniqueTags.map(tag => (
                  <SelectItem key={tag} value={tag} className={getTagColor(tag)}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid>
            {currentItems.map((product) => (
              <ProductCard 
                key={product.name} 
                product={product} 
                getTagColor={getTagColor}
                searchTerm={searchTerm}
              />
            ))}
          </ProductGrid>
        </Suspense>

        <div className="mt-8 flex justify-center space-x-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="py-2 px-4 bg-white dark:bg-gray-800 rounded-md">
            {currentPage} of {pageCount}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
            disabled={currentPage === pageCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {[...Array(15)].map((_, i) => (
        <Card key={i} className="w-full">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
