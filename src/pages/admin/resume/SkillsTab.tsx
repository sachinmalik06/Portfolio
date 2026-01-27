import { useState, useEffect } from "react";
import { useResumeSkills, useCreateResumeSkill, useUpdateResumeSkill, useDeleteResumeSkill } from "@/hooks/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableRow({ entry, onEdit, onDelete, isDeleting }: { entry: any; onEdit: (entry: any) => void; onDelete: (id: string) => void; isDeleting: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: entry.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            className={`hover:bg-white/5 border-white/5 ${!entry.active ? 'opacity-50' : ''}`}
        >
            <TableCell>
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
            </TableCell>
            <TableCell className="font-bold">{entry.name}</TableCell>
            <TableCell>{entry.category}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${entry.proficiency}%` }} />
                    </div>
                    <span className="text-xs">{entry.proficiency}%</span>
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(entry)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(entry.id)} disabled={isDeleting}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

export default function SkillsTab() {
    const { data: entries, isLoading } = useResumeSkills(true);
    const { mutate: createEntry, isLoading: isCreating } = useCreateResumeSkill();
    const { mutate: updateEntry, isLoading: isUpdating } = useUpdateResumeSkill();
    const { mutate: deleteEntry, isLoading: isDeleting } = useDeleteResumeSkill();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<any>(null);
    const [entriesList, setEntriesList] = useState<any[]>([]);

    useEffect(() => {
        if (entries && entries.length > 0) {
            setEntriesList([...(entries as any[])]);
        } else {
            setEntriesList([]);
        }
    }, [entries]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = entriesList.findIndex((entry) => entry.id === active.id);
            const newIndex = entriesList.findIndex((entry) => entry.id === over.id);
            const newEntries = arrayMove(entriesList, oldIndex, newIndex);
            setEntriesList(newEntries);
            try {
                const updatePromises = newEntries.map((entry, index) =>
                    updateEntry(entry.id, { order: index + 1 })
                );
                await Promise.all(updatePromises);
                toast.success("Order updated successfully");
            } catch (error) {
                if (entries) setEntriesList([...(entries as any[])]);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            name: formData.get("name") as string,
            category: formData.get("category") as string,
            proficiency: parseInt(formData.get("proficiency") as string),
            active: formData.get("active") === "on",
            order: editingEntry ? editingEntry.order : entriesList.length + 1
        };

        try {
            if (editingEntry) {
                await updateEntry(editingEntry.id, data);
                toast.success("Skill updated");
            } else {
                await createEntry(data);
                toast.success("Skill created");
            }
            setIsDialogOpen(false);
            setEditingEntry(null);
        } catch (error) {
            toast.error("Failed to save");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this skill?")) {
            try {
                await deleteEntry(id);
                toast.success("Deleted");
            } catch (error) {
                toast.error("Failed to delete");
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Skills & Expertise</h3>
                <Button onClick={() => { setEditingEntry(null); setIsDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Card className="bg-card/50 border-white/5">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-white/5 border-white/5">
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Skill Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Proficiency</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
                                ) : entriesList.length > 0 ? (
                                    <SortableContext items={entriesList.map(e => e.id)} strategy={verticalListSortingStrategy}>
                                        {entriesList.map(entry => (
                                            <SortableRow key={entry.id} entry={entry} onEdit={() => { setEditingEntry(entry); setIsDialogOpen(true); }} onDelete={handleDelete} isDeleting={isDeleting} />
                                        ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow><TableCell colSpan={5} className="text-center">No skills found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </DndContext>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingEntry ? "Edit Skill" : "Add Skill"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Skill Name</label>
                            <Input name="name" defaultValue={editingEntry?.name} required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                name="category"
                                defaultValue={editingEntry?.category || "Technical Skills"}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="Technical Skills">Technical Skills</option>
                                <option value="Business Skills">Business Skills</option>
                                <option value="Soft Skills">Soft Skills</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Proficiency (0-100)</label>
                            <Input type="number" name="proficiency" min="0" max="100" defaultValue={editingEntry?.proficiency || 80} required />
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <input type="checkbox" name="active" id="active" defaultChecked={editingEntry ? editingEntry.active : true} className="rounded border-gray-300" />
                            <label htmlFor="active" className="text-sm font-medium">Active</label>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isCreating || isUpdating}>Save</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
