import { useState, useEffect } from "react";
import { usePage, useUpdatePage, useSiteSettings, useAboutFooterText, useUpdateAboutFooterText, useTimeline, useCreateTimelineEntry, useUpdateTimelineEntry, useDeleteTimelineEntry, useExpertiseCards, useCreateExpertiseCard, useUpdateExpertiseCard, useDeleteExpertiseCard } from "@/hooks/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { SocialLinksEditor, type SocialLink } from "@/components/admin/SocialLinksEditor";
import { useLocation } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
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

export default function PagesManager() {
  const location = useLocation();
  const getTabFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'about';
  };
  const [activeTab, setActiveTab] = useState(getTabFromUrl());

  // Update tab when URL changes
  useEffect(() => {
    const tab = getTabFromUrl();
    setActiveTab(tab);
  }, [location.search]);
  
  const { data: aboutPage } = usePage("about");
  const { data: contactPage } = usePage("contact");
  const { data: siteSettings } = useSiteSettings();
  const { mutate: updatePage, isLoading: isUpdating } = useUpdatePage();

  const handleSave = async (slug: string, data: any) => {
    try {
      await updatePage(slug, data, slug.charAt(0).toUpperCase() + slug.slice(1));
      toast.success("Page updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update page");
    }
  };

  const handleSiteSettingsSave = async (settings: { headerTitle: string; pageTitle: string; faviconUrl: string }) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'general', value: settings } as any, { onConflict: 'key' });
      if (error) throw error;
      toast.success("Site settings updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings");
    }
  };

  // Get page titles for headers
  const pageTitles: Record<string, string> = {
    about: "About Page",
    expertise: "Expertise Page",
    contact: "Contact Page",
    settings: "Site Settings"
  };

  const pageDescriptions: Record<string, string> = {
    about: "Manage about page content, footer text, and timeline entries.",
    expertise: "Manage expertise cards displayed on the expertise page.",
    contact: "Manage contact page information and social links.",
    settings: "Manage global site settings like header title, page title, and favicon."
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">{pageTitles[activeTab] || "Page Content"}</h1>
        <p className="text-muted-foreground">{pageDescriptions[activeTab] || "Manage text and content for your pages."}</p>
      </div>

      {/* Show content directly based on active tab - no tabs list when coming from sidebar */}
      <div className="space-y-6">
        {activeTab === "about" && (
          <div className="space-y-6">
            <AboutEditor 
              initialData={(aboutPage as any)?.content} 
              onSave={(data) => handleSave("about", data)} 
            />
            <AboutFooterTextEditor />
            <TimelineSection />
          </div>
        )}

        {activeTab === "expertise" && (
          <ExpertiseSection />
        )}
        
        {activeTab === "contact" && (
          <ContactEditor 
            initialData={(contactPage as any)?.content} 
            onSave={(data) => handleSave("contact", data)} 
          />
        )}

        {activeTab === "settings" && (
          <SiteSettingsEditor initialData={siteSettings} onSave={handleSiteSettingsSave} />
        )}
      </div>
    </div>
  );
}

function AboutEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    introTitle: "Harsh Jeswani",
    introSubtitle: "About",
    introText: "Strategic thinker and creative problem solver.",
    encryptedText: "Building the future through innovation, leadership, and relentless pursuit of excellence.",
    role: "Strategist & Leader",
    focus: "Innovation & Growth",
    location: "Global",
    ...initialData
  });

  useEffect(() => {
    if (initialData) setFormData({ ...formData, ...initialData });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className="bg-card/50 border-white/5">
      <CardHeader>
        <CardTitle>About Page</CardTitle>
        <CardDescription>Manage the introduction and personal details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Intro Subtitle (Small)</Label>
            <Input name="introSubtitle" value={formData.introSubtitle} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Main Name / Title</Label>
            <Input name="introTitle" value={formData.introTitle} onChange={handleChange} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Primary Description</Label>
          <Textarea name="introText" value={formData.introText} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label>Encrypted Text (Animated)</Label>
          <Textarea name="encryptedText" value={formData.encryptedText} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <Input name="role" value={formData.role} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Focus</Label>
            <Input name="focus" value={formData.focus} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input name="location" value={formData.location} onChange={handleChange} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onSave(formData)}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ContactEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    tagline: "Harsh Jeswani",
    title: "Let's Connect",
    description: "Available for strategic consulting, creative collaborations, and meaningful conversations about design and innovation.",
    socialLinks: [] as SocialLink[],
    ...initialData
  });

  useEffect(() => {
    if (initialData) {
      let socialLinks = Array.isArray(initialData.socialLinks) ? initialData.socialLinks : [];
      
      // Handle backward compatibility: convert old 'email' or 'emails' fields to social links
      if (initialData.email && !socialLinks.some((link: any) => link.platform === "gmail" || link.href?.startsWith("mailto:"))) {
        socialLinks.push({
          platform: "gmail",
          href: `mailto:${initialData.email}`
        });
      } else if (initialData.emails && Array.isArray(initialData.emails) && initialData.emails.length > 0) {
        // Convert emails array to social links if not already converted
        initialData.emails.forEach((email: string) => {
          if (!socialLinks.some((link: any) => link.href === `mailto:${email}`)) {
            socialLinks.push({
              platform: "gmail",
              href: `mailto:${email}`
            });
          }
        });
      }
      
      setFormData({ 
        tagline: "Harsh Jeswani",
        title: "Let's Connect",
        description: "Available for strategic consulting, creative collaborations, and meaningful conversations about design and innovation.",
        ...initialData,
        socialLinks: socialLinks // Override with converted social links
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className="bg-card/50 border-white/5">
      <CardHeader>
        <CardTitle>Contact Page</CardTitle>
        <CardDescription>Update contact information and social links.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Tagline (Small)</Label>
          <Input name="tagline" value={formData.tagline} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label>Main Title</Label>
          <Input name="title" value={formData.title} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea name="description" value={formData.description} onChange={handleChange} className="h-24" />
        </div>

        <div className="space-y-4 pt-4 border-t border-border/50">
          <SocialLinksEditor
            socialLinks={formData.socialLinks || []}
            onChange={(links) => setFormData({ ...formData, socialLinks: links })}
            title="Social Links & Email Addresses"
            description="Manage all contact links including email addresses and social media. Select 'Gmail' platform for email addresses or choose any other social platform."
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onSave(formData)}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SiteSettingsEditor({ initialData, onSave }: { initialData: any, onSave: (settings: { headerTitle: string; pageTitle: string; faviconUrl: string }) => void }) {
  const [headerTitle, setHeaderTitle] = useState("CINEMATIC STRATEGY");
  const [pageTitle, setPageTitle] = useState("Cinematic Strategy - Strategic Consulting & Creative Direction");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.headerTitle) setHeaderTitle(initialData.headerTitle);
      if (initialData.pageTitle) setPageTitle(initialData.pageTitle);
      if (initialData.faviconUrl) setFaviconUrl(initialData.faviconUrl);
    }
  }, [initialData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ headerTitle, pageTitle, faviconUrl });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-card/50 border-white/5">
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>Manage global site settings like the header title, page title, and favicon.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Header Title</Label>
          <Input 
            value={headerTitle} 
            onChange={(e) => setHeaderTitle(e.target.value)} 
            placeholder="CINEMATIC STRATEGY"
          />
          <p className="text-xs text-muted-foreground">This appears in the top-left corner of the landing page.</p>
        </div>

        <div className="space-y-2">
          <Label>Page Title (Browser Tab)</Label>
          <Input 
            value={pageTitle} 
            onChange={(e) => setPageTitle(e.target.value)} 
            placeholder="Cinematic Strategy - Strategic Consulting & Creative Direction"
          />
          <p className="text-xs text-muted-foreground">This appears in the browser tab title.</p>
        </div>

        <div className="space-y-2">
          <Label>Favicon URL</Label>
          <Input 
            value={faviconUrl} 
            onChange={(e) => setFaviconUrl(e.target.value)} 
            placeholder="https://example.com/favicon.svg or data:image/svg+xml,..."
          />
          <p className="text-xs text-muted-foreground">URL or data URI for the favicon. Leave empty to use default.</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AboutFooterTextEditor() {
  const { data: footerText, isLoading } = useAboutFooterText();
  const { mutate: updateFooterText, isLoading: isSaving } = useUpdateAboutFooterText();
  const [formData, setFormData] = useState({
    createText: "LET'S CREATE",
    togetherText: "TOGETHER",
  });

  useEffect(() => {
    if (footerText) {
      setFormData(footerText);
    }
  }, [footerText]);

  const handleSave = async () => {
    try {
      await updateFooterText(formData);
      toast.success("About footer text updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update footer text");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Page Footer Text</CardTitle>
        <CardDescription>
          Edit the text that appears in the masking animation footer section on the About page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="createText">First Line Text</Label>
          <Input
            id="createText"
            value={formData.createText}
            onChange={(e) => setFormData({ ...formData, createText: e.target.value })}
            placeholder="LET'S CREATE"
          />
        </div>
        <div>
          <Label htmlFor="togetherText">Second Line Text</Label>
          <Input
            id="togetherText"
            value={formData.togetherText}
            onChange={(e) => setFormData({ ...formData, togetherText: e.target.value })}
            placeholder="TOGETHER"
          />
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}

// Timeline Section Component (for About Page)
function TimelineSection() {
  const { data: entries, isLoading } = useTimeline();
  const { mutate: createEntry, isLoading: isCreating } = useCreateTimelineEntry();
  const { mutate: updateEntry, isLoading: isUpdating } = useUpdateTimelineEntry();
  const { mutate: deleteEntry, isLoading: isDeleting } = useDeleteTimelineEntry();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [entriesList, setEntriesList] = useState<any[]>([]);

  useEffect(() => {
    if (entries && entries.length > 0) {
      const sortedEntries = [...(entries as any[])].sort((a, b) => (a.order || 0) - (b.order || 0));
      setEntriesList(sortedEntries);
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
        console.error("Error updating order:", error);
        toast.error("Failed to update order");
        if (entries && entries.length > 0) {
          const sortedEntries = [...(entries as any[])].sort((a, b) => (a.order || 0) - (b.order || 0));
          setEntriesList(sortedEntries);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imagesInput = formData.get("images") as string;
    const images = imagesInput 
      ? imagesInput.split(',').map(url => url.trim()).filter(url => url.length > 0)
      : undefined;
    
    const data = {
      year: formData.get("year") as string,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
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
      <TableRow ref={setNodeRef} style={style} className="hover:bg-white/5 border-white/5">
        <TableCell>
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        </TableCell>
        <TableCell className="font-bold">{entry.year}</TableCell>
        <TableCell>{entry.title}</TableCell>
        <TableCell className="text-muted-foreground truncate max-w-xs">
          {typeof entry.content === 'string' ? entry.content : 'Complex content'}
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

  return (
    <Card className="bg-card/50 border-white/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Manage your career journey milestones displayed on the About page.</CardDescription>
          </div>
          <Button onClick={() => { setEditingEntry(null); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-white/5 border-white/5">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Content Preview</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : entriesList && entriesList.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={entriesList.map((entry) => entry.id)} strategy={verticalListSortingStrategy}>
                  {entriesList.map((entry: any) => (
                    <SortableRow
                      key={entry.id}
                      entry={entry}
                      onEdit={(entry) => { setEditingEntry(entry); setIsDialogOpen(true); }}
                      onDelete={handleDelete}
                      isDeleting={isDeleting}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No entries yet. Create your first timeline entry!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Edit Entry" : "New Entry"}</DialogTitle>
            <DialogDescription>
              {editingEntry ? "Update the timeline entry details below." : "Fill in the details to create a new timeline entry."}
            </DialogDescription>
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
    </Card>
  );
}

// Expertise Section Component
function ExpertiseSection() {
  const { data: cards, isLoading } = useExpertiseCards(true);
  const { mutate: createCard, isLoading: isCreating } = useCreateExpertiseCard();
  const { mutate: updateCard, isLoading: isUpdating } = useUpdateExpertiseCard();
  const { mutate: deleteCard, isLoading: isDeleting } = useDeleteExpertiseCard();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [imagesInput, setImagesInput] = useState<string>("");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (cards && cards.length > 0) {
      const sortedCards = [...(cards as any[])].sort((a, b) => (a.order || 0) - (b.order || 0));
      setItems(sortedCards);
    }
  }, [cards]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      try {
        const updatePromises = newItems.map((item, index) =>
          updateCard(item.id, { order: index + 1 })
        );
        await Promise.all(updatePromises);
        toast.success("Order updated successfully");
      } catch (error) {
        console.error("Error updating order:", error);
        toast.error("Failed to update order");
        if (cards && cards.length > 0) {
          const sortedCards = [...(cards as any[])].sort((a, b) => (a.order || 0) - (b.order || 0));
          setItems(sortedCards);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imagesString = imagesInput || (formData.get("images") as string) || "";
    const imagesArray = imagesString.split(",").map(s => s.trim()).filter(Boolean);
    
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      long_description: formData.get("longDescription") as string,
      icon: formData.get("icon") as string,
      skills: ((formData.get("skills") as string) || "").split(",").map(s => s.trim()).filter(Boolean),
      images: imagesArray,
      order: parseInt(formData.get("order") as string) || 0,
      active: true,
    };

    try {
      if (editingCard) {
        await updateCard(editingCard.id, data);
        toast.success("Card updated successfully");
      } else {
        await createCard(data);
        toast.success("Card created successfully");
      }
      setIsDialogOpen(false);
      setEditingCard(null);
      setImagesInput("");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save card");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      try {
        await deleteCard(id);
        toast.success("Card deleted");
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const openEdit = (card: any) => {
    setEditingCard(card);
    if (card?.images && Array.isArray(card.images) && card.images.length > 0) {
      setImagesInput(card.images.join(", "));
    } else {
      setImagesInput("");
    }
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingCard(null);
    setImagesInput("");
    setIsDialogOpen(true);
  };

  function SortableRow({ card, onEdit, onDelete, isDeleting }: { card: any; onEdit: (card: any) => void; onDelete: (id: string) => void; isDeleting: boolean }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: card.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <TableRow ref={setNodeRef} style={style} className="hover:bg-white/5 border-white/5">
        <TableCell>
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        </TableCell>
        <TableCell className="font-medium">{card.title}</TableCell>
        <TableCell className="text-muted-foreground truncate max-w-xs">{card.description}</TableCell>
        <TableCell>{card.icon}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(card)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(card.id)} disabled={isDeleting}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Expertise Cards</h1>
          <p className="text-muted-foreground">Manage the cards displayed on the Expertise page.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Card
        </Button>
      </div>

      <Card className="bg-card/50 border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/5 border-white/5">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : items && items.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                    {items.map((card: any) => (
                      <SortableRow
                        key={card.id}
                        card={card}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No cards found. Click "Add New Card" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingCard(null);
          setImagesInput("");
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCard ? "Edit Card" : "Create New Card"}</DialogTitle>
            <DialogDescription>
              {editingCard ? "Update the expertise card details below." : "Fill in the details to create a new expertise card."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input name="title" defaultValue={editingCard?.title} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon (Lucide Name)</label>
                <Input name="icon" defaultValue={editingCard?.icon} placeholder="e.g. Target, Users" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Short Description</label>
              <Textarea name="description" defaultValue={editingCard?.description} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Long Description (Modal)</label>
              <Textarea 
                name="longDescription" 
                defaultValue={editingCard?.long_description || editingCard?.longDescription} 
                className="h-32" 
                placeholder="This detailed description appears in the modal when users click on the card..."
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Skills (comma separated)</label>
              <Input name="skills" defaultValue={editingCard?.skills?.join(", ")} placeholder="Strategy, Planning, Analysis" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URLs (comma separated)</label>
              <Input 
                name="images" 
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" 
              />
              <p className="text-xs text-muted-foreground">
                First image appears in the modal when clicking the card. First 2 images appear as floating previews on hover (desktop only).
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Order</label>
              <Input type="number" name="order" defaultValue={editingCard?.order || 0} />
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Saving..." : "Save Card"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}