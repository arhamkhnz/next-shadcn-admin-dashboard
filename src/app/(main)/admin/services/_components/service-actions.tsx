"use client";

import { Button } from "@/components/ui/button";
import { Service } from "@/types/database";

export function ServiceActions({ service }: { service: Service }) {
  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => alert(`Editing ${service.name}`)}>
        Edit
      </Button>
      <Button variant="ghost" size="sm" onClick={() => alert(`Deleting ${service.name}`)}>
        Delete
      </Button>
    </div>
  );
}
