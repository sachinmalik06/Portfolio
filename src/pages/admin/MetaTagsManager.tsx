import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useMetaTags, useUpdateMetaTags } from "@/hooks/use-cms";
import { Globe, Image as ImageIcon, Search, Share2, Link as LinkIcon, Upload } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { supabase } from "@/lib/supabase";

export default function MetaTagsManager() {
  const { data: metaTags, isLoading } = useMetaTags();
  const { mutate: updateMetaTags, isLoading: isUpdating } = useUpdateMetaTags();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: "",
    author: "",
    robots: "index, follow",
    canonical: "",
    themeColor: "#0f0e0d",
    og: {
      type: "website",
      url: "",
      title: "",
      description: "",
      image: "",
      siteName: ""
    },
    twitter: {
      card: "summary_large_image",
      url: "",
      title: "",
      description: "",
      image: ""
    }
  });
  const [ogImageMode, setOgImageMode] = useState<"url" | "upload">("url");
  const [twitterImageMode, setTwitterImageMode] = useState<"url" | "upload">("url");

  useEffect(() => {
    if (metaTags) {
      setFormData({
        title: metaTags.title || "",
        description: metaTags.description || "",
        keywords: metaTags.keywords || "",
        author: metaTags.author || "",
        robots: metaTags.robots || "index, follow",
        canonical: metaTags.canonical || "",
        themeColor: metaTags.themeColor || "#0f0e0d",
        og: {
          type: metaTags.og?.type || "website",
          url: metaTags.og?.url || "",
          title: metaTags.og?.title || "",
          description: metaTags.og?.description || "",
          image: metaTags.og?.image || "",
          siteName: metaTags.og?.siteName || ""
        },
        twitter: {
          card: metaTags.twitter?.card || "summary_large_image",
          url: metaTags.twitter?.url || "",
          title: metaTags.twitter?.title || "",
          description: metaTags.twitter?.description || "",
          image: metaTags.twitter?.image || ""
        }
      });
      setOgImageMode("url");
      setTwitterImageMode("url");
    }
  }, [metaTags]);

  const handleChange = (field: string, value: any) => {
    if (field.startsWith('og.')) {
      const ogField = field.replace('og.', '');
      setFormData(prev => ({
        ...prev,
        og: { ...prev.og, [ogField]: value }
      }));
    } else if (field.startsWith('twitter.')) {
      const twitterField = field.replace('twitter.', '');
      setFormData(prev => ({
        ...prev,
        twitter: { ...prev.twitter, [twitterField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    try {
      await updateMetaTags(formData);
      toast.success("Meta tags updated successfully");
      // Small delay to ensure database is updated before reload
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update meta tags");
    }
  };

  const useProfileImage = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'profile_card')
        .single();

      if (error) throw error;

      const imageUrl = (data as any)?.value?.imageUrl || (data as any)?.value?.cardImageUrl;

      if (imageUrl) {
        setFormData(prev => ({
          ...prev,
          og: { ...prev.og, image: imageUrl },
          twitter: { ...prev.twitter, image: imageUrl }
        }));
        toast.success("Profile image loaded for social media previews");
      } else {
        toast.error("No profile image found in settings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile image");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading meta tags...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Meta Tags & SEO</h1>
        <p className="text-muted-foreground">Manage meta tags, Open Graph, and Twitter Card settings for your portfolio.</p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="bg-card/50 border border-white/5">
          <TabsTrigger value="basic">
            <Search className="w-4 h-4 mr-2" />
            Basic SEO
          </TabsTrigger>
          <TabsTrigger value="og">
            <Share2 className="w-4 h-4 mr-2" />
            Open Graph
          </TabsTrigger>
          <TabsTrigger value="twitter">
            <Share2 className="w-4 h-4 mr-2" />
            Twitter Card
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Globe className="w-4 h-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6 space-y-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle>Basic Meta Tags</CardTitle>
              <CardDescription>Primary SEO meta tags that appear in search engines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Cinematic Strategy - Strategic Consulting & Creative Direction"
                />
                <p className="text-xs text-muted-foreground">The title that appears in browser tabs and search results (50-60 characters recommended).</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Meta Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Strategic consulting and creative direction for forward-thinking organizations..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Brief description of your portfolio (150-160 characters recommended).</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => handleChange('keywords', e.target.value)}
                  placeholder="strategic consulting, creative direction, business strategy"
                />
                <p className="text-xs text-muted-foreground">Comma-separated keywords relevant to your portfolio.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  placeholder="Cinematic Strategy"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="og" className="mt-6 space-y-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle>Open Graph Tags</CardTitle>
              <CardDescription>Control how your site appears when shared on Facebook, LinkedIn, and other platforms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="og.type">Type</Label>
                <Input
                  id="og.type"
                  value={formData.og.type}
                  onChange={(e) => handleChange('og.type', e.target.value)}
                  placeholder="website"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og.url">URL</Label>
                <Input
                  id="og.url"
                  value={formData.og.url}
                  onChange={(e) => handleChange('og.url', e.target.value)}
                  placeholder="https://cinematicstrategy.com"
                />
                <p className="text-xs text-muted-foreground">Full URL of your website.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="og.title">Title</Label>
                <Input
                  id="og.title"
                  value={formData.og.title}
                  onChange={(e) => handleChange('og.title', e.target.value)}
                  placeholder="Cinematic Strategy - Strategic Consulting & Creative Direction"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og.description">Description</Label>
                <Textarea
                  id="og.description"
                  value={formData.og.description}
                  onChange={(e) => handleChange('og.description', e.target.value)}
                  placeholder="Strategic consulting and creative direction..."
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="og.image">Image URL</Label>
                  <div className="flex gap-2 bg-muted/50 p-1 rounded-lg">
                    <Button
                      type="button"
                      variant={ogImageMode === "url" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setOgImageMode("url")}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      <LinkIcon className="w-3 h-3" />
                      URL
                    </Button>
                    <Button
                      type="button"
                      variant={ogImageMode === "upload" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setOgImageMode("upload")}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      Upload
                    </Button>
                  </div>
                </div>

                {ogImageMode === "url" ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        id="og.image"
                        value={formData.og.image}
                        onChange={(e) => handleChange('og.image', e.target.value)}
                        placeholder="https://cinematicstrategy.com/og-image.png"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={useProfileImage}
                        className="whitespace-nowrap"
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Use Profile Image
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">URL to an image (1200x630px recommended).</p>
                  </div>
                ) : (
                  <ImageUpload
                    label=""
                    currentImageUrl={formData.og.image}
                    onImageUploaded={(url) => handleChange('og.image', url)}
                    folder="seo"
                    description="OG Image. 1200x630px JPG or PNG."
                  />
                )}

                {formData.og.image && (
                  <div className="mt-2">
                    <img src={formData.og.image} alt="OG Preview" className="max-w-xs rounded border border-border/50" onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="og.siteName">Site Name</Label>
                <Input
                  id="og.siteName"
                  value={formData.og.siteName}
                  onChange={(e) => handleChange('og.siteName', e.target.value)}
                  placeholder="Cinematic Strategy"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="twitter" className="mt-6 space-y-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle>Twitter Card Tags</CardTitle>
              <CardDescription>Control how your site appears when shared on Twitter/X.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitter.card">Card Type</Label>
                <Input
                  id="twitter.card"
                  value={formData.twitter.card}
                  onChange={(e) => handleChange('twitter.card', e.target.value)}
                  placeholder="summary_large_image"
                />
                <p className="text-xs text-muted-foreground">Options: summary, summary_large_image</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter.url">URL</Label>
                <Input
                  id="twitter.url"
                  value={formData.twitter.url}
                  onChange={(e) => handleChange('twitter.url', e.target.value)}
                  placeholder="https://cinematicstrategy.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter.title">Title</Label>
                <Input
                  id="twitter.title"
                  value={formData.twitter.title}
                  onChange={(e) => handleChange('twitter.title', e.target.value)}
                  placeholder="Cinematic Strategy - Strategic Consulting & Creative Direction"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter.description">Description</Label>
                <Textarea
                  id="twitter.description"
                  value={formData.twitter.description}
                  onChange={(e) => handleChange('twitter.description', e.target.value)}
                  placeholder="Strategic consulting and creative direction..."
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="twitter.image">Image URL</Label>
                  <div className="flex gap-2 bg-muted/50 p-1 rounded-lg">
                    <Button
                      type="button"
                      variant={twitterImageMode === "url" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setTwitterImageMode("url")}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      <LinkIcon className="w-3 h-3" />
                      URL
                    </Button>
                    <Button
                      type="button"
                      variant={twitterImageMode === "upload" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setTwitterImageMode("upload")}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      Upload
                    </Button>
                  </div>
                </div>

                {twitterImageMode === "url" ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        id="twitter.image"
                        value={formData.twitter.image}
                        onChange={(e) => handleChange('twitter.image', e.target.value)}
                        placeholder="https://cinematicstrategy.com/twitter-image.png"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={useProfileImage}
                        className="whitespace-nowrap"
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Use Profile Image
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">URL to an image (1200x675px recommended).</p>
                  </div>
                ) : (
                  <ImageUpload
                    label=""
                    currentImageUrl={formData.twitter.image}
                    onImageUploaded={(url) => handleChange('twitter.image', url)}
                    folder="seo"
                    description="Twitter Card Image. 1200x600px recommended."
                  />
                )}

                {formData.twitter.image && (
                  <div className="mt-2">
                    <img src={formData.twitter.image} alt="Twitter Preview" className="max-w-xs rounded border border-border/50" onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6 space-y-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Additional SEO and technical settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="robots">Robots</Label>
                <Input
                  id="robots"
                  value={formData.robots}
                  onChange={(e) => handleChange('robots', e.target.value)}
                  placeholder="index, follow"
                />
                <p className="text-xs text-muted-foreground">Options: index, noindex, follow, nofollow (comma-separated).</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonical">Canonical URL</Label>
                <Input
                  id="canonical"
                  value={formData.canonical}
                  onChange={(e) => handleChange('canonical', e.target.value)}
                  placeholder="https://cinematicstrategy.com"
                />
                <p className="text-xs text-muted-foreground">The canonical URL of your website (prevents duplicate content issues).</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="themeColor">Theme Color</Label>
                <Input
                  id="themeColor"
                  type="color"
                  value={formData.themeColor}
                  onChange={(e) => handleChange('themeColor', e.target.value)}
                  className="h-10 w-20"
                />
                <p className="text-xs text-muted-foreground">Browser theme color (affects mobile browser UI).</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isUpdating} size="lg">
          {isUpdating ? "Saving..." : "Save Meta Tags"}
        </Button>
      </div>
    </div>
  );
}







