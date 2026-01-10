import { useState, useEffect } from "react";
import { useCertifications, useCreateCertification, useUpdateCertification, useDeleteCertification } from "@/hooks/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Award, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CertificationsManager() {
  const { data: certifications, isLoading } = useCertifications();
  const createCertification = useCreateCertification();
  const updateCertification = useUpdateCertification();
  const deleteCertification = useDeleteCertification();
  const [refreshKey, setRefreshKey] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date: "",
    description: "",
    credential_url: "",
    order_index: 0,
    is_active: true,
  });

  useEffect(() => {
    if (editingCert) {
      setFormData({
        title: editingCert.title || "",
        issuer: editingCert.issuer || "",
        date: editingCert.date || "",
        description: editingCert.description || "",
        credential_url: editingCert.credential_url || "",
        order_index: editingCert.order_index || 0,
        is_active: editingCert.is_active ?? true,
      });
    } else {
      setFormData({
        title: "",
        issuer: "",
        date: "",
        description: "",
        credential_url: "",
        order_index: 0,
        is_active: true,
      });
    }
  }, [editingCert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCert) {
        await updateCertification.mutate(editingCert.id, formData);
        toast.success("Certification updated successfully!");
      } else {
        await createCertification.mutate(formData);
        toast.success("Certification created successfully!");
      }
      
      setIsDialogOpen(false);
      setEditingCert(null);
      setRefreshKey(prev => prev + 1);
      
      // Reload page to refresh data
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error("Failed to save certification");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    
    try {
      await deleteCertification.mutate(id);
      toast.success("Certification deleted successfully!");
      setRefreshKey(prev => prev + 1);
      
      // Reload page to refresh data
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error("Failed to delete certification");
      console.error(error);
    }
  };

  const handleEdit = (cert: any) => {
    setEditingCert(cert);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingCert(null);
    setIsDialogOpen(false);
    setTimeout(() => setIsDialogOpen(true), 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Certifications Manager</h1>
          <p className="text-muted-foreground mt-1">
            Manage professional certifications and achievements
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCert ? "Edit Certification" : "Add New Certification"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for the certification or achievement
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Business Analytics Certificate"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuer">Issuer *</Label>
                <Input
                  id="issuer"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="e.g., Google, PMI, HubSpot"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g., 2023, Jan 2023, 2023-2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the certification..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credential_url">Credential URL</Label>
                <Input
                  id="credential_url"
                  type="url"
                  value={formData.credential_url}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  placeholder="https://... or Google Drive link"
                />
                <p className="text-xs text-muted-foreground">
                  Link to certificate verification or credential page. Supports Google Drive links.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">Display Order</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked as boolean })
                  }
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Active (show on website)
                </Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingCert(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createCertification.isLoading || updateCertification.isLoading}>
                  {(createCertification.isLoading || updateCertification.isLoading) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingCert ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {certifications && certifications.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert: any) => (
            <Card key={cert.id} className={!cert.is_active ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-2">{cert.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {cert.issuer} • {cert.date}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(cert)}
                      className="h-8 w-8"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cert.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {cert.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {cert.description}
                  </p>
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-2 inline-block"
                    >
                      View Certificate →
                    </a>
                  )}
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <span>Order: {cert.order_index}</span>
                    <span>•</span>
                    <span className={cert.is_active ? "text-green-600" : "text-red-600"}>
                      {cert.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              No certifications found. Add your first certification to get started.
            </p>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
