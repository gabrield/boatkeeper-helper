import React, { useState } from "react";
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
import { Upload } from "lucide-react";

interface BoatFormProps {
  onSubmit: (data: NewBoat) => void;
}

export const BoatForm = ({ onSubmit }: BoatFormProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const form = useForm<NewBoat>({
    defaultValues: {
      name: "",
      type: "",
      length: "",
      year: "",
      manufacturer: "",
      images: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            newImages.push(reader.result);
            if (newImages.length === files.length) {
              setSelectedImages(newImages);
              form.setValue("images", newImages);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

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
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacturer</FormLabel>
              <FormControl>
                <Input placeholder="Enter manufacturer name" {...field} />
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

        <div className="space-y-2">
          <FormLabel>Boat Images</FormLabel>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("image-upload")?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          {selectedImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {selectedImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Boat image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>

        <Button type="submit" className="w-full">
          Add Boat
        </Button>
      </form>
    </Form>
  );
};