import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { ExternalLink, Star, TrendingUp, Clock, Zap, Lightbulb, Rocket, Brain, Beaker, Tag, Building } from 'lucide-react';

// Import the Product type from your data file
import { Product } from '../products-data';

// Helper function to highlight text
const highlightText = (text: string, highlight: string) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark> : part
      )}
    </span>
  );
};

export function ProductCard({ product, getTagColor, searchTerm }: { product: Product; getTagColor: (tag: string) => string; searchTerm: string }) {
  const isExternalLink = product.link.startsWith('http') || product.link.startsWith('www');

  const getStatusInfo = (status: Product['status']) => {
    switch (status) {
      case 'new': return { icon: <Zap className="w-3 h-3 mr-1" />, color: 'bg-green-100 text-green-800' };
      case 'updated': return { icon: <TrendingUp className="w-3 h-3 mr-1" />, color: 'bg-blue-100 text-blue-800' };
      case 'coming soon': return { icon: <Clock className="w-3 h-3 mr-1" />, color: 'bg-yellow-100 text-yellow-800' };
      case 'pre-launch': return { icon: <Rocket className="w-3 h-3 mr-1" />, color: 'bg-purple-100 text-purple-800' };
      case 'MBP': return { icon: <Star className="w-3 h-3 mr-1" />, color: 'bg-indigo-100 text-indigo-800' };
      case 'MVP building': return { icon: <Beaker className="w-3 h-3 mr-1" />, color: 'bg-pink-100 text-pink-800' };
      case 'ideation': return { icon: <Lightbulb className="w-3 h-3 mr-1" />, color: 'bg-orange-100 text-orange-800' };
      case 'theorised': return { icon: <Brain className="w-3 h-3 mr-1" />, color: 'bg-red-100 text-red-800' };
      default: return { icon: null, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const statusInfo = getStatusInfo(product.status);

  return (
    <Card className="group overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative flex flex-col h-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {highlightText(product.name, searchTerm)}
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {highlightText(product.category, searchTerm)}
            </p>
          </div>
          <div className="flex space-x-2">
            {product.status && (
              <Badge className={`${statusInfo.color}`}>
                {statusInfo.icon}
                {highlightText(product.status, searchTerm)}
              </Badge>
            )}
            <Badge className={getTagColor(product.tag)}>
              <Tag className="w-3 h-3 mr-1" />
              {highlightText(product.tag, searchTerm)}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
          {highlightText(product.description, searchTerm)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>{product.rating}</span>
          <span>•</span>
          <span>{product.users} users</span>
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto flex justify-between items-center">
        {product.parent && (
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <Building className="w-4 h-4" />
            <span>{highlightText(product.parent, searchTerm)}</span>
          </div>
        )}
        <Button
          asChild
          variant="ghost"
          className="h-10 group-hover:bg-blue-50 dark:group-hover:bg-blue-900 group-hover:text-blue-600 dark:group-hover:text-blue-400"
        >
          {isExternalLink ? (
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              Learn more
              <ExternalLink className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            <Link href={product.link} className="flex items-center justify-center">
              Learn more
              <ExternalLink className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
