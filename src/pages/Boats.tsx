
import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { BoatList } from "@/components/BoatList";
import { BoatSearch } from "@/components/BoatSearch";
import { BoatFormSection } from "@/components/BoatFormSection";
import { Boat, NewBoat } from "@/types/boat";
import { useBoats } from "@/hooks/useBoats";

const Boats = () => {
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [editingBoat, setEditingBoat] = useState<Boat | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { boats, loading, fetchBoats, addBoat, updateBoat, deleteBoat } = useBoats();

  useEffect(() => {
    fetchBoats();
  }, []);

  const handleAddBoat = async (data: NewBoat) => {
    const success = await addBoat(data);
    if (success) {
      setShowForm(false);
    }
  };

  const handleUpdateBoat = async (data: NewBoat) => {
    if (!editingBoat) return;
    const success = await updateBoat(editingBoat.id, data);
    if (success) {
      setEditingBoat(null);
      setShowForm(false);
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

  const handleDeleteBoat = async (id: string) => {
    const success = await deleteBoat(id);
    if (success && selectedBoat?.id === id) {
      setSelectedBoat(null);
    }
    if (success && editingBoat?.id === id) {
      setEditingBoat(null);
      setShowForm(false);
    }
  };

  const filteredBoats = boats.filter(boat =>
    boat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <BoatFormSection
          showForm={showForm}
          setShowForm={setShowForm}
          editingBoat={editingBoat}
          onSubmit={editingBoat ? handleUpdateBoat : handleAddBoat}
          onCancel={handleCancelEdit}
        />
        
        <BoatSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <BoatList
          boats={filteredBoats}
          onDelete={handleDeleteBoat}
          onSelect={setSelectedBoat}
          onEdit={handleEditBoat}
        />
      </div>
    </div>
  );
};

export default Boats;
