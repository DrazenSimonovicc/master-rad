'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface OperativePlan {
  id: string;
  subject: string;
  grade: string;
  month: string;
  schoolYear: string;
  teacher: string;
  createdAt: string;
}

export default function OperativePlansPage() {
  const [plans, setPlans] = useState<OperativePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPlans();
  }, [page]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/operative-plans', {
        params: { page, limit: 10 },
      });
      setPlans(response.data.plans);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error: any) {
      toast.error('Greška pri učitavanju operativnih planova');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj operativni plan?')) return;

    try {
      await api.delete(`/admin/operative-plans/${id}`);
      toast.success('Operativni plan uspešno obrisan');
      fetchPlans();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Greška pri brisanju');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operativni Planovi</h1>
          <p className="mt-1 text-sm text-gray-500">Pregled svih operativnih planova</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Predmet</TableHead>
                <TableHead>Razred</TableHead>
                <TableHead>Mesec</TableHead>
                <TableHead>Školska Godina</TableHead>
                <TableHead>Nastavnik</TableHead>
                <TableHead>Kreirano</TableHead>
                <TableHead className="text-right">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Nema operativnih planova
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.subject}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{plan.grade}</Badge>
                    </TableCell>
                    <TableCell>{plan.month}</TableCell>
                    <TableCell>{plan.schoolYear}</TableCell>
                    <TableCell>{plan.teacher}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(plan.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(plan.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Prethodna
            </Button>
            <span className="text-sm text-gray-600">
              Strana {page} od {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Sledeća
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}











