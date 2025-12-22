// components/resume-upload/ResumeUploadManager.jsx
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Search, Upload, FileText } from "lucide-react";

const API_BASE = "https://localhost:7245/api";

export default function Resume() {
  const [activeJobs, setActiveJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fetch active job titles
  useEffect(() => {
    const fetchActiveJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/JobTitle/Active`);
        const data = await res.json();
        if (data.status) {
          setActiveJobs(data.data || []);
        } else {
          toast.error("Failed to load active job posts");
        }
      } catch (err) {
        toast.error("Network error – could not load job posts");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveJobs();
  }, []);

  // Filtered jobs based on search
  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) return activeJobs;
    return activeJobs.filter((job) =>
      job.jobTitles.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeJobs, searchTerm]);

  // Open dialog for selected job
  const openUploadDialog = (job) => {
    setSelectedJob(job);
    setSelectedFiles([]);
    setDialogOpen(true);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // Upload resumes
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one resume");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch(
        `${API_BASE}/JobTitle/upload-resumes/${selectedJob.jobTitleId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.status) {
        toast.success(`${data.totalFiles} resume(s) uploaded successfully!`);
        setDialogOpen(false);
        setSelectedFiles([]);
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Failed to upload resumes");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="space-y-8 p-6 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Upload Resumes for Job Posts</CardTitle>
            <CardDescription>
              Select an active job post and upload candidate resumes
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search job titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Scrollable Table */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin mr-3" />
                <span>Loading active job posts...</span>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="rounded-md border">
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                      <TableRow>
                        <TableHead className="w-24">ID</TableHead>
                        <TableHead>Job Title</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobs.map((job) => (
                        <TableRow key={job.jobTitleId}>
                          <TableCell className="font-mono text-sm">
                            {job.jobTitleId}
                          </TableCell>
                          <TableCell className="font-medium">
                            {job.jobTitles}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => openUploadDialog(job)}
                              className="gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              Post Resume
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                {searchTerm
                  ? "No active job posts match your search."
                  : "No active job posts available."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="inline-block sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Resumes</DialogTitle>
            <DialogDescription>
              Upload one or more resumes for:{" "}
              <strong>{selectedJob?.jobTitles || ""}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resumes">Select Resume Files</Label>
              <Input
                id="resumes"
                type="file"
                multiple
                accept=".doc,.docx,.pdf"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {selectedFiles.length} file(s) selected:
                </p>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {selectedFiles.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm bg-muted/50 px-3 py-2 rounded-md"
                    >
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-muted-foreground ml-auto">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading || selectedFiles.length === 0}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resumes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}