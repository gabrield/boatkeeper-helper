import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Asset, Boat } from "@/types/boat";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AssetForm } from "@/components/AssetForm";
import { AssetItem } from "@/components/AssetItem";
import { AssetSearch } from "@/components/AssetSearch";

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [selectedBoatId, setSelectedBoatId] = useState<string>("no_boat");
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      await Promise.all([fetchBoats(), fetchAssets()]);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchBoats = async () => {
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

    setBoats(boats || []);
  };

  const fetchAssets = async () => {
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

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBoat = boats.some(boat => 
      boat.name.toLowerCase().includes(searchQuery.toLowerCase()) && boat.id === asset.boat_id
    );
    return matchesSearch || matchesBoat;
  });

  return (
    <div className="container mx-auto py-8">
      <Navigation />
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Assets</h2>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Close Form
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add New Asset
              </>
            )}
          </Button>
        </div>

        <AssetSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {showForm && (
          <AssetForm
            boats={boats}
            selectedBoatId={selectedBoatId}
            setSelectedBoatId={setSelectedBoatId}
            newAsset={newAsset}
            setNewAsset={setNewAsset}
            editingAsset={editingAsset}
            onSubmit={editingAsset ? handleUpdateAsset : handleAddAsset}
            onCancel={handleCancelEdit}
          />
        )}

        <div className="space-y-4">
          {filteredAssets.map((asset) => (
            <AssetItem
              key={asset.id}
              asset={asset}
              boats={boats}
              onEdit={(asset) => {
                handleEditAsset(asset);
                setShowForm(true);
              }}
              onDelete={handleDeleteAsset}
            />
          ))}
          {filteredAssets.length === 0 && (
            <p className="text-gray-500 text-center">No assets found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assets;
