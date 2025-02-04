import React, { useState } from "react";
import { BoatList } from "@/components/BoatList";
import { BoatForm } from "@/components/BoatForm";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Boat, NewBoat } from "@/types/boat";
import { Plus, X } from "lucide-react";

const Boats = () => {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [editingBoat, setEditingBoat] = useState<Boat | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleAddBoat = (data: NewBoat) => {
    const newBoat: Boat = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      user_id: "temporary", // This will be set properly when we integrate with Supabase
      created_at: new Date().toISOString(),
    };
    setBoats([...boats, newBoat]);
    setShowForm(false);
    toast({
      title: "Success",
      description: "Boat added successfully",
    });
  };

  const handleUpdateBoat = (data: NewBoat) => {
    if (!editingBoat) return;

    const updatedBoat: Boat = {
      ...editingBoat,
      ...data,
    };

    setBoats(boats.map((boat) => 
      boat.id === editingBoat.id ? updatedBoat : boat
    ));

    setEditingBoat(null);
    setShowForm(false);
    toast({
      title: "Success",
      description: "Boat updated successfully",
    });
  };

  const handleDeleteBoat = (id: string) => {
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
  };

  const handleEditBoat = (boat: Boat) => {
    setEditingBoat(boat);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingBoat(null);
    setShowForm(false);
  };

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