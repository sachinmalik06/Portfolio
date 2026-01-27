import { useState, useEffect } from "react";
import { useResumeStats, useCreateResumeStat, useUpdateResumeStat, useDeleteResumeStat } from "@/hooks/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, GripVertical, Briefcase, Award, Rocket, TrendingUp, BarChart3, Globe, Code2 } from "lucide-react";
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
    Briefcase, Award, Rocket, TrendingUp, BarChart3, Globe, Code2
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

    const IconComp = iconMap[entry.icon_name] || BarChart3;

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
                    <IconComp className={`w-4 h-4 ${entry.color || 'text-primary'}`} />
                    <span className="font-bold">{entry.label}</span>
                </div>
            </TableCell>
            <TableCell>{entry.value}{entry.suffix}</TableCell>
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

export default function StatsTab() {
    const { data: entries, isLoading } = useResumeStats(true);
    const { mutate: createEntry, isLoading: isCreating } = useCreateResumeStat();
    const { mutate: updateEntry, isLoading: isUpdating } = useUpdateResumeStat();
    const { mutate: deleteEntry, isLoading: isDeleting } = useDeleteResumeStat();

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
            label: formData.get("label") as string,
            value: parseInt(formData.get("value") as string),
            suffix: formData.get("suffix") as string,
            icon_name: formData.get("icon_name") as string,
            color: formData.get("color") as string,
            active: formData.get("active") === "on",
            order: editingEntry ? editingEntry.order : entriesList.length + 1
        };

        try {
            if (editingEntry) {
                await updateEntry(editingEntry.id, data);
                toast.success("Stat updated");
            } else {
                await createEntry(data);
                toast.success("Stat created");
            }
            setIsDialogOpen(false);
            setEditingEntry(null);
        } catch (error) {
            toast.error("Failed to save");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this stat?")) {
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
                <h3 className="text-lg font-medium">Key Statistics</h3>
                <Button onClick={() => { setEditingEntry(null); setIsDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Stat
                </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Card className="bg-card/50 border-white/5">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-white/5 border-white/5">
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Label</TableHead>
                                    <TableHead>Value</TableHead>
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
                                    <TableRow><TableCell colSpan={5} className="text-center">No stats found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </DndContext>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingEntry ? "Edit Stat" : "Add Stat"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Label</label>
                            <Input name="label" defaultValue={editingEntry?.label} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Value (Number)</label>
                                <Input type="number" name="value" defaultValue={editingEntry?.value} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Suffix (e.g. +, %, k)</label>
                                <Input name="suffix" defaultValue={editingEntry?.suffix} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Icon Name</label>
                                <Input name="icon_name" defaultValue={editingEntry?.icon_name || 'BarChart3'} placeholder="BarChart3, Rocket" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Color Class</label>
                                <Input name="color" defaultValue={editingEntry?.color || 'text-primary'} placeholder="text-primary, text-blue-500" />
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
