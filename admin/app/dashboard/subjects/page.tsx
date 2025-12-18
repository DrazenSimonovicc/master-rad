'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface SubjectAndGrade {
  id: string;
  subject: string;
  grade: string;
  createdAt: string;
}

export default function SubjectsAndGradesPage() {
  const [items, setItems] = useState<SubjectAndGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SubjectAndGrade | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/subjects-and-grades');
      setItems(response.data);
    } catch (error: any) {
      toast.error('Greška pri učitavanju predmeta i razreda');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.subject || !formData.grade) {
      toast.error('Predmet i razred su obavezni');
      return;
    }

    try {
      await api.post('/admin/subjects-and-grades', formData);
      toast.success('Predmet i razred uspešno kreirani');
      setDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Greška pri kreiranju');
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    try {
      await api.put(`/admin/subjects-and-grades/${editingItem.id}`, formData);
      toast.success('Predmet i razred uspešno ažurirani');
      setDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Greška pri ažuriranju');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovu stavku?')) return;

    try {
      await api.delete(`/admin/subjects-and-grades/${id}`);
      toast.success('Uspešno obrisano');
      fetchItems();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Greška pri brisanju');
    }
  };

  const openEditDialog = (item: SubjectAndGrade) => {
    setEditingItem(item);
    setFormData({
      subject: item.subject,
      grade: item.grade,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      subject: '',
      grade: '',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Group by subject for better display
  const groupedBySubject = items.reduce((acc, item) => {
    if (!acc[item.subject]) {
      acc[item.subject] = [];
    }
    acc[item.subject].push(item);
    return acc;
  }, {} as Record<string, SubjectAndGrade[]>);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Predmeti i Razredi</h1>
            <p className="mt-1 text-sm text-gray-500">
              Upravljanje predmetima i razredima u sistemu
            </p>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Dodaj Predmet/Razred
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Izmeni Predmet/Razred' : 'Dodaj Predmet/Razred'}
                </DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Izmeni podatke' : 'Dodaj novi predmet i razred'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Predmet</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="npr. Matematika, Srpski jezik..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grade">Razred</Label>
                  <Input
                    id="grade"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="npr. 1, 2, 3, 4..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Otkaži
                </Button>
                <Button onClick={editingItem ? handleUpdate : handleCreate}>
                  {editingItem ? 'Sačuvaj' : 'Kreiraj'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Ukupno Stavki</div>
            <div className="text-3xl font-bold mt-2">{items.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Broj Predmeta</div>
            <div className="text-3xl font-bold mt-2">
              {Object.keys(groupedBySubject).length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Broj Razreda</div>
            <div className="text-3xl font-bold mt-2">
              {new Set(items.map((item) => item.grade)).size}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Predmet</TableHead>
                <TableHead>Razred</TableHead>
                <TableHead>Kreirano</TableHead>
                <TableHead className="text-right">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Nema predmeta i razreda
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.subject}</TableCell>
                    <TableCell>{item.grade}</TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
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
      </div>
    </DashboardLayout>
  );
}











