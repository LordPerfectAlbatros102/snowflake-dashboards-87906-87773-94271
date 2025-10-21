import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Product, ProductFormData } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductFormData) => void;
  product?: Product | null;
}

const categories = ["Sayuran", "Daging", "Bumbu", "Biji-bijian", "Produk Susu", "Buah-buahan"];
const colors = ["Merah", "Hijau", "Putih", "Oranye", "Kuning", "Coklat", "Campuran"];

export const ProductDialog = ({ open, onOpenChange, onSubmit, product }: ProductDialogProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      color: "",
      category: "",
      price: 0,
      quantity: 1,
    },
  });

  const selectedCategory = watch("category");
  const selectedColor = watch("color");

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        color: product.color,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
      });
    } else {
      reset({
        name: "",
        color: "",
        category: "",
        price: 0,
        quantity: 1,
      });
    }
  }, [product, reset]);

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Bahan Baku" : "Tambah Bahan Baku Baru"}</DialogTitle>
          <DialogDescription>
            {product ? "Perbarui detail bahan baku di bawah ini." : "Isi detail bahan baku di bawah ini."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4 w-full">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Bahan Baku</Label>
              <Input
                id="name"
                placeholder="Contoh: Ayam, Wortel, Beras"
                {...register("name", { required: true })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="color">Warna</Label>
                <Select value={selectedColor} onValueChange={(value) => setValue("color", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih warna" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={selectedCategory} onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Harga (IDR)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="2999"
                  {...register("price", { required: true, valueAsNumber: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Jumlah</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="1"
                  {...register("quantity", { required: true, valueAsNumber: true })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">{product ? "Perbarui Bahan Baku" : "Tambah Bahan Baku"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
