
import { useState } from "react";
import { Boat, NewBoat } from "@/types/boat";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useBoats = () => {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const addBoat = async (data: NewBoat) => {
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
      toast({
        title: "Success",
        description: "Boat added successfully",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateBoat = async (id: string, data: NewBoat) => {
    try {
      const { data: updatedBoat, error } = await supabase
        .from('boats')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setBoats(boats.map((boat) => 
        boat.id === id ? updatedBoat : boat
      ));
      toast({
        title: "Success",
        description: "Boat updated successfully",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteBoat = async (id: string) => {
    try {
      const { error } = await supabase
        .from('boats')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBoats(boats.filter((boat) => boat.id !== id));
      toast({
        title: "Success",
        description: "Boat deleted successfully",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    boats,
    loading,
    fetchBoats,
    addBoat,
    updateBoat,
    deleteBoat,
  };
};
