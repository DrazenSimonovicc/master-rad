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
import { Trash2, Search } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Homework {
  id: string;
  subject: string;
  teachingUnit: string;
  task1?: string;
  task2?: string;
  task3?: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export default function HomeworksPage() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHomeworks();
  }, [page, search]);

  const fetchHomeworks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/homeworks', {
        params: { page, limit: 10, search },
      });
      setHomeworks(response.data.homeworks);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error: any) {
      toast.error('Greška pri učitavanju domaćih zadataka');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj domaći zadatak?')) return;

    try {
      await api.delete(`/admin/homeworks/${id}`);
      toast.success('Domaći zadatak uspešno obrisan');
      fetchHomeworks();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Greška pri brisanju');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS');
  };

  const countTasks = (homework: Homework) => {
    let count = 0;
    for (let i = 1; i <= 10; i++) {
      if (homework[`task${i}` as keyof Homework]) count++;
    }
    return count;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Domaći Zadaci</h1>
          <p className="mt-1 text-sm text-gray-500">Pregled svih domaćih zadataka</p>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pretraži po predmetu ili nastavnoj jedinici..."
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
                <TableHead>Nastavna Jedinica</TableHead>
                <TableHead>Broj Zadataka</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Kreirano</TableHead>
                <TableHead className="text-right">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : homeworks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nema domaćih zadataka
                  </TableCell>
                </TableRow>
              ) : (
                homeworks.map((homework) => (
                  <TableRow key={homework.id}>
                    <TableCell className="font-medium">{homework.subject}</TableCell>
                    <TableCell>{homework.teachingUnit}</TableCell>
                    <TableCell>{countTasks(homework)} zadataka</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{homework.user.name || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{homework.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(homework.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(homework.id)}
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











