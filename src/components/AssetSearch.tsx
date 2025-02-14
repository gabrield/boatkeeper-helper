
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AssetSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const AssetSearch = ({ searchQuery, onSearchChange }: AssetSearchProps) => {
  return (
    <div className="relative mb-4">
      <Input
        type="text"
        placeholder="Search assets by name or boat..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
    </div>
  );
};
