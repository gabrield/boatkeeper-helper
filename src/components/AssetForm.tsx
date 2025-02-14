
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Asset, Boat } from "@/types/boat";
import { Plus, Calendar, Pencil, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AssetFormProps {
  boats: Boat[];
  selectedBoatId: string;
  setSelectedBoatId: (id: string) => void;
  newAsset: {
    name: string;
    category: string;
    value: string;
    expiration_date: string;
    buyer_name: string;
    boat_id: string;
  };
  setNewAsset: (asset: any) => void;
  editingAsset: Asset | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const AssetForm = ({
  boats,
  selectedBoatId,
  setSelectedBoatId,
  newAsset,
  setNewAsset,
  editingAsset,
  onSubmit,
  onCancel,
}: AssetFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mb-8">
      <div className="space-y-2">
        <label htmlFor="boat-select" className="text-sm font-medium">
          Select Boat (Optional)
        </label>
        <Select value={selectedBoatId} onValueChange={setSelectedBoatId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a boat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no_boat">No boat</SelectItem>
            {boats.map((boat) => (
              <SelectItem key={boat.id} value={boat.id}>
                {boat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input
        placeholder="Asset Name"
        value={newAsset.name}
        onChange={(e) =>
          setNewAsset({ ...newAsset, name: e.target.value })
        }
      />
      <Input
        placeholder="Category"
        value={newAsset.category}
        onChange={(e) =>
          setNewAsset({ ...newAsset, category: e.target.value })
        }
      />
      <Input
        placeholder="Value"
        value={newAsset.value}
        onChange={(e) =>
          setNewAsset({ ...newAsset, value: e.target.value })
        }
      />
      <Input
        placeholder="Buyer Name"
        value={newAsset.buyer_name}
        onChange={(e) =>
          setNewAsset({ ...newAsset, buyer_name: e.target.value })
        }
      />
      <div className="flex items-center space-x-2">
        <Input
          type="date"
          value={newAsset.expiration_date}
          onChange={(e) =>
            setNewAsset({ ...newAsset, expiration_date: e.target.value })
          }
        />
        <Calendar className="h-4 w-4 text-gray-500" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {editingAsset ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Update Asset
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </>
          )}
        </Button>
        {editingAsset && (
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
