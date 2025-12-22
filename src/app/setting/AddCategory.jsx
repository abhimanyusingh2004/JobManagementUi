import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pencil, Plus } from 'lucide-react';
import { API_URL } from '@/lib/contant';

const AddCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);


    // Fetch all categories
    const fetchCategories = async () => {
        setFetching(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_URL}/Category`, {
                method: 'GET',
                headers: { 'accept': '*/*' },
                Authorization: `Bearer ${token}`,


            });

            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            } else if (response.status === 401) {
                toast.Error({ title: 'Unauthorized', description: 'Please log in.', variant: 'destructive' });
            } else {
                throw new Error('Failed to fetch');
            }
        } catch (err) {
            toast({ title: 'Error', description: 'Failed to load categories.', variant: 'destructive' });
        } finally {
            setFetching(false);
        }
    };

    // Add new category
    const addCategory = async () => {
        if (!newCategoryName.trim()) return;

        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const payload = {
                categoryName: newCategoryName.trim(),
                description: "",
            };

            const response = await fetch(`${API_URL}/Category/add-category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                Authorization: `Bearer ${token}`,

            });

            if (response.ok) {
                toast({ title: 'Success', description: 'Category added!' });
                setNewCategoryName('');
                setOpenAdd(false);
                fetchCategories();
            } else {
                throw new Error('Failed to add');
            }
        } catch (err) {
            toast({ title: 'Error', description: 'Failed to add category.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    // Update category
    const updateCategory = async () => {
        if (!editName.trim() || !editId) return;
        const token = localStorage.getItem("token");

        setLoading(true);
        try {
            const payload = {
                categoryId: editId,
                categoryName: editName.trim(),
                description: null,
            };

            const response = await fetch(`${API_URL}/Category/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                Authorization: `Bearer ${token}`,

                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast({ title: 'Success', description: 'Category updated!' });
                setOpenEdit(false);
                setEditId(null);
                setEditName('');
                fetchCategories();
            } else {
                throw new Error('Failed to update');
            }
        } catch (err) {
            toast({ title: 'Error', description: 'Failed to update category.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    // Open edit dialog
    const handleEdit = (category) => {
        setEditId(category.categoryId);
        setEditName(category.categoryName);
        setOpenEdit(true);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Manage Categories</CardTitle>
                    <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Category</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <Input
                                    placeholder="Category Name"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                                />
                                <Button onClick={addCategory} disabled={loading || !newCategoryName.trim()} className="w-full">
                                    {loading ? 'Adding...' : 'Add'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardHeader>

                <CardContent>
                    {fetching ? (
                        <p className="text-center py-8 text-muted-foreground">Loading categories...</p>
                    ) : categories.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">No categories found.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((cat) => (
                                    <TableRow key={cat.categoryId}>
                                        <TableCell>{cat.categoryId}</TableCell>
                                        <TableCell>{cat.categoryName}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(cat)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <Input
                            placeholder="Category Name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && updateCategory()}
                        />
                        <Button onClick={updateCategory} disabled={loading || !editName.trim()} className="w-full">
                            {loading ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddCategory;