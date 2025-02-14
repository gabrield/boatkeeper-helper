
import React from "react";
import { Button } from "@/components/ui/button";
import { Asset, Boat } from "@/types/boat";
import { Trash2, Pencil } from "lucide-react";

interface AssetItemProps {
  asset: Asset;
  boats: Boat[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

export const AssetItem = ({ asset, boats, onEdit, onDelete }: AssetItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <div>
        <h3 className="font-semibold">{asset.name}</h3>
        <p className="text-sm text-gray-600">
          Category: {asset.category}
        </p>
        <p className="text-sm text-gray-600">Value: {asset.value}</p>
        <p className="text-sm text-gray-600">Owner: {asset.buyer_name}</p>
        {asset.boat_id && (
          <p className="text-sm text-gray-600">
            Boat: {boats.find(b => b.id === asset.boat_id)?.name || 'Unknown'}
          </p>
        )}
        {asset.expiration_date && (
          <p className="text-sm text-gray-600">
            Expires: {new Date(asset.expiration_date).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(asset)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(asset.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
