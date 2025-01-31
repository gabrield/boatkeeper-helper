import React from "react";
import { Boat } from "@/types/boat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BoatListProps {
  boats: Boat[];
  onDelete: (id: string) => void;
  onSelect: (boat: Boat) => void;
}

export const BoatList = ({ boats, onDelete, onSelect }: BoatListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {boats.map((boat) => (
        <Card key={boat.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={boat.images[0]} alt={boat.name} />
                <AvatarFallback>{boat.name[0]}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg font-semibold">{boat.name}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(boat.id);
              }}
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </Button>
          </CardHeader>
          <CardContent
            className="cursor-pointer"
            onClick={() => onSelect(boat)}
          >
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Type: {boat.type}</p>
              <p className="text-sm text-gray-500">Length: {boat.length}ft</p>
              <p className="text-sm text-gray-500">Year: {boat.year}</p>
              <p className="text-sm text-gray-500">Manufacturer: {boat.manufacturer}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};