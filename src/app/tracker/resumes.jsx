// components/resume-upload/ResumeUploadManager.jsx
import { useState, useEffect, useMemo } from "react"; // ← Added useMemo
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ← Added Input
import { toast } from "sonner";
import { Loader2, ExternalLink, Download, Search } from "lucide-react";
import { API_URL } from "@/lib/contant";


export default function ResumeUploadManager() {
  const [resumes, setResumes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ← New state for search
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState({ link: "", fileName: "" });

  // Fetch all resumes on mount
  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/JobAnalyst/get-all`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setResumes(data);
        } else {
          toast.error("Unexpected response format");
          setResumes([]);
        }
      } catch (err) {
        toast.error("Failed to load resumes");
        console.error(err);
        setResumes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  // Dynamic filtering based on search term
  const filteredResumes = useMemo(() => {
    if (!searchTerm.trim()) return resumes;

    const lowerSearch = searchTerm.toLowerCase();

    return resumes.filter((resume) => {
      return (
        (resume.name || "").toLowerCase().includes(lowerSearch) ||
        (resume.contact || "").toLowerCase().includes(lowerSearch) ||
        (resume.profile || "").toLowerCase().includes(lowerSearch) ||
        (resume.location || "").toLowerCase().includes(lowerSearch) ||
        (resume.email || "").toLowerCase().includes(lowerSearch)
      );
    });
  }, [resumes, searchTerm]);

  // Open dialog with CV details
  const openCVDialog = (cvLink, fileName) => {
    setSelectedCV({ link: cvLink, fileName });
    setDialogOpen(true);
  };

  // Preview CV in new tab
  const handlePreview = () => {
    window.open(selectedCV.link, "_blank", "noopener,noreferrer");
  };

  // Trigger download
  const handleDownload = async () => {
    try {
      const response = await fetch(selectedCV.link);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedCV.fileName || "resume.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Download started");
    } catch (err) {
      toast.error("Failed to download resume");
    }
  };

  return (
    <>
      <div className="p-6 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">All Received Resumes</CardTitle>

            {/* Search Bar */}
            <div className="relative max-w-lg mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, contact, profile, location, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin mr-3" />
                <span className="text-lg">Loading resumes...</span>
              </div>
            ) : filteredResumes.length > 0 ? (
              <div className="rounded-md border">
                <div className="max-h-screen overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                      <TableRow>
                        <TableHead className="w-48">Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Profile</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Received Date</TableHead>
                        <TableHead className="text-center">CV Link</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResumes.map((resume) => (
                        <TableRow key={resume.id}>
                          <TableCell className="font-medium max-w-xs truncate">
                            {resume.name || "-"}
                          </TableCell>
                          <TableCell>{resume.contact || "-"}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {resume.profile || "-"}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {resume.location || "-"}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {resume.email || "-"}
                          </TableCell>
                          <TableCell>
                            {resume.receivedDate
                              ? new Date(resume.receivedDate).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                openCVDialog(resume.cvLink, resume.fileName)
                              }
                              className="gap-1.5"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View CV
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-16">
                {searchTerm
                  ? "No resumes match your search."
                  : "No resumes found."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CV Preview/Download Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resume Options</DialogTitle>
            <DialogDescription>
              Choose an action for: <strong>{selectedCV.fileName || "Resume"}</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:gap-0">
            <Button variant="outline" onClick={handlePreview} className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Preview in New Tab
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}