import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, MailOpen, Archive, RefreshCw, Reply } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export default function ContactManager() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions((data || []) as ContactSubmission[]);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      toast.error('Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const updateStatus = async (id: string, status: ContactSubmission['status']) => {
    try {
      const { error } = await ((supabase.from('contact_submissions') as any)
        .update({ status })
        .eq('id', id));

      if (error) throw error;

      setSubmissions(prev =>
        prev.map(sub => (sub.id === id ? { ...sub, status } : sub))
      );
      toast.success('Status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const replyToSubmission = (submission: ContactSubmission) => {
    const subject = `Re: ${submission.subject || 'Your contact form submission'}`;
    const body = `Hi ${submission.name},\n\nThank you for reaching out.\n\n---\nOriginal message:\n${submission.message}\n\n---\n\nBest regards`;
    
    const mailtoLink = `mailto:${submission.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Mark as replied
    if (submission.status !== 'replied') {
      updateStatus(submission.id, 'replied');
    }
    
    toast.success('Opening email client...');
  };


  const deleteSubmission = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => prev.filter(sub => sub.id !== id));
      toast.success('Submission deleted');
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-500';
      case 'read':
        return 'bg-yellow-500';
      case 'replied':
        return 'bg-green-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Submissions</h1>
          <p className="text-muted-foreground mt-2">
            Manage messages from your contact form
          </p>
        </div>
        <Button onClick={fetchSubmissions} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Mail className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No contact submissions yet
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Messages from your contact form will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{submission.name}</CardTitle>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </div>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <a
                          href={`mailto:${submission.email}`}
                          className="hover:underline"
                        >
                          {submission.email}
                        </a>
                      </div>
                      <div className="text-xs">
                        {formatDate(submission.created_at)}
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-sm mb-1">Subject</p>
                    <p className="text-sm">{submission.subject || 'No subject'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">Message</p>
                    <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4">
                    <Button
                      onClick={() => replyToSubmission(submission)}
                      variant="default"
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      Reply via Email
                    </Button>
                    <Button
                      onClick={() => updateStatus(submission.id, 'read')}
                      variant="outline"
                      size="sm"
                      disabled={submission.status === 'read' || submission.status === 'replied' || submission.status === 'archived'}
                    >
                      <MailOpen className="w-4 h-4 mr-2" />
                      Mark as Read
                    </Button>
                    <Button
                      onClick={() => updateStatus(submission.id, 'archived')}
                      variant="outline"
                      size="sm"
                      disabled={submission.status === 'archived'}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                    <div className="flex-1" />
                    <Button
                      onClick={() => setDeleteId(submission.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contact submission? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteSubmission(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
