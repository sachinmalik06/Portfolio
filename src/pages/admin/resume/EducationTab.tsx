import { useState, useEffect } from "react";
import { useResumeEducation, useCreateResumeEducation, useUpdateResumeEducation, useDeleteResumeEducation } from "@/hooks/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, GripVertical, GraduationCap } from "lucide-react";
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
            <TableCell className="font-bold">{entry.degree}</TableCell>
            <TableCell>{entry.institution}</TableCell>
            <TableCell>{entry.start_year} - {entry.end_year || 'Present'}</TableCell>
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

export default function EducationTab() {
    const { data: entries, isLoading } = useResumeEducation(true);
    const { mutate: createEntry, isLoading: isCreating } = useCreateResumeEducation();
    const { mutate: updateEntry, isLoading: isUpdating } = useUpdateResumeEducation();
    const { mutate: deleteEntry, isLoading: isDeleting } = useDeleteResumeEducation();

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

        // Parse lists
        const highlightsInput = formData.get("highlights") as string;
        const highlights = highlightsInput
            ? highlightsInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
            : [];

        const courseworkInput = formData.get("coursework") as string;
        const coursework = courseworkInput
            ? courseworkInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
            : [];

        const data = {
            degree: formData.get("degree") as string,
            institution: formData.get("institution") as string,
            location: formData.get("location") as string,
            start_year: formData.get("start_year") as string,
            end_year: formData.get("end_year") as string,
            gpa: formData.get("gpa") as string,
            highlights,
            coursework,
            active: formData.get("active") === "on",
            order: editingEntry ? editingEntry.order : entriesList.length + 1
        };

        try {
            if (editingEntry) {
                await updateEntry(editingEntry.id, data);
                toast.success("Education updated");
            } else {
                await createEntry(data);
                toast.success("Education created");
            }
            setIsDialogOpen(false);
            setEditingEntry(null);
        } catch (error) {
            toast.error("Failed to save");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this education entry?")) {
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
                <h3 className="text-lg font-medium">Education</h3>
                <Button onClick={() => { setEditingEntry(null); setIsDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Card className="bg-card/50 border-white/5">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-white/5 border-white/5">
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Degree</TableHead>
                                    <TableHead>Institution</TableHead>
                                    <TableHead>Years</TableHead>
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
                                    <TableRow><TableCell colSpan={5} className="text-center">No education found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </DndContext>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingEntry ? "Edit Education" : "Add Education"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Degree</label>
                            <Input name="degree" defaultValue={editingEntry?.degree} required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Institution</label>
                            <Input name="institution" defaultValue={editingEntry?.institution} required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <Input name="location" defaultValue={editingEntry?.location} />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Start Year</label>
                                <Input name="start_year" defaultValue={editingEntry?.start_year} placeholder="2020" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">End Year</label>
                                <Input name="end_year" defaultValue={editingEntry?.end_year} placeholder="2024" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">GPA / Grade</label>
                                <Input name="gpa" defaultValue={editingEntry?.gpa} placeholder="3.8/4.0" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Highlights (comma separated)</label>
                            <Textarea
                                name="highlights"
                                defaultValue={editingEntry?.highlights?.join(', ')}
                                className="h-20"
                                placeholder="Dean's List, Scholarship Recipient"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Coursework (comma separated)</label>
                            <Textarea
                                name="coursework"
                                defaultValue={editingEntry?.coursework?.join(', ')}
                                className="h-24"
                                placeholder="Data Structures, Algorithms, Database Systems"
                            />
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
