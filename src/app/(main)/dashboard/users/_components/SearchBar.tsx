"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="mb-4 w-full sm:w-1/2">
      <Input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  )
}
