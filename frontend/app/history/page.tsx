"use client"

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  _id: string;
  raw_intent: string;
  status: 'success' | 'failed' | 'pending_review';
  createdAt: string;
  response_message: string;
}

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // The backend is running on a different port, so we need the full URL
        const response = await fetch('http://localhost:5001/api/intent/transactions');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        if (data.success) {
          setTransactions(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch transactions');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'default'; // Use a more standard badge color
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Transaction History</h1>
          </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading transactions...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Intent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Response</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TableRow key={tx._id}>
                      <TableCell className="font-medium">{tx.raw_intent}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(tx.status)}>{tx.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{tx.response_message}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No transactions found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
