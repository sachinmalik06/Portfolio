import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Image as ImageIcon, FolderCode } from "lucide-react";
import ImageUploadWithCrop from "@/components/admin/ImageUploadWithCrop";
import { Switch } from "@/components/ui/switch";

interface SocialLink {
  label: string;
  href: string;
}

interface StatCard {
  value: string;
  description: string;
}

export default function HomePageManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Hero Section State
  const [heroData, setHeroData] = useState({
    siteName: "",
    siteDescription: "",
    profileImageUrl: "",
    socialLinks: [] as SocialLink[],
    stats: [] as StatCard[]
  });

  // About Section State
  const [aboutData, setAboutData] = useState({
    subtitle: "About Me",
    title: "Driven by ambition & global perspective",
    paragraph1: "I am an internationally oriented and ambitious postgraduate student currently pursuing an MSc in International Business Management at GISMA University of Applied Sciences, Potsdam Campus Berlin. With a solid academic background in Commerce and over 2 years of hands-on experience in management and business operations, I bring a strong understanding of global business dynamics and strategic decision-making.",
    paragraph2: "My strengths lie in business analytics, financial planning, and cross-functional leadership. I am passionate about working in multicultural environments and thrive in fast-paced, innovation-driven settings.",
    keyPoint1: "Global Perspective",
    keyPoint2: "Strategic Thinker",
    keyPoint3: "Data-Driven"
  });

  // Contact Section State
  const [contactData, setContactData] = useState({
    title: "Let's Work Together",
    subtitle: "Get in Touch",
    description: "Open to professional opportunities in international business strategy, analytics, and sustainable business development within Europe and beyond.",
    email: "sachinmalikofficial6@gmail.com",
    phone: "+49 176 2135 1793",
    location: "Berlin, Germany",
    linkedin: "https://www.linkedin.com/in/sachinmalik6"
  });

  // Projects Section State
  const [projectsData, setProjectsData] = useState({
    enabled: true,
    title: "Featured Projects",
    subtitle: "Portfolio"
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch site settings for hero
      const { data: siteSettings, error: siteError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'general')
        .single();

      if (siteError && siteError.code !== 'PGRST116') throw siteError;

      // Fetch profile card settings
      const { data: profileSettings, error: profileError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'profile_card')
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      // Fetch about settings
      const { data: aboutSettings, error: aboutError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'home_about')
        .single();

      if (aboutError && aboutError.code !== 'PGRST116') throw aboutError;

      // Fetch contact settings
      const { data: contactSettings, error: contactError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'home_contact')
        .single();

      if (contactError && contactError.code !== 'PGRST116') throw contactError;

      // Set hero data
      if (siteSettings || profileSettings) {
        const siteData = siteSettings as any;
        const profileData = profileSettings as any;
        setHeroData({
          siteName: siteData?.value?.siteName || "",
          siteDescription: siteData?.value?.siteDescription || "",
          profileImageUrl: profileData?.value?.imageUrl || "",
          socialLinks: siteData?.value?.socialLinks || [
            { label: "in", href: "https://www.linkedin.com/in/sachinmalik6" },
            { label: "✉", href: "mailto:sachinmalikofficial6@gmail.com" }
          ],
          stats: profileData?.value?.stats || [
            { value: "2+", description: "Years of hands-on experience" },
            { value: "MSc", description: "International Business Management" }
          ]
        });
      }

      // Set about data
      const aboutData = aboutSettings as any;
      if (aboutData?.value) {
        setAboutData({ ...aboutData, ...aboutData.value });
      }

      // Set contact data
      const contactDataRaw = contactSettings as any;
      if (contactDataRaw?.value) {
        setContactData({ ...contactData, ...contactDataRaw.value });
      }

      // Fetch projects settings
      const { data: projectsSettings, error: projectsError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'home_projects')
        .single();

      if (projectsError && projectsError.code !== 'PGRST116') throw projectsError;

      if (projectsSettings?.value) {
        setProjectsData(prev => ({ ...prev, ...projectsSettings.value }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveHeroSettings = async () => {
    setSaving(true);
    try {
      // Update site settings
      const { error: siteError } = await ((supabase.from('site_settings') as any)
        .upsert({
          key: 'general',
          value: {
            siteName: heroData.siteName,
            siteDescription: heroData.siteDescription,
            socialLinks: heroData.socialLinks
          }
        }, { onConflict: 'key' }));

      if (siteError) throw siteError;

      // Update profile card settings
      const { error: profileError } = await ((supabase.from('site_settings') as any)
        .upsert({
          key: 'profile_card',
          value: {
            imageUrl: heroData.profileImageUrl,
            stats: heroData.stats
          }
        }, { onConflict: 'key' }));

      if (profileError) throw profileError;

      toast.success('Hero settings saved successfully');
    } catch (error) {
      console.error('Error saving hero settings:', error);
      toast.error('Failed to save hero settings');
    } finally {
      setSaving(false);
    }
  };

  const saveAboutSettings = async () => {
    setSaving(true);
    try {
      const { error } = await ((supabase.from('site_settings') as any)
        .upsert({
          key: 'home_about',
          value: aboutData
        }, { onConflict: 'key' }));

      if (error) throw error;

      toast.success('About section saved successfully');
    } catch (error) {
      console.error('Error saving about settings:', error);
      toast.error('Failed to save about settings');
    } finally {
      setSaving(false);
    }
  };

  const saveContactSettings = async () => {
    setSaving(true);
    try {
      const { error } = await ((supabase.from('site_settings') as any)
        .upsert({
          key: 'home_contact',
          value: contactData
        }, { onConflict: 'key' }));

      if (error) throw error;

      toast.success('Contact section saved successfully');
    } catch (error) {
      console.error('Error saving contact settings:', error);
      toast.error('Failed to save contact settings');
    } finally {
      setSaving(false);
    }
  };

  const saveProjectsSettings = async () => {
    setSaving(true);
    try {
      const { error } = await ((supabase.from('site_settings') as any)
        .upsert({
          key: 'home_projects',
          value: projectsData
        }, { onConflict: 'key' }));

      if (error) throw error;

      toast.success('Projects section settings saved successfully');
    } catch (error) {
      console.error('Error saving projects settings:', error);
      toast.error('Failed to save projects settings');
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = () => {
    setHeroData({
      ...heroData,
      socialLinks: [...heroData.socialLinks, { label: "", href: "" }]
    });
  };

  const removeSocialLink = (index: number) => {
    setHeroData({
      ...heroData,
      socialLinks: heroData.socialLinks.filter((_, i) => i !== index)
    });
  };

  const updateSocialLink = (index: number, field: 'label' | 'href', value: string) => {
    const updated = [...heroData.socialLinks];
    updated[index][field] = value;
    setHeroData({ ...heroData, socialLinks: updated });
  };

  const addStat = () => {
    setHeroData({
      ...heroData,
      stats: [...heroData.stats, { value: "", description: "" }]
    });
  };

  const removeStat = (index: number) => {
    setHeroData({
      ...heroData,
      stats: heroData.stats.filter((_, i) => i !== index)
    });
  };

  const updateStat = (index: number, field: 'value' | 'description', value: string) => {
    const updated = [...heroData.stats];
    updated[index][field] = value;
    setHeroData({ ...heroData, stats: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Home Page Settings</h1>
        <p className="text-muted-foreground">Manage all content on your home page</p>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About Section</TabsTrigger>
          <TabsTrigger value="projects">Projects Section</TabsTrigger>
          <TabsTrigger value="contact">Contact Section</TabsTrigger>
        </TabsList>

        {/* Hero Section Tab */}
        <TabsContent value="hero" className="space-y-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main landing section of your home page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Your Name</Label>
                <Input
                  value={heroData.siteName}
                  onChange={(e) => setHeroData({ ...heroData, siteName: e.target.value })}
                  placeholder="John Doe"
                />
                <p className="text-xs text-muted-foreground">Displayed as the main title</p>
              </div>

              <div className="space-y-2">
                <Label>Description / Tagline</Label>
                <Textarea
                  value={heroData.siteDescription}
                  onChange={(e) => setHeroData({ ...heroData, siteDescription: e.target.value })}
                  placeholder="Your professional description..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Profile Image</Label>
                <ImageUploadWithCrop
                  currentImageUrl={heroData.profileImageUrl}
                  onImageUploaded={async (url) => {
                    setHeroData({ ...heroData, profileImageUrl: url });
                    try {
                      await ((supabase.from('site_settings') as any)
                        .upsert({
                          key: 'profile_card',
                          value: {
                            imageUrl: url,
                            stats: heroData.stats
                          }
                        }, { onConflict: 'key' }));
                      toast.success("Hero profile image updated!");
                    } catch (error: any) {
                      toast.error(error?.message || "Failed to update image");
                    }
                  }}
                  bucket="images"
                  folder="hero"
                  label="Hero Profile Image"
                  description="PNG, JPG, WEBP up to 5MB. This image appears in the hero section."
                  aspectRatio={3 / 4}
                  cropShape="rect"
                />
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-2">
                  <p className="text-sm text-blue-200">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Images are uploaded to Supabase Storage for instant loading.
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Social Links</Label>
                  <Button onClick={addSocialLink} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>
                {heroData.socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Label (e.g., 'in' for LinkedIn)"
                      value={link.label}
                      onChange={(e) => updateSocialLink(index, 'label', e.target.value)}
                      className="w-24"
                    />
                    <Input
                      placeholder="URL"
                      value={link.href}
                      onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                    />
                    <Button
                      onClick={() => removeSocialLink(index)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Stats Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Statistics Cards</Label>
                  <Button onClick={addStat} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Stat
                  </Button>
                </div>
                {heroData.stats.map((stat, index) => (
                  <div key={index} className="space-y-2 p-4 border border-white/5 rounded-lg">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Value (e.g., '2+', 'MSc')"
                        value={stat.value}
                        onChange={(e) => updateStat(index, 'value', e.target.value)}
                        className="w-32"
                      />
                      <Button
                        onClick={() => removeStat(index)}
                        variant="destructive"
                        size="icon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Description"
                      value={stat.description}
                      onChange={(e) => updateStat(index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              <Button onClick={saveHeroSettings} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save Hero Section"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>About me content on home page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Subtitle (Small Text Above Title)</Label>
                <Input
                  value={aboutData.subtitle}
                  onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
                  placeholder="About Me"
                />
              </div>

              <div className="space-y-2">
                <Label>Main Title</Label>
                <Input
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  placeholder="Driven by ambition & global perspective"
                />
              </div>

              <div className="space-y-2">
                <Label>First Paragraph</Label>
                <Textarea
                  value={aboutData.paragraph1}
                  onChange={(e) => setAboutData({ ...aboutData, paragraph1: e.target.value })}
                  placeholder="Your introduction..."
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Second Paragraph (Optional)</Label>
                <Textarea
                  value={aboutData.paragraph2}
                  onChange={(e) => setAboutData({ ...aboutData, paragraph2: e.target.value })}
                  placeholder="Additional information..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Key Point 1</Label>
                  <Input
                    value={aboutData.keyPoint1}
                    onChange={(e) => setAboutData({ ...aboutData, keyPoint1: e.target.value })}
                    placeholder="Global Perspective"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Key Point 2</Label>
                  <Input
                    value={aboutData.keyPoint2}
                    onChange={(e) => setAboutData({ ...aboutData, keyPoint2: e.target.value })}
                    placeholder="Strategic Thinker"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Key Point 3</Label>
                  <Input
                    value={aboutData.keyPoint3}
                    onChange={(e) => setAboutData({ ...aboutData, keyPoint3: e.target.value })}
                    placeholder="Data-Driven"
                  />
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  <strong>Note:</strong> Work experience and education timeline are managed separately in the "Timeline" section of Pages.
                </p>
              </div>

              <Button onClick={saveAboutSettings} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save About Section"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Section Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle>Projects Section</CardTitle>
              <CardDescription>Configure how projects appear on your home page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-white/5 rounded-lg bg-background/50">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Projects Gallery</Label>
                  <p className="text-sm text-muted-foreground">
                    Show or hide the "Featured Projects" section on the home page.
                  </p>
                </div>
                <Switch
                  checked={projectsData.enabled}
                  onCheckedChange={(checked) => setProjectsData({ ...projectsData, enabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={projectsData.title}
                  onChange={(e) => setProjectsData({ ...projectsData, title: e.target.value })}
                  placeholder="Featured Projects"
                  disabled={!projectsData.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label>Section Subtitle</Label>
                <Input
                  value={projectsData.subtitle}
                  onChange={(e) => setProjectsData({ ...projectsData, subtitle: e.target.value })}
                  placeholder="Portfolio"
                  disabled={!projectsData.enabled}
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  <FolderCode className="w-4 h-4 inline mr-2" />
                  Individual projects are managed in the <strong>Gallery</strong> section.
                </p>
              </div>

              <Button onClick={saveProjectsSettings} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save Projects Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Section Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle>Contact Section</CardTitle>
              <CardDescription>Contact information displayed on home page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={contactData.title}
                  onChange={(e) => setContactData({ ...contactData, title: e.target.value })}
                  placeholder="Let's Work Together"
                />
              </div>

              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={contactData.subtitle}
                  onChange={(e) => setContactData({ ...contactData, subtitle: e.target.value })}
                  placeholder="Get in Touch"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={contactData.description}
                  onChange={(e) => setContactData({ ...contactData, description: e.target.value })}
                  placeholder="Brief description for the contact section..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    placeholder="+49 123 456 7890"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={contactData.location}
                    onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                    placeholder="Berlin, Germany"
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input
                    value={contactData.linkedin}
                    onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })}
                    placeholder="https://www.linkedin.com/in/..."
                  />
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  <strong>Note:</strong> The contact form submissions are managed in the "Contact Submissions" section.
                </p>
              </div>

              <Button onClick={saveContactSettings} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save Contact Section"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
