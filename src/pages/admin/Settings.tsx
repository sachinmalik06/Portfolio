import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Mail, Lock, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/components/providers/SupabaseAuthProvider";
import { supabase } from "@/lib/supabase";
import { useProfileCardSettings, useUpdateProfileCardSettings } from "@/hooks/use-cms";

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
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "card">("profile");
  
  // Profile card settings
  const { data: profileCardSettings, isLoading: loadingCardSettings } = useProfileCardSettings();
  const { mutate: updateProfileCard, isLoading: isUpdatingCard } = useUpdateProfileCardSettings();
  const [cardImageUrl, setCardImageUrl] = useState("");
  
  // Initialize form when settings load
  useEffect(() => {
    if (profileCardSettings) {
      setCardImageUrl(profileCardSettings.cardImageUrl || "");
    }
  }, [profileCardSettings]);

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
      if (credentials.newEmail && credentials.newEmail !== user?.email) {
        // Check if email is already taken
        const { data: existingUser } = await (supabase
          .from('users')
          .select('id')
          .eq('email', credentials.newEmail.toLowerCase())
          .single() as any);

        if (existingUser && (existingUser as any).id !== user?.id) {
          throw new Error("Email already in use");
        }

        // Update email in Supabase Auth
        const { error: emailError } = await supabase.auth.updateUser({
          email: credentials.newEmail.toLowerCase(),
        });

        if (emailError) throw emailError;
        
        updates.email = credentials.newEmail.toLowerCase();
        toast.info("Email update requested. Please check your email to confirm the change.");
      }

      // Update profile in public.users table
      if (Object.keys(updates).length > 0 && user?.id) {
        const result = await ((supabase.from('users') as any)
          .update(updates)
          .eq('id', user.id));

        if (result.error) throw result.error;
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

      // If email was changed, sign out to require re-authentication
      if (updates.email) {
        setTimeout(async () => {
          await signOut();
          window.location.href = "/auth";
        }, 2000);
      } else {
        // Reload to get updated profile
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
      // Validate passwords
      if (!credentials.currentPassword) {
        throw new Error("Current password is required");
      }

      if (!credentials.newPassword || credentials.newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters");
      }

      if (credentials.newPassword !== credentials.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      if (credentials.currentPassword === credentials.newPassword) {
        throw new Error("New password must be different from current password");
      }

      // Verify current password by attempting to sign in
      if (user?.email) {
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: credentials.currentPassword,
        });

        if (verifyError) {
          throw new Error("Current password is incorrect");
        }
      }

      // Update password in Supabase Auth
      const { error: passwordError } = await supabase.auth.updateUser({
        password: credentials.newPassword,
      });

      if (passwordError) {
        throw passwordError;
      }

      toast.success("Password updated successfully!");
      
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your admin account credentials and security.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Settings */}
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your name and email address. You'll need to verify email changes.
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
                    onChange={(e) => setCredentials({...credentials, newName: e.target.value})}
                    placeholder={profile?.name || "Enter new name"}
                  />
                </div>

                <div className="space-y-2">
                  <Label>New Email</Label>
                  <Input 
                    type="email"
                    value={credentials.newEmail}
                    onChange={(e) => setCredentials({...credentials, newEmail: e.target.value})}
                    placeholder={user?.email || "Enter new email"}
                  />
                  <p className="text-xs text-muted-foreground">
                    You'll receive a confirmation email to verify the new address.
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

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
                    onChange={(e) => setCredentials({...credentials, currentPassword: e.target.value})}
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
                    onChange={(e) => setCredentials({...credentials, newPassword: e.target.value})}
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
                    onChange={(e) => setCredentials({...credentials, confirmPassword: e.target.value})}
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

        {/* Profile Card Image Settings */}
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Profile Card Image
            </CardTitle>
            <CardDescription>
              Update the profile card image displayed on the About page. You can use image URLs or upload to Supabase Storage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateCard} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cardImageUrl">Card Image URL</Label>
                <Input 
                  id="cardImageUrl"
                  type="url"
                  value={cardImageUrl}
                  onChange={(e) => setCardImageUrl(e.target.value)}
                  placeholder="https://example.com/card-image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  URL to the image that will be displayed on the 3D card. Leave empty to use default.
                </p>
                {cardImageUrl && (
                  <div className="mt-2 p-2 border border-white/10 rounded-lg">
                    <img 
                      src={cardImageUrl} 
                      alt="Card preview" 
                      className="max-w-full h-32 object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>


              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  <ImageIcon className="w-4 h-4 inline mr-2" />
                  Tip: You can upload images to Supabase Storage and use the public URL here, or use any publicly accessible image URL.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isUpdatingCard}>
                {isUpdatingCard ? "Updating..." : "Update Profile Card Images"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
