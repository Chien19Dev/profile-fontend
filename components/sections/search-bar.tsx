"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Tìm kiếm...",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback(
    (value: string) => {
      if (timer) clearTimeout(timer);
      const newTimer = setTimeout(() => {
        onSearch(value);
      }, 300);
      setTimer(newTimer);
    },
    [onSearch, timer],
  );

  function handleChange(value: string) {
    setQuery(value);
    debouncedSearch(value);
  }

  function handleClear() {
    setQuery("");
    onSearch("");
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        type="search"
        size="lg"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
