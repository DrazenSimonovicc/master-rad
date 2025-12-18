'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Search, Eye } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface LessonPlan {
  id: string;
  subject: string;
  lessonName: string;
  gradeAndClass: string;
  date: string;
  teachingTopic: string;
  typeOfLesson?: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export default function LessonPlansPage() {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPlans();
  }, [page, search]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/lesson-plans', {
        params: { page, limit: 10, search },
      });
      setPlans(response.data.plans);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error: any) {
      toast.error('Greška pri učitavanju priprema za nastavu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovu pripremu?')) return;

    try {
      await api.delete(`/admin/lesson-plans/${id}`);
      toast.success('Priprema uspešno obrisana');
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
          <h1 className="text-3xl font-bold text-gray-900">Priprema za Nastavu</h1>
          <p className="mt-1 text-sm text-gray-500">Pregled svih priprema za nastavu</p>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pretraži po predmetu ili nazivu lekcije..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Predmet</TableHead>
                <TableHead>Naziv Lekcije</TableHead>
                <TableHead>Razred/Odeljenje</TableHead>
                <TableHead>Nastavna Tema</TableHead>
                <TableHead>Tip Časa</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead className="text-right">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Nema priprema za nastavu
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.subject}</TableCell>
                    <TableCell>{plan.lessonName}</TableCell>
                    <TableCell>{plan.gradeAndClass}</TableCell>
                    <TableCell className="max-w-xs truncate">{plan.teachingTopic}</TableCell>
                    <TableCell>{plan.typeOfLesson || '-'}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{plan.user.name || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{plan.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(plan.date)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(plan.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
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











