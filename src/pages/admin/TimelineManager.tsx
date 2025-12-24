import { useState } from "react";
import { useTimeline, useCreateTimelineEntry, useUpdateTimelineEntry, useDeleteTimelineEntry } from "@/hooks/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function TimelineManager() {
  const { data: entries, isLoading } = useTimeline();
  const { mutate: createEntry, isLoading: isCreating } = useCreateTimelineEntry();
  const { mutate: updateEntry, isLoading: isUpdating } = useUpdateTimelineEntry();
  const { mutate: deleteEntry, isLoading: isDeleting } = useDeleteTimelineEntry();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Parse images from comma-separated string
    const imagesInput = formData.get("images") as string;
    const images = imagesInput 
      ? imagesInput.split(',').map(url => url.trim()).filter(url => url.length > 0)
      : undefined;
    
    const data = {
      year: formData.get("year") as string,
      title: formData.get("title") as string,
      content: formData.get("content") as string, // Storing as string for now
      images: images,
      order: parseInt(formData.get("order") as string) || 0,
      active: true,
    };

    try {
      if (editingEntry) {
        await updateEntry(editingEntry.id, data);
        toast.success("Entry updated");
      } else {
        await createEntry(data);
        toast.success("Entry created");
      }
      setIsDialogOpen(false);
      setEditingEntry(null);
    } catch (error) {
      toast.error("Failed to save");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this entry?")) {
      try {
        await deleteEntry(id);
        toast.success("Deleted");
      } catch (error) {
        toast.error("Failed to delete");
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Timeline</h1>
          <p className="text-muted-foreground">Manage your career journey milestones.</p>
        </div>
        <Button onClick={() => { setEditingEntry(null); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      <Card className="bg-card/50 border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/5 border-white/5">
                <TableHead>Year</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : entries && entries.length > 0 ? (
                entries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-white/5 border-white/5">
                    <TableCell className="font-bold">{entry.year}</TableCell>
                    <TableCell>{entry.title}</TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-xs">
                      {typeof entry.content === 'string' ? entry.content : 'Complex content'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingEntry(entry); setIsDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(entry.id)} disabled={isDeleting}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No entries yet. Create your first timeline entry!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Edit Entry" : "New Entry"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Input name="year" defaultValue={editingEntry?.year} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <Input type="number" name="order" defaultValue={editingEntry?.order || 0} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input name="title" defaultValue={editingEntry?.title} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea name="content" defaultValue={editingEntry?.content} className="h-32" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Images (comma-separated URLs)</label>
              <Textarea 
                name="images" 
                defaultValue={editingEntry?.images?.join(', ') || ''} 
                className="h-20" 
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
              <p className="text-xs text-muted-foreground">Enter image URLs separated by commas</p>
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
