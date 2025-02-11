
import React from "react";
import { Button } from "@/components/ui/button";
import { BoatForm } from "@/components/BoatForm";
import { Plus, X } from "lucide-react";
import { Boat, NewBoat } from "@/types/boat";

interface BoatFormSectionProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingBoat: Boat | null;
  onSubmit: (data: NewBoat) => void;
  onCancel: () => void;
}

export const BoatFormSection = ({
  showForm,
  setShowForm,
  editingBoat,
  onSubmit,
  onCancel,
}: BoatFormSectionProps) => {
  return (
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
            onSubmit={onSubmit}
            editingBoat={editingBoat}
            onCancel={editingBoat ? onCancel : undefined}
          />
        </div>
      )}
    </div>
  );
};
