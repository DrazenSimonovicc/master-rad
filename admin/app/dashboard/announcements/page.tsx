'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface Announcement {
  id: string;
  title: string;
  description?: string;
  date: string;
  link1?: string;
  link1Description?: string;
  link2?: string;
  link2Description?: string;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    link1: '',
    link1Description: '',
    link2: '',
    link2Description: '',
  });

  useEffect(() => {
    fetchAnnouncements();
  }, [page]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/announcements', {
        params: { page, limit: 10 },
      });
      setAnnouncements(response.data.announcements);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error: any) {
      toast.error('Greška pri učitavanju obaveštenja');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.date) {
      toast.error('Naslov i datum su obavezni');
      return;
    }

    try {
      await api.post('/admin/announcements', formData);
      toast.success('Obaveštenje uspešno kreirano');
      setDialogOpen(false);
      resetForm();
      fetchAnnouncements();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Greška pri kreiranju obaveštenja');
    }
  };

  const handleUpdate = async () => {
    if (!editingAnnouncement) return;

    try {
      await api.put(`/admin/announcements/${editingAnnouncement.id}`, formData);
      toast.success('Obaveštenje uspešno ažurirano');
      setDialogOpen(false);
      resetForm();
      fetchAnnouncements();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Greška pri ažuriranju obaveštenja');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovo obaveštenje?')) return;

    try {
      await api.delete(`/admin/announcements/${id}`);
      toast.success('Obaveštenje uspešno obrisano');
      fetchAnnouncements();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Greška pri brisanju obaveštenja');
    }
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      description: announcement.description || '',
      date: announcement.date,
      link1: announcement.link1 || '',
      link1Description: announcement.link1Description || '',
      link2: announcement.link2 || '',
      link2Description: announcement.link2Description || '',
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      link1: '',
      link1Description: '',
      link2: '',
      link2Description: '',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Obaveštenja</h1>
            <p className="mt-1 text-sm text-gray-500">Upravljanje obaveštenjima</p>
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
                Novo Obaveštenje
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAnnouncement ? 'Izmeni Obaveštenje' : 'Kreiraj Obaveštenje'}
                </DialogTitle>
                <DialogDescription>
                  {editingAnnouncement
                    ? 'Izmeni podatke obaveštenja'
                    : 'Dodaj novo obaveštenje'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Naslov *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Opis</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Datum *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="link1">Link 1</Label>
                  <Input
                    id="link1"
                    type="url"
                    value={formData.link1}
                    onChange={(e) => setFormData({ ...formData, link1: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="link1Description">Opis Linka 1</Label>
                  <Input
                    id="link1Description"
                    value={formData.link1Description}
                    onChange={(e) =>
                      setFormData({ ...formData, link1Description: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="link2">Link 2</Label>
                  <Input
                    id="link2"
                    type="url"
                    value={formData.link2}
                    onChange={(e) => setFormData({ ...formData, link2: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="link2Description">Opis Linka 2</Label>
                  <Input
                    id="link2Description"
                    value={formData.link2Description}
                    onChange={(e) =>
                      setFormData({ ...formData, link2Description: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Otkaži
                </Button>
                <Button onClick={editingAnnouncement ? handleUpdate : handleCreate}>
                  {editingAnnouncement ? 'Sačuvaj' : 'Kreiraj'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naslov</TableHead>
                <TableHead>Opis</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Linkovi</TableHead>
                <TableHead className="text-right">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Nema obaveštenja
                  </TableCell>
                </TableRow>
              ) : (
                announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell className="font-medium">{announcement.title}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {announcement.description || '-'}
                    </TableCell>
                    <TableCell>{announcement.date}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {announcement.link1 && (
                          <div className="text-blue-600">Link 1</div>
                        )}
                        {announcement.link2 && (
                          <div className="text-blue-600">Link 2</div>
                        )}
                        {!announcement.link1 && !announcement.link2 && '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(announcement)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(announcement.id)}
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







