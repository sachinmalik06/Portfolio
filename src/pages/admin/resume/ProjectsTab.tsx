import { useState, useEffect } from "react";
import { useResumeProjects, useCreateResumeProject, useUpdateResumeProject, useDeleteResumeProject } from "@/hooks/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, GripVertical, Rocket, Folder, BarChart3, Target, Zap, TrendingUp, Globe, Code2 } from "lucide-react";
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

// Icon Map for preview
const iconMap: Record<string, any> = {
    Rocket, Folder, BarChart3, Target, Zap, TrendingUp, Globe, Code2
};

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

    const IconComp = iconMap[entry.icon_name] || Folder;

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
            <TableCell>
                <div className="flex items-center gap-2">
                    <IconComp className="w-4 h-4 text-primary" />
                    <span className="font-bold">{entry.title}</span>
                </div>
            </TableCell>
            <TableCell className="max-w-[200px] truncate">{entry.description}</TableCell>
            <TableCell>{entry.impact}</TableCell>
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

export default function ProjectsTab() {
    const { data: entries, isLoading } = useResumeProjects(true); // Fetch all including inactive
    const { mutate: createEntry, isLoading: isCreating } = useCreateResumeProject();
    const { mutate: updateEntry, isLoading: isUpdating } = useUpdateResumeProject();
    const { mutate: deleteEntry, isLoading: isDeleting } = useDeleteResumeProject();

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

        const technologiesInput = formData.get("technologies") as string;
        const technologies = technologiesInput
            ? technologiesInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
            : [];

        const data = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            impact: formData.get("impact") as string,
            icon_name: formData.get("icon_name") as string,
            technologies,
            active: formData.get("active") === "on",
            order: editingEntry ? editingEntry.order : entriesList.length + 1
        };

        try {
            if (editingEntry) {
                await updateEntry(editingEntry.id, data);
                toast.success("Project updated");
            } else {
                await createEntry(data);
                toast.success("Project created");
            }
            setIsDialogOpen(false);
            setEditingEntry(null);
        } catch (error) {
            toast.error("Failed to save");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this project?")) {
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
                <h3 className="text-lg font-medium">Featured Projects</h3>
                <Button onClick={() => { setEditingEntry(null); setIsDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Card className="bg-card/50 border-white/5">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-white/5 border-white/5">
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Impact</TableHead>
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
                                    <TableRow><TableCell colSpan={5} className="text-center">No projects found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </DndContext>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingEntry ? "Edit Project" : "Add Project"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input name="title" defaultValue={editingEntry?.title} required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea name="description" defaultValue={editingEntry?.description} className="h-20" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Impact Statement</label>
                            <Input name="impact" defaultValue={editingEntry?.impact} placeholder="e.g. Increased revenue by 30%" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Technologies (comma separated)</label>
                                <Input name="technologies" defaultValue={editingEntry?.technologies?.join(', ')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Icon Name (Lucide)</label>
                                <div className="flex gap-2">
                                    <Input name="icon_name" defaultValue={editingEntry?.icon_name || 'Folder'} placeholder="Rocket, BarChart3, etc." />
                                    <div className="text-xs text-muted-foreground self-center">e.g. Rocket, Folder</div>
                                </div>
                            </div>
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
