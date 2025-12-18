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

interface ForumCategory {
  id: string;
  categoryName: string;
  image: string;
  imageDescription: string;
  createdAt: string;
  _count: {
    forumNews: number;
  };
}

export default function ForumCategoriesPage() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ForumCategory | null>(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    image: '',
    imageDescription: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/forum-categories');
      setCategories(response.data);
    } catch (error: any) {
      toast.error('Greška pri učitavanju kategorija');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post('/admin/forum-categories', formData);
      toast.success('Kategorija uspešno kreirana');
      setDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Greška pri kreiranju kategorije');
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;

    try {
      await api.put(`/admin/forum-categories/${editingCategory.id}`, formData);
      toast.success('Kategorija uspešno ažurirana');
      setDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Greška pri ažuriranju kategorije');
    }
  };

  const handleDelete = async (id: string, postsCount: number) => {
    if (postsCount > 0) {
      toast.error(`Ne možete obrisati kategoriju sa ${postsCount} postova`);
      return;
    }

    if (!confirm('Da li ste sigurni da želite da obrišete ovu kategoriju?')) return;

    try {
      await api.delete(`/admin/forum-categories/${id}`);
      toast.success('Kategorija uspešno obrisana');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Greška pri brisanju kategorije');
    }
  };

  const openEditDialog = (category: ForumCategory) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName,
      image: category.image,
      imageDescription: category.imageDescription,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      categoryName: '',
      image: '',
      imageDescription: '',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Forum Kategorije</h1>
            <p className="mt-1 text-sm text-gray-500">Upravljanje forum kategorijama</p>
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
                Nova Kategorija
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Izmeni Kategoriju' : 'Kreiraj Kategoriju'}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory
                    ? 'Izmeni podatke kategorije'
                    : 'Dodaj novu forum kategoriju'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="categoryName">Naziv Kategorije</Label>
                  <Input
                    id="categoryName"
                    value={formData.categoryName}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryName: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">URL Slike</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/categoryCardImages/osnovna.jpg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imageDescription">Opis Slike</Label>
                  <Input
                    id="imageDescription"
                    value={formData.imageDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, imageDescription: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Otkaži
                </Button>
                <Button onClick={editingCategory ? handleUpdate : handleCreate}>
                  {editingCategory ? 'Sačuvaj' : 'Kreiraj'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naziv</TableHead>
                <TableHead>Slika</TableHead>
                <TableHead>Opis Slike</TableHead>
                <TableHead>Broj Postova</TableHead>
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
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nema kategorija
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.categoryName}</TableCell>
                    <TableCell className="max-w-xs truncate">{category.image}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.imageDescription}
                    </TableCell>
                    <TableCell>{category._count.forumNews}</TableCell>
                    <TableCell>{formatDate(category.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id, category._count.forumNews)}
                          disabled={category._count.forumNews > 0}
                        >
                          <Trash2
                            className={`h-4 w-4 ${
                              category._count.forumNews > 0
                                ? 'text-gray-400'
                                : 'text-red-600'
                            }`}
                          />
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


