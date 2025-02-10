import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Asset, Boat } from "@/types/boat";
import { Plus, Trash2, Calendar, Pencil, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [selectedBoatId, setSelectedBoatId] = useState<string>("no_boat");
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "",
    value: "",
    expiration_date: "",
    buyer_name: "",
    boat_id: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchBoats();
    fetchAssets();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
  };

  const fetchBoats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data: boats, error } = await supabase
      .from('boats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch boats",
        variant: "destructive",
      });
      return;
    }

    setBoats(boats || []);
  };

  const fetchAssets = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data: assets, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch assets",
        variant: "destructive",
      });
      return;
    }

    setAssets(assets || []);
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAsset.name || !newAsset.category || !newAsset.value || !newAsset.buyer_name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const assetData = {
      ...newAsset,
      boat_id: selectedBoatId === "no_boat" ? null : selectedBoatId,
    };

    const { data: asset, error } = await supabase
      .from('assets')
      .insert([assetData])
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
    setNewAsset({ name: "", category: "", value: "", expiration_date: "", buyer_name: "", boat_id: "" });
    setSelectedBoatId("no_boat");
    toast({
      title: "Success",
      description: "Asset added successfully",
    });
  };

  const handleUpdateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    const { data: asset, error } = await supabase
      .from('assets')
      .update({
        name: newAsset.name,
        category: newAsset.category,
        value: newAsset.value,
        expiration_date: newAsset.expiration_date,
        buyer_name: newAsset.buyer_name,
        boat_id: selectedBoatId === "no_boat" ? null : selectedBoatId,
      })
      .eq('id', editingAsset.id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update asset",
        variant: "destructive",
      });
      return;
    }

    setAssets(assets.map((a) => (a.id === editingAsset.id ? asset : a)));
    setEditingAsset(null);
    setNewAsset({ name: "", category: "", value: "", expiration_date: "", buyer_name: "", boat_id: "" });
    setSelectedBoatId("no_boat");
    toast({
      title: "Success",
      description: "Asset updated successfully",
    });
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setNewAsset({
      name: asset.name,
      category: asset.category || "",
      value: asset.value || "",
      expiration_date: asset.expiration_date || "",
      buyer_name: asset.buyer_name || "",
      boat_id: asset.boat_id || "",
    });
    setSelectedBoatId(asset.boat_id || "no_boat");
  };

  const handleCancelEdit = () => {
    setEditingAsset(null);
    setNewAsset({ name: "", category: "", value: "", expiration_date: "", buyer_name: "", boat_id: "" });
    setSelectedBoatId("no_boat");
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
          <h2 className="text-2xl font-bold mb-4">
            {editingAsset ? "Edit Asset" : "Add New Asset"}
          </h2>
          <form onSubmit={editingAsset ? handleUpdateAsset : handleAddAsset} className="space-y-4">
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
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
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
                    onClick={() => handleEditAsset(asset)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteAsset(asset.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
