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

interface Transaction {
  id: string;
  product_name: string;
  quantity: number;
  amount: number;
  status: string;
  notes: string | null;
  transaction_date: string;
}

const Analytics = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("transactions")
        .select("*")
        .order("transaction_date", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const approvedTransactions = transactions.filter(t => t.status === "approved");
  const rejectedTransactions = transactions.filter(t => t.status === "rejected");

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Raw Material Analytics Report", 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);
    
    autoTable(doc, {
      startY: 40,
      head: [['Date', 'Material', 'Quantity', 'Amount', 'Status']],
      body: transactions.map(t => [
        format(new Date(t.transaction_date), "MMM dd, yyyy"),
        t.product_name,
        t.quantity.toString(),
        `IDR ${t.amount.toFixed(2)}`,
        t.status
      ]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    });
    
    doc.save(`material-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "PDF Exported",
      description: "Analytics report has been exported successfully.",
    });
  };

  const handleExportExcel = () => {
    const csvContent = [
      ['Date', 'Material', 'Quantity', 'Amount', 'Status', 'Notes'],
      ...transactions.map(t => [
        format(new Date(t.transaction_date), "MMM dd, yyyy"),
        t.product_name,
        t.quantity,
        t.amount.toFixed(2),
        t.status,
        t.notes || ''
      ])
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
            <p className="text-muted-foreground">Track material transactions and procurement history</p>
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

        <Card>
          <CardHeader>
            <CardTitle>Material Procurement History</CardTitle>
            <CardDescription>Approved raw material transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Material Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No approved transactions yet
                    </TableCell>
                  </TableRow>
                ) : (
                  approvedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.transaction_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell className="font-medium">{transaction.product_name}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-success">Approved</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rejected Materials & Quality Issues</CardTitle>
            <CardDescription>Materials requiring quality inspection attention</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Material Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Quality Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rejectedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No rejected items
                    </TableCell>
                  </TableRow>
                ) : (
                  rejectedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.transaction_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell className="font-medium">{transaction.product_name}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell className="max-w-xs text-muted-foreground">
                        {transaction.notes || "No notes"}
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
