export type Product = {
  name: string;
  description: string;
  link: string;
  status?: 'new' | 'updated' | 'coming soon' | 'pre-launch' | 'MBP' | 'MVP building' | 'ideation' | 'theorised';
  icon?: React.ReactNode;
  category: string;
  rating: number;
  users: number;
  tag: 'SaaS' | 'Micro SaaS';
  parent?: string | 'Maverick Labs' | 'Maverick Tech Group' | 'Maverick Sparks' | 'Maverick Consulting' | 'Maverick Ventures' | 'Maverick Impact' | 'Maverick Elevate' ;
};

export const products: Product[] = [
  {
    name: "Trading Maverick",
    description: "AI-driven algorithmic trading platform simplifying algo trading with backtesting, mock trading, and live data. Democratizes access to sophisticated trading tools for both novice and experienced traders.",
    link: "https://tradingmaverick.ai",
    status: "pre-launch",
    icon: "BarChart2",
    category: "Business",
    rating: 0,
    users: 0,
    tag: "SaaS",
    parent: "Maverick Elevate"
  },


];
