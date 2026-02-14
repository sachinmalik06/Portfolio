import { useState, useEffect } from "react";
import { useResumeCertifications, useCreateResumeCertification, useUpdateResumeCertification, useDeleteResumeCertification } from "@/hooks/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, GripVertical, Award, Image as ImageIcon, Link as LinkIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";
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
            <TableCell>
                {entry.image_url ? (
                    <img src={entry.image_url} alt={entry.name} className="w-10 h-10 rounded object-cover border border-white/10" />
                ) : (
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center border border-white/5">
                        <ImageIcon className="w-5 h-5 text-primary/40" />
                    </div>
                )}
            </TableCell>
            <TableCell className="font-bold">{entry.name}</TableCell>
            <TableCell>{entry.issuer}</TableCell>
            <TableCell>{entry.year}</TableCell>
            <TableCell className="text-muted-foreground text-sm font-mono">{entry.credential_id || "-"}</TableCell>
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

export default function CertificationsTab() {
    const { data: entries, isLoading } = useResumeCertifications(true);
    const { mutate: createEntry, isLoading: isCreating } = useCreateResumeCertification();
    const { mutate: updateEntry, isLoading: isUpdating } = useUpdateResumeCertification();
    const { mutate: deleteEntry, isLoading: isDeleting } = useDeleteResumeCertification();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<any>(null);
    const [entriesList, setEntriesList] = useState<any[]>([]);
    const [imageUrl, setImageUrl] = useState("");
    const [imageMode, setImageMode] = useState<"url" | "upload">("url");

    useEffect(() => {
        if (entries && entries.length > 0) {
            setEntriesList([...(entries as any[])]);
        } else {
            setEntriesList([]);
        }
    }, [entries]);

    useEffect(() => {
        if (isDialogOpen) {
            setImageUrl(editingEntry?.image_url || "");
            setImageMode("url");
        }
    }, [isDialogOpen, editingEntry]);

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
            issuer: formData.get("issuer") as string,
            year: formData.get("year") as string,
            credential_id: formData.get("credential_id") as string,
            image_url: imageUrl,
            description: formData.get("description") as string,
            credential_url: formData.get("credential_url") as string,
            active: formData.get("active") === "on",
            order: editingEntry ? editingEntry.order : entriesList.length + 1
        };

        try {
            if (editingEntry) {
                await updateEntry(editingEntry.id, data);
                toast.success("Certification updated");
            } else {
                await createEntry(data);
                toast.success("Certification created");
            }
            setIsDialogOpen(false);
            setEditingEntry(null);
            setImageUrl("");

            // Reload to refresh the stale cache from useSupabaseQuery
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this certification?")) {
            try {
                await deleteEntry(id);
                toast.success("Deleted");
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } catch (error) {
                toast.error("Failed to delete");
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Certifications</h3>
                <Button onClick={() => { setEditingEntry(null); setIsDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certification
                </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Card className="bg-card/50 border-white/5">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-white/5 border-white/5">
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead className="w-[60px]">Icon</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Issuer</TableHead>
                                    <TableHead>Year</TableHead>
                                    <TableHead>Credential ID</TableHead>
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
                                    <TableRow><TableCell colSpan={5} className="text-center">No certifications found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </DndContext>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingEntry ? "Edit Certification" : "Add Certification"}</DialogTitle>
                    </DialogHeader>
                    <form
                        key={editingEntry?.id || "new-cert"}
                        onSubmit={handleSubmit}
                        className="space-y-4 mt-4"
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Certification Name</label>
                            <Input name="name" defaultValue={editingEntry?.name} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Issuer</label>
                                <Input name="issuer" defaultValue={editingEntry?.issuer} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Year</label>
                                <Input name="year" defaultValue={editingEntry?.year} required placeholder="2023" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Credential ID (Optional)</label>
                            <Input name="credential_id" defaultValue={editingEntry?.credential_id} placeholder="ID-123456" />
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Certification Logo</label>
                                <div className="flex gap-2 bg-muted/50 p-1 rounded-lg">
                                    <Button
                                        type="button"
                                        variant={imageMode === "url" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setImageMode("url")}
                                        className="h-7 px-2 text-xs gap-1"
                                    >
                                        <LinkIcon className="w-3 h-3" />
                                        URL
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={imageMode === "upload" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setImageMode("upload")}
                                        className="h-7 px-2 text-xs gap-1"
                                    >
                                        <Upload className="w-3 h-3" />
                                        Upload
                                    </Button>
                                </div>
                            </div>

                            {imageMode === "url" ? (
                                <div className="space-y-2">
                                    <Input
                                        name="image_url_input"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://example.com/logo.png"
                                    />
                                    <p className="text-xs text-muted-foreground">URL of the certification logo</p>
                                </div>
                            ) : (
                                <ImageUpload
                                    label=""
                                    currentImageUrl={imageUrl}
                                    onImageUploaded={setImageUrl}
                                    folder="certifications"
                                    description="PNG, JPG, WEBP (max 2MB)"
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea name="description" defaultValue={editingEntry?.description} className="h-20" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Credential URL (Optional)</label>
                            <Input name="credential_url" defaultValue={editingEntry?.credential_url} placeholder="https://..." />
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
