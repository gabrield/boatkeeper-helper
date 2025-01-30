import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Asset } from "@/types/boat";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "",
    value: "",
  });
  const { toast } = useToast();

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.category || !newAsset.value) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const asset: Asset = {
      id: Math.random().toString(36).substr(2, 9),
      ...newAsset,
    };

    setAssets([...assets, asset]);
    setNewAsset({ name: "", category: "", value: "" });
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