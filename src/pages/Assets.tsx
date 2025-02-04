import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Asset } from "@/types/boat";
import { Plus, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "",
    value: "",
    expiration_date: "",
    buyer_name: "",
  });
  const { toast } = useToast();

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.category || !newAsset.value || !newAsset.buyer_name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const asset: Asset = {
      id: Math.random().toString(36).substr(2, 9),
      boat_id: "temporary", // This will be set properly when we integrate with Supabase
      ...newAsset,
      created_at: new Date().toISOString(),
    };

    setAssets([...assets, asset]);
    setNewAsset({ name: "", category: "", value: "", expiration_date: "", buyer_name: "" });
    toast({
      title: "Success",
      description: "Asset added successfully",
    });
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((asset) => asset.id !== id));
    toast({
      title: "Success",
      description: "Asset deleted successfully",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Navigation />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Add New Asset</h2>
          <form onSubmit={handleAddAsset} className="space-y-4">
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
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Asset List</h2>
          <div className="space-y-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
              >
                <div>
                  <h3 className="font-semibold">{asset.name}</h3>
                  <p className="text-sm text-gray-600">
                    Category: {asset.category}
                  </p>
                  <p className="text-sm text-gray-600">Value: {asset.value}</p>
                  <p className="text-sm text-gray-600">Owner: {asset.buyer_name}</p>
                  {asset.expiration_date && (
                    <p className="text-sm text-gray-600">
                      Expires: {new Date(asset.expiration_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteAsset(asset.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {assets.length === 0 && (
              <p className="text-gray-500 text-center">No assets added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assets;