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
import { Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface ClassSchedule {
  id: string;
  subject: string;
  dayName: string;
  userId?: string;
  createdAt: string;
}

const dayOrder: Record<string, number> = {
  'Ponedeljak': 1,
  'Utorak': 2,
  'Sreda': 3,
  'Četvrtak': 4,
  'Petak': 5,
  'Subota': 6,
  'Nedelja': 7
};

export default function ClassSchedulesPage() {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/class-schedules');
      setSchedules(response.data);
    } catch (error: any) {
      toast.error('Greška pri učitavanju rasporeda časova');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj raspored?')) return;

    try {
      await api.delete(`/admin/class-schedules/${id}`);
      toast.success('Raspored uspešno obrisan');
      fetchSchedules();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Greška pri brisanju');
    }
  };

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.dayName]) {
      acc[schedule.dayName] = [];
    }
    acc[schedule.dayName].push(schedule);
    return acc;
  }, {} as Record<string, ClassSchedule[]>);

  const sortedDays = Object.keys(groupedSchedules).sort((a, b) => 
    (dayOrder[a] || 999) - (dayOrder[b] || 999)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rasporedi Časova</h1>
          <p className="mt-1 text-sm text-gray-500">Pregled svih rasporeda časova</p>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            </div>
          ) : schedules.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Nema rasporeda časova
            </div>
          ) : (
            sortedDays.map((day) => (
              <div key={day} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900">{day}</h2>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Predmet</TableHead>
                      <TableHead className="text-right">Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedSchedules[day].map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">{schedule.subject}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(schedule.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Ukupno Časova</div>
            <div className="text-3xl font-bold mt-2">{schedules.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Broj Dana</div>
            <div className="text-3xl font-bold mt-2">{sortedDays.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Predmeta</div>
            <div className="text-3xl font-bold mt-2">
              {new Set(schedules.map(s => s.subject)).size}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}











