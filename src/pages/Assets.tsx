
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Asset, Boat } from "@/types/boat";
import { Plus, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [selectedBoatId, setSelectedBoatId] = useState<string>("");
  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "",
    value: "",
    expiration_date: "",
    buyer_name: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoats();
  }, []);

  const fetchBoats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data: boats, error } = await supabase
      .from('boats')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch boats",
        variant: "destructive",
      });
      return;
    }

    setBoats(boats);
    if (boats.length > 0) {
      setSelectedBoatId(boats[0].id);
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoatId) {
      toast({
        title: "Error",
        description: "Please select a boat",
        variant: "destructive",
      });
      return;
    }

    if (!newAsset.name || !newAsset.category || !newAsset.value || !newAsset.buyer_name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const { data: asset, error } = await supabase
      .from('assets')
      .insert([{
        ...newAsset,
        boat_id: selectedBoatId,
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add asset",
        variant: "destructive",
      });
      return;
    }

    setAssets([...assets, asset]);
    setNewAsset({ name: "", category: "", value: "", expiration_date: "", buyer_name: "" });
    toast({
      title: "Success",
      description: "Asset added successfully",
    });
  };

  const handleDeleteAsset = async (id: string) => {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete asset",
        variant: "destructive",
      });
      return;
    }

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
            <div className="space-y-2">
              <label htmlFor="boat-select" className="text-sm font-medium">
                Select Boat
              </label>
              <Select value={selectedBoatId} onValueChange={setSelectedBoatId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a boat" />
                </SelectTrigger>
                <SelectContent>
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
