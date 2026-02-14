import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Mail, Lock, Eye, EyeOff, Image as ImageIcon, Link as LinkIcon, Upload } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { useAuth } from "@/components/providers/SupabaseAuthProvider";
import { supabase } from "@/lib/supabase";
import { useProfileCardSettings, useUpdateProfileCardSettings, useLogoSettings, useUpdateLogoSettings } from "@/hooks/use-cms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { convertDriveUrlToDirectImageUrl } from "@/lib/image-utils";
import ImageUploadWithCrop from "@/components/admin/ImageUploadWithCrop";

export default function Settings() {
  const { user, profile, signOut } = useAuth();

  const [credentials, setCredentials] = useState({
    newName: "",
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "card" | "logo">("profile");

  // Profile card settings
  const { data: profileCardSettings, isLoading: loadingCardSettings } = useProfileCardSettings();
  const { mutate: updateProfileCard, isLoading: isUpdatingCard } = useUpdateProfileCardSettings();
  const [cardImageUrl, setCardImageUrl] = useState("");

  // Logo settings
  const { data: logoSettings, isLoading: loadingLogoSettings } = useLogoSettings();
  const { mutate: updateLogo, isLoading: isUpdatingLogo } = useUpdateLogoSettings();
  const [logoUrl, setLogoUrl] = useState("");
  const [logoText, setLogoText] = useState("CS");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [logoMode, setLogoMode] = useState<"url" | "upload">("url");
  const [faviconMode, setFaviconMode] = useState<"url" | "upload">("url");

  // Initialize form when settings load
  useEffect(() => {
    if (profileCardSettings) {
      setCardImageUrl(profileCardSettings.cardImageUrl || "");
    }
  }, [profileCardSettings]);

  // Initialize logo form when settings load
  useEffect(() => {
    if (logoSettings) {
      setLogoUrl(logoSettings.logoUrl || "");
      setLogoText(logoSettings.logoText || "CS");
      setFaviconUrl(logoSettings.faviconUrl || "");
      setLogoMode("url");
      setFaviconMode("url");
    }
  }, [logoSettings]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updates: any = {};

      // Update name if changed
      if (credentials.newName && credentials.newName !== profile?.name) {
        updates.name = credentials.newName;
      }

      // Update email if changed
      if (credentials.newEmail && credentials.newEmail.toLowerCase() !== user?.email?.toLowerCase()) {
        const newEmail = credentials.newEmail.toLowerCase();

        // Check if email is already taken in public.users
        const { data: existingUser, error: checkError } = await (supabase
          .from('users') as any)
          .select('id')
          .eq('email', newEmail)
          .maybeSingle();


        if (checkError) {
          console.error("Error checking email availability:", checkError);
          throw new Error("Could not verify email availability. Please try again.");
        }

        if (existingUser && existingUser.id !== user?.id) {
          throw new Error("This email is already in use by another account.");
        }

        // Email will be synced to auth.users via database trigger
        updates.email = newEmail;
      }

      // Update profile in public.users table
      if (Object.keys(updates).length > 0) {
        if (!user?.id) throw new Error("User session expired. Please log in again.");

        const { error: updateError } = await (supabase
          .from('users') as any)
          .update(updates)
          .eq('id', user.id);

        if (updateError) {
          console.error("Profile update error details:", updateError);
          // provide specifically helpful feedback for database errors
          const dbError = updateError as any;
          if (dbError.code === '23505') {
            throw new Error("This email address is already registered to another account.");
          }
          if (dbError.message) {
            throw new Error(`Database error: ${dbError.message} (${dbError.code || 'unknown'})`);
          }
          throw updateError;
        }
      }

      if (Object.keys(updates).length === 0) {
        toast.info("No changes to save");
        setIsUpdating(false);
        return;
      }

      toast.success("Profile updated successfully!");

      // Reset form
      setCredentials({
        ...credentials,
        newName: "",
        newEmail: "",
      });

      // If email was changed, sign out immediately to require re-authentication
      if (updates.email) {
        try {
          // Clear credentials before signout
          setCredentials({
            newName: "",
            newEmail: "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });

          await signOut();
          toast.success("Profile updated successfully!");
        } catch (err) {
          console.error("Sign out after email update failed:", err);
          // Fallback redirect if signOut doesn't handle it
          window.location.href = "/auth";
        }
      } else {
        // Reload to get updated profile if only name was changed
        window.location.reload();
      }


    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Validate and trim passwords
      const currentPassword = credentials.currentPassword.trim();
      const newPassword = credentials.newPassword.trim();
      const confirmPassword = credentials.confirmPassword.trim();

      if (!currentPassword) {
        throw new Error("Current password is required");
      }

      if (!newPassword || newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match");
      }

      if (currentPassword === newPassword) {
        throw new Error("New password must be different from current password");
      }

      // Verify current password by attempting to sign in
      if (user?.email) {
        console.log("Verifying password for email:", user.email);
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

        if (verifyError) {
          console.error("Verification failed:", verifyError.message);
          throw new Error(`Current password is incorrect. (Supabase: ${verifyError.message})`);
        }
        console.log("Verification successful");
      } else {
        throw new Error("User email not found. Please reload the page.");
      }

      // Update password in Supabase Auth
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (passwordError) {
        throw passwordError;
      }

      // Update password in public.users for administrative recovery
      if (user?.id) {
        const { error: publicUpdateError } = await (supabase as any)
          .from('users')
          .update({ password: newPassword })
          .eq('id', user.id);

        if (publicUpdateError) {
          console.warn("Could not sync password to public profile:", publicUpdateError);
          // We don't throw here to avoid confusing the user, as the Auth password WAS updated
        }
      }

      toast.success("Password updated successfully!");

      // Force a session refresh to be safe
      await supabase.auth.getSession();

      // Reset form
      setCredentials({
        ...credentials,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to update password");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileCard({
        cardImageUrl: cardImageUrl.trim()
      });
      toast.success("Profile card images updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile card");
    }
  };

  const handleUpdateLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateLogo({
        logoUrl: logoUrl.trim(),
        logoText: logoText.trim() || "CS",
        faviconUrl: faviconUrl.trim()
      });
      toast.success("Logo settings updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update logo settings");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your admin account credentials and security.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="bg-card/50 border border-white/5 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="card">Profile Card</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="max-w-2xl">
          {/* Profile Settings */}
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your name and email address. Email changes are immediate and do not require confirmation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <Label>Current Email</Label>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/5">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{user?.email || profile?.email || "Loading..."}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Current Name</Label>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/5">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{profile?.name || "Not set"}</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>New Name</Label>
                    <Input
                      value={credentials.newName}
                      onChange={(e) => setCredentials({ ...credentials, newName: e.target.value })}
                      placeholder={profile?.name || "Enter new name"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>New Email</Label>
                    <Input
                      type="email"
                      value={credentials.newEmail}
                      onChange={(e) => setCredentials({ ...credentials, newEmail: e.target.value })}
                      placeholder={user?.email || "Enter new email"}
                    />
                    <p className="text-xs text-muted-foreground">
                      Email changes take effect immediately. No confirmation email needed.
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

        </TabsContent>

        <TabsContent value="password" className="max-w-2xl">
          {/* Password Settings */}
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={credentials.currentPassword}
                      onChange={(e) => setCredentials({ ...credentials, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={credentials.newPassword}
                      onChange={(e) => setCredentials({ ...credentials, newPassword: e.target.value })}
                      placeholder="Enter new password (min. 6 characters)"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters long.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={credentials.confirmPassword}
                      onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-200">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Make sure your new password is strong and unique. You'll stay logged in after changing it.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

        </TabsContent>

        <TabsContent value="card" className="max-w-2xl">
          {/* Profile Card Image Settings */}
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Hero Section Image
              </CardTitle>
              <CardDescription>
                Upload the image that appears in the hero section of your home page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ImageUploadWithCrop
                  currentImageUrl={cardImageUrl}
                  onImageUploaded={async (url) => {
                    setCardImageUrl(url);
                    try {
                      await updateProfileCard({ cardImageUrl: url });
                      toast.success("Hero image updated! Refreshing page...");
                      setTimeout(() => window.location.reload(), 1500);
                    } catch (error: any) {
                      toast.error(error?.message || "Failed to update image");
                    }
                  }}
                  bucket="images"
                  folder="hero"
                  label="Hero Profile Image"
                  description="PNG, JPG, WEBP up to 5MB. Optimized for instant loading."
                  aspectRatio={3 / 4}
                  cropShape="rect"
                />

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-200">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Images are uploaded to Supabase Storage for instant loading. No more delays!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo" className="max-w-2xl">
          {/* Logo Settings */}
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Logo Settings
              </CardTitle>
              <CardDescription>
                Manage your website logo, logo text fallback, and favicon. These appear throughout the site including footer, admin panel, and auth page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateLogo} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="logoUrl">Logo Image URL</Label>
                    <div className="flex gap-2 bg-muted/50 p-1 rounded-lg">
                      <Button
                        type="button"
                        variant={logoMode === "url" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setLogoMode("url")}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        <LinkIcon className="w-3 h-3" />
                        URL
                      </Button>
                      <Button
                        type="button"
                        variant={logoMode === "upload" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setLogoMode("upload")}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        Upload
                      </Button>
                    </div>
                  </div>

                  {logoMode === "url" ? (
                    <div className="space-y-2">
                      <Input
                        id="logoUrl"
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.svg"
                      />
                      <p className="text-xs text-muted-foreground">
                        URL to your logo image (SVG, PNG, or JPG).
                      </p>
                    </div>
                  ) : (
                    <ImageUpload
                      label=""
                      currentImageUrl={logoUrl}
                      onImageUploaded={setLogoUrl}
                      folder="settings"
                      description="Logo image. PNG, WEBP, or SVG."
                    />
                  )}

                  {logoUrl && (
                    <div className="mt-2 p-4 border border-white/10 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                          <img
                            src={convertDriveUrlToDirectImageUrl(logoUrl)}
                            alt="Logo preview"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="hidden h-full w-full bg-primary rounded-lg items-center justify-center text-white font-bold text-sm">
                            {logoText || "CS"}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">Logo size: 40x40px</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoText">Logo Text (Fallback)</Label>
                  <Input
                    id="logoText"
                    type="text"
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                    placeholder="CS"
                    maxLength={10}
                  />
                  <p className="text-xs text-muted-foreground">
                    Text to display if the logo image fails to load or is not provided. This appears in a colored box as a fallback (e.g., "CS", "Logo").
                  </p>
                  {logoText && (
                    <div className="mt-2 p-4 border border-white/10 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground mb-2">Text Fallback Preview:</p>
                      <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                        {logoText}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="faviconUrl">Favicon URL (Optional)</Label>
                    <div className="flex gap-2 bg-muted/50 p-1 rounded-lg">
                      <Button
                        type="button"
                        variant={faviconMode === "url" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFaviconMode("url")}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        <LinkIcon className="w-3 h-3" />
                        URL
                      </Button>
                      <Button
                        type="button"
                        variant={faviconMode === "upload" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFaviconMode("upload")}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        Upload
                      </Button>
                    </div>
                  </div>

                  {faviconMode === "url" ? (
                    <div className="space-y-2">
                      <Input
                        id="faviconUrl"
                        type="url"
                        value={faviconUrl}
                        onChange={(e) => setFaviconUrl(e.target.value)}
                        placeholder="https://example.com/favicon.ico"
                      />
                      <p className="text-xs text-muted-foreground">
                        URL to your favicon icon.
                      </p>
                    </div>
                  ) : (
                    <ImageUpload
                      label=""
                      currentImageUrl={faviconUrl}
                      onImageUploaded={setFaviconUrl}
                      folder="settings"
                      description="Favicon. ICO or PNG recommended."
                    />
                  )}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-200">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    <strong>Where logos appear:</strong> Footer, Navigation, Admin Panel header, Auth/Login page, Logo Dropdown menu. If no logo URL is provided, the logo text will be displayed in a colored box.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isUpdatingLogo || loadingLogoSettings}>
                  {isUpdatingLogo ? "Updating..." : loadingLogoSettings ? "Loading..." : "Update Logo Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
