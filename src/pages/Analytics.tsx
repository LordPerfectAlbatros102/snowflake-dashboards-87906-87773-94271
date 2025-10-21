import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Download, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  color: string;
  quantity: number;
  price: number;
  created_at: string;
}

interface RejectedItem {
  id: string;
  product_name: string;
  quantity: number;
  reason: string;
  created_at: string;
}

interface FoodCondition {
  id: string;
  product_name: string;
  condition: string;
  fit_for_processing: boolean;
  inspection_date: string;
}

const Analytics = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [rejectedItems, setRejectedItems] = useState<RejectedItem[]>([]);
  const [foodConditions, setFoodConditions] = useState<FoodCondition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
    
    // Set up real-time updates for products
    const productsChannel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => fetchAllData()
      )
      .subscribe();

    // Set up real-time updates for rejected items
    const rejectedChannel = supabase
      .channel('rejected-items-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rejected_items' },
        () => fetchAllData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(rejectedChannel);
    };
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await (supabase as any)
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;

      // Fetch rejected items
      const { data: rejectedData, error: rejectedError } = await (supabase as any)
        .from("rejected_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (rejectedError) throw rejectedError;

      // Fetch food conditions
      const { data: conditionsData, error: conditionsError } = await (supabase as any)
        .from("food_conditions")
        .select("*")
        .order("inspection_date", { ascending: false });

      if (conditionsError) throw conditionsError;

      setProducts(productsData || []);
      setRejectedItems(rejectedData || []);
      setFoodConditions(conditionsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalMaterialsValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const totalRejectedQuantity = rejectedItems.reduce((sum, r) => sum + r.quantity, 0);
  const totalMaterialsInStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const qualityPassRate = foodConditions.length > 0 
    ? (foodConditions.filter(f => f.fit_for_processing).length / foodConditions.length * 100).toFixed(1)
    : 0;

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Raw Material Analytics Report", 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Total Materials Value: IDR ${totalMaterialsValue.toLocaleString()}`, 14, 38);
    doc.text(`Total Stock: ${totalMaterialsInStock} units`, 14, 44);
    doc.text(`Total Rejected: ${totalRejectedQuantity} units`, 14, 50);
    doc.text(`Quality Pass Rate: ${qualityPassRate}%`, 14, 56);
    
    // Products table
    doc.setFontSize(14);
    doc.text("Current Inventory", 14, 66);
    autoTable(doc, {
      startY: 70,
      head: [['Material', 'Category', 'Quantity', 'Price', 'Total Value']],
      body: products.map(p => [
        p.name,
        p.category,
        p.quantity.toString(),
        `IDR ${p.price.toLocaleString()}`,
        `IDR ${(p.price * p.quantity).toLocaleString()}`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    });
    
    // Rejected items table
    const finalY = (doc as any).lastAutoTable.finalY || 70;
    doc.setFontSize(14);
    doc.text("Rejected Materials", 14, finalY + 15);
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Date', 'Material', 'Quantity', 'Reason']],
      body: rejectedItems.map(r => [
        format(new Date(r.created_at), "MMM dd, yyyy"),
        r.product_name,
        r.quantity.toString(),
        r.reason
      ]),
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] },
    });
    
    doc.save(`material-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "PDF Exported",
      description: "Analytics report has been exported successfully.",
    });
  };

  const handleExportExcel = () => {
    // Combine all data for CSV
    const csvProducts = products.map(p => [
      'Product',
      format(new Date(p.created_at), "MMM dd, yyyy"),
      p.name,
      p.category,
      p.quantity,
      p.price,
      p.price * p.quantity
    ]);

    const csvRejected = rejectedItems.map(r => [
      'Rejected',
      format(new Date(r.created_at), "MMM dd, yyyy"),
      r.product_name,
      r.reason,
      r.quantity,
      '-',
      '-'
    ]);

    const csvContent = [
      ['Type', 'Date', 'Material', 'Category/Reason', 'Quantity', 'Price', 'Total Value'],
      ...csvProducts,
      ...csvRejected
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `material-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Excel Exported",
      description: "Analytics data has been exported to CSV.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Raw Material Analytics</h1>
            <p className="text-muted-foreground">Real-time analytics from Raw Materials and Rejected Items</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportPDF} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button onClick={handleExportExcel} variant="outline" className="gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Materials Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">IDR {totalMaterialsValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Current inventory value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalMaterialsInStock}</div>
              <p className="text-xs text-muted-foreground mt-1">Units in inventory</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{totalRejectedQuantity}</div>
              <p className="text-xs text-muted-foreground mt-1">Units rejected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Quality Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{qualityPassRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">Materials fit for processing</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Current Raw Materials Inventory</CardTitle>
            <CardDescription>Live data from Raw Materials menu</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No materials in inventory
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.color}</Badge>
                      </TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>IDR {product.price.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold">
                        IDR {(product.price * product.quantity).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Rejected Materials */}
        <Card>
          <CardHeader>
            <CardTitle>Rejected Raw Materials</CardTitle>
            <CardDescription>Live data from Rejected Items menu</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Material Name</TableHead>
                  <TableHead>Quantity Rejected</TableHead>
                  <TableHead>Rejection Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rejectedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No rejected items
                    </TableCell>
                  </TableRow>
                ) : (
                  rejectedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{format(new Date(item.created_at), "MMM dd, yyyy")}</TableCell>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{item.quantity}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs text-muted-foreground">
                        {item.reason}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quality Inspections */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Inspection Results</CardTitle>
            <CardDescription>Recent material quality assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inspection Date</TableHead>
                  <TableHead>Material Name</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Fit for Processing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foodConditions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No quality inspections recorded
                    </TableCell>
                  </TableRow>
                ) : (
                  foodConditions.slice(0, 10).map((condition) => (
                    <TableRow key={condition.id}>
                      <TableCell>{format(new Date(condition.inspection_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell className="font-medium">{condition.product_name}</TableCell>
                      <TableCell>
                        <Badge variant={condition.condition === "Fresh" || condition.condition === "Excellent" ? "default" : "secondary"}>
                          {condition.condition}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={condition.fit_for_processing ? "default" : "destructive"}>
                          {condition.fit_for_processing ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
