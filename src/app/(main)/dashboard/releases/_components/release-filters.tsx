"use client";

import { useState } from "react";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ReleaseFilters() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [status, setStatus] = useState("all");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Search tracks or artists..."
        className="w-56"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <Select value={genre} onValueChange={setGenre}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All Genres" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genres</SelectItem>
          <SelectItem value="electronic">Electronic</SelectItem>
          <SelectItem value="phonk">Phonk</SelectItem>
          <SelectItem value="wave-phonk">Wave Phonk</SelectItem>
          <SelectItem value="chill-funk">Chill Funk</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="live">Live</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" className="ml-auto">
        <Download />
        Export CSV
      </Button>
    </div>
  );
}
