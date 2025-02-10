
import React, { useState, useEffect } from "react";
import { BoatList } from "@/components/BoatList";
import { BoatForm } from "@/components/BoatForm";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Boat, NewBoat } from "@/types/boat";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Boats = () => {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [editingBoat, setEditingBoat] = useState<Boat | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoats();
  }, []);

  const fetchBoats = async () => {
    try {
      const { data: boats, error } = await supabase
        .from('boats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBoats(boats || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

      if (error.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddBoat = async (data: NewBoat) => {
    try {
      const { data: newBoat, error } = await supabase
        .from('boats')
        .insert([{
          ...data,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setBoats([newBoat, ...boats]);
      setShowForm(false);
      toast({
        title: "Success",
        description: "Boat added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateBoat = async (data: NewBoat) => {
    if (!editingBoat) return;

    try {
      const { data: updatedBoat, error } = await supabase
        .from('boats')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingBoat.id)
        .select()
        .single();

      if (error) throw error;

      setBoats(boats.map((boat) => 
        boat.id === editingBoat.id ? updatedBoat : boat
      ));
      setEditingBoat(null);
      setShowForm(false);
      toast({
        title: "Success",
        description: "Boat updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteBoat = async (id: string) => {
    try {
      const { error } = await supabase
        .from('boats')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBoats(boats.filter((boat) => boat.id !== id));
      if (selectedBoat?.id === id) {
        setSelectedBoat(null);
      }
      if (editingBoat?.id === id) {
        setEditingBoat(null);
        setShowForm(false);
      }
      toast({
        title: "Success",
        description: "Boat deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditBoat = (boat: Boat) => {
    setEditingBoat(boat);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingBoat(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Navigation />
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-marine-900">Your Boats</h2>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Close Form
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add New Boat
              </>
            )}
          </Button>
        </div>
        
        {showForm && (
          <div className="mb-8">
            <BoatForm 
              onSubmit={editingBoat ? handleUpdateBoat : handleAddBoat}
              editingBoat={editingBoat}
              onCancel={editingBoat ? handleCancelEdit : undefined}
            />
          </div>
        )}

        <BoatList
          boats={boats}
          onDelete={handleDeleteBoat}
          onSelect={setSelectedBoat}
          onEdit={handleEditBoat}
        />
      </div>
    </div>
  );
};

export default Boats;
