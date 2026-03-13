"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/explore?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-80">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search"
        className="flex h-10 w-full rounded-full border border-gray-200/20 bg-transparent pl-9 pr-3 text-white focus:outline-0 focus:border-gray-200/40 focus-visible:border-gray-200/40 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </form>
  );
};

export default SearchBar;
