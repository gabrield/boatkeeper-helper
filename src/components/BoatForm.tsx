import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { NewBoat } from "@/types/boat";

interface BoatFormProps {
  onSubmit: (data: NewBoat) => void;
}

export const BoatForm = ({ onSubmit }: BoatFormProps) => {
  const form = useForm<NewBoat>({
    defaultValues: {
      name: "",
      type: "",
      length: "",
      year: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Boat Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter boat name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Sailboat, Yacht, etc." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Length (ft)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter length in feet"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter year of manufacture"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Add Boat
        </Button>
      </form>
    </Form>
  );
};