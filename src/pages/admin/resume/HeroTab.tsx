import { useState, useEffect } from "react";
import { useResumeHero, useUpdateResumeHero, useCreateResumeHero } from "@/hooks/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Plus, X, Image as ImageIcon, Link as LinkIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";

export default function HeroTab() {
    const { data: heroDataRaw, isLoading } = useResumeHero();
    const heroData = heroDataRaw as any;
    const { mutate: updateHero, isLoading: isUpdating } = useUpdateResumeHero();
    const { mutate: createHero, isLoading: isCreating } = useCreateResumeHero();

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        bio: "",
        email: "",
        phone: "",
        location: "",
        professional_summary: "",
        resume_url: "",
        image_url: "",
    });

    const [socialLinks, setSocialLinks] = useState<any[]>([]);
    const [summaryTags, setSummaryTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [imageMode, setImageMode] = useState<"url" | "upload">("url");

    useEffect(() => {
        if (heroData) {
            setFormData({
                name: heroData.name || "",
                role: heroData.role || "",
                bio: heroData.bio || "",
                email: heroData.email || "",
                phone: heroData.phone || "",
                location: heroData.location || "",
                professional_summary: heroData.professional_summary || "",
                resume_url: heroData.resume_url || "",
                image_url: heroData.image_url || "",
            });
            setSocialLinks(heroData.social_links || []);
            setSummaryTags(heroData.summary_tags || []);
            setImageMode("url");
        }
    }, [heroData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!heroData?.id) {
            toast.error("No hero data found to update");
            return;
        }

        try {
            if (heroData?.id) {
                await updateHero(heroData.id, {
                    ...formData,
                    social_links: socialLinks,
                    summary_tags: summaryTags,
                });
            } else {
                await createHero({
                    ...formData,
                    social_links: socialLinks,
                    summary_tags: summaryTags,
                    active: true
                });
            }
            toast.success("Hero section updated successfully!");
        } catch (error) {
            toast.error("Failed to update hero section");
            console.error(error);
        }
    };

    const addSocialLink = () => {
        setSocialLinks([
            ...socialLinks,
            { platform: "", url: "", icon_name: "" },
        ]);
    };

    const updateSocialLink = (index: number, field: string, value: string) => {
        const updated = [...socialLinks];
        updated[index] = { ...updated[index], [field]: value };
        setSocialLinks(updated);
    };

    const removeSocialLink = (index: number) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
    };

    const addTag = () => {
        if (newTag.trim() && !summaryTags.includes(newTag.trim())) {
            setSummaryTags([...summaryTags, newTag.trim()]);
            setNewTag("");
        }
    };

    const removeTag = (tag: string) => {
        setSummaryTags(summaryTags.filter((t) => t !== tag));
    };

    if (isLoading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Hero Section & Professional Summary</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card className="bg-card/50 border-white/5">
                    <CardContent className="p-6 space-y-4">
                        <h4 className="font-semibold text-md mb-4">Basic Information</h4>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Profile Picture</label>
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
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        placeholder="https://example.com/profile.jpg"
                                    />
                                    <p className="text-xs text-muted-foreground">Direct URL to your professional profile picture</p>
                                </div>
                            ) : (
                                <ImageUpload
                                    label=""
                                    currentImageUrl={formData.image_url}
                                    onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                                    folder="profile"
                                    description="Professional headshot. PNG, JPG, WEBP (max 5MB)"
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Sachin Malik"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Professional Role</label>
                                <Input
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    placeholder="International Business Management Professional"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Short Bio (for hero section)</label>
                            <Textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Brief introduction..."
                                rows={2}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="bg-card/50 border-white/5">
                    <CardContent className="p-6 space-y-4">
                        <h4 className="font-semibold text-md mb-4">Contact Information</h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+49 XXX XXX XXXX"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Berlin, Germany"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Resume URL (PDF link)</label>
                            <Input
                                type="text"
                                value={formData.resume_url}
                                onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                                placeholder="/resume.pdf (if file is in public folder) or https://example.com/resume.pdf"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Professional Summary */}
                <Card className="bg-card/50 border-white/5">
                    <CardContent className="p-6 space-y-4">
                        <h4 className="font-semibold text-md mb-4">Professional Summary</h4>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Detailed Summary</label>
                            <Textarea
                                value={formData.professional_summary}
                                onChange={(e) => setFormData({ ...formData, professional_summary: e.target.value })}
                                placeholder="Detailed professional summary..."
                                rows={5}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Summary Tags</label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Add a tag (e.g., Business Analytics)"
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addTag();
                                        }
                                    }}
                                />
                                <Button type="button" onClick={addTag} variant="outline">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {summaryTags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                                    >
                                        <span>{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-destructive"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="bg-card/50 border-white/5">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-md">Social Links</h4>
                            <Button type="button" onClick={addSocialLink} variant="outline" size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Link
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {socialLinks.map((link, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-card/30 rounded-lg">
                                    <Input
                                        placeholder="Platform (e.g., LinkedIn)"
                                        value={link.platform}
                                        onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                                    />
                                    <Input
                                        placeholder="URL"
                                        value={link.url}
                                        onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                                    />
                                    <Input
                                        placeholder="Icon name (e.g., linkedin)"
                                        value={link.icon_name}
                                        onChange={(e) => updateSocialLink(index, "icon_name", e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive"
                                        onClick={() => removeSocialLink(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {socialLinks.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No social links added yet
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdating || isCreating} size="lg">
                        <Save className="w-4 h-4 mr-2" />
                        {isUpdating || isCreating ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
