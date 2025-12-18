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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Search, Eye } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface ForumPost {
  id: string;
  title: string;
  text: string;
  authorName?: string;
  mainNews: boolean;
  likes: number;
  dislikes: number;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
  category: {
    id: string;
    categoryName: string;
  };
}

export default function ForumPostsPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, search, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/forum-categories');
      setCategories(response.data);
    } catch (error: any) {
      console.error(error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/forum-posts', {
        params: { page, limit: 10, search, categoryId: categoryFilter === 'ALL' ? '' : categoryFilter },
      });
      setPosts(response.data.posts);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error: any) {
      toast.error('Greška pri učitavanju postova');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj post?')) return;

    try {
      await api.delete(`/admin/forum-posts/${id}`);
      toast.success('Post uspešno obrisan');
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Greška pri brisanju posta');
    }
  };

  const toggleMainNews = async (post: ForumPost) => {
    try {
      await api.put(`/admin/forum-posts/${post.id}`, {
        mainNews: !post.mainNews,
      });
      toast.success(`Post ${!post.mainNews ? 'postavljen kao' : 'uklonjen sa'} glavna vest`);
      fetchPosts();
    } catch (error: any) {
      toast.error('Greška pri ažuriranju posta');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forum Postovi</h1>
          <p className="mt-1 text-sm text-gray-500">Moderacija forum postova</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pretraži po naslovu ili tekstu..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sve kategorije" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Sve kategorije</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naslov</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Kategorija</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reakcije</TableHead>
                <TableHead>Datum</TableHead>
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
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Nema postova
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{post.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{post.authorName || post.user.name || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{post.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category.categoryName}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={post.mainNews ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleMainNews(post)}
                      >
                        {post.mainNews ? 'Glavna vest' : 'Obična'}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 text-sm">
                        <span className="text-green-600">👍 {post.likes}</span>
                        <span className="text-red-600">👎 {post.dislikes}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/forum/${post.id}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(post.id)}
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


