// components/resume-upload/ResumeUploadManager.jsx
import { useState, useEffect, useMemo } from "react";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  ExternalLink,
  Download,
  Search,
  FileSpreadsheet,
  Settings2,
} from "lucide-react";
import { API_URL } from "@/lib/contant";
import * as XLSX from "xlsx";

export default function ResumeUploadManager() {
  const [resumes, setResumes] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadingJobTitles, setLoadingJobTitles] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState({ link: "", fileName: "" });
  const [exportingExcel, setExportingExcel] = useState(false);

  // Column visibility state - all visible by default
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    contact: true,
    profile: true,
    location: true,
    email: true,
    receivedDate: true,
    cvLink: true,
  });

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

  // Fetch job titles on mount
  useEffect(() => {
    const fetchJobTitles = async () => {
      setLoadingJobTitles(true);
      try {
        const res = await fetch(`${API_URL}/JobTitle`);
        const data = await res.json();

        if (data.status && Array.isArray(data.data)) {
          setJobTitles(data.data);
        } else {
          toast.error("Failed to fetch job titles");
          setJobTitles([]);
        }
      } catch (err) {
        toast.error("Failed to load job titles");
        console.error(err);
        setJobTitles([]);
      } finally {
        setLoadingJobTitles(false);
      }
    };

    fetchJobTitles();
  }, []);

  // Dynamic filtering based on search term and job title
  const filteredResumes = useMemo(() => {
    let filtered = resumes;

    // Filter by job title
    if (selectedJobTitle !== "all") {
      const jobTitleId = parseInt(selectedJobTitle);
      filtered = filtered.filter((resume) => resume.jobTitleId === jobTitleId);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((resume) => {
        return (
          (resume.name || "").toLowerCase().includes(lowerSearch) ||
          (resume.contact || "").toLowerCase().includes(lowerSearch) ||
          (resume.profile || "").toLowerCase().includes(lowerSearch) ||
          (resume.location || "").toLowerCase().includes(lowerSearch) ||
          (resume.email || "").toLowerCase().includes(lowerSearch)
        );
      });
    }

    return filtered;
  }, [resumes, searchTerm, selectedJobTitle]);

  // Get job title name by ID
  const getJobTitleName = (jobTitleId) => {
    if (!jobTitleId) return "Not Assigned";
    const jobTitle = jobTitles.find((jt) => jt.jobTitleId === jobTitleId);
    return jobTitle ? jobTitle.jobTitles : "Unknown";
  };

  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  // Export to Excel
  const handleExportToExcel = () => {
    setExportingExcel(true);
    try {
      // Prepare data for export - include ALL fields
      const exportData = filteredResumes.map((resume) => ({
        ID: resume.id,
        Name: resume.name || "",
        Contact: resume.contact || "",
        Profile: resume.profile || "",
        Location: resume.location || "",
        Email: resume.email || "",
        "CV Link": resume.cvLink || "",
        "Received Date": resume.receivedDate || "",
        "Mail Subject": resume.mailSubject || "",
        "Mail Body": resume.mailBody || "",
        "Mail From": resume.mailFrom || "",
        "File Name": resume.fileName || "",
        "File ID": resume.fileId || "",
        "Job Title ID": resume.jobTitleId || "",
        "Job Title": getJobTitleName(resume.jobTitleId),
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const columnWidths = [
        { wch: 8 },  // ID
        { wch: 25 }, // Name
        { wch: 15 }, // Contact
        { wch: 20 }, // Profile
        { wch: 30 }, // Location
        { wch: 30 }, // Email
        { wch: 60 }, // CV Link
        { wch: 15 }, // Received Date
        { wch: 40 }, // Mail Subject
        { wch: 80 }, // Mail Body
        { wch: 30 }, // Mail From
        { wch: 30 }, // File Name
        { wch: 50 }, // File ID
        { wch: 10 }, // Job Title ID
        { wch: 25 }, // Job Title
      ];
      ws['!cols'] = columnWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Resumes");

      // Generate file name with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `resumes_export_${timestamp}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);

      toast.success(`Exported ${filteredResumes.length} resumes to Excel`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export to Excel");
    } finally {
      setExportingExcel(false);
    }
  };

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
            <CardTitle className="text-2xl mb-4">All Received Resumes</CardTitle>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, contact, profile, location, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Job Title Filter */}
              <div className="w-full sm:w-64">
                <Select
                  value={selectedJobTitle}
                  onValueChange={setSelectedJobTitle}
                  disabled={loadingJobTitles}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by job title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Job Titles</SelectItem>
                    <SelectItem value="unassigned">Not Assigned</SelectItem>
                    {jobTitles.map((jobTitle) => (
                      <SelectItem
                        key={jobTitle.jobTitleId}
                        value={jobTitle.jobTitleId.toString()}
                      >
                        {jobTitle.jobTitles}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Column Visibility Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 shrink-0">
                    <Settings2 className="h-4 w-4" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.name}
                    onCheckedChange={() => toggleColumn("name")}
                  >
                    Name
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.contact}
                    onCheckedChange={() => toggleColumn("contact")}
                  >
                    Contact
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.profile}
                    onCheckedChange={() => toggleColumn("profile")}
                  >
                    Profile
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.location}
                    onCheckedChange={() => toggleColumn("location")}
                  >
                    Location
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.email}
                    onCheckedChange={() => toggleColumn("email")}
                  >
                    Email
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.receivedDate}
                    onCheckedChange={() => toggleColumn("receivedDate")}
                  >
                    Received Date
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.cvLink}
                    onCheckedChange={() => toggleColumn("cvLink")}
                  >
                    CV Link
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Export to Excel Button */}
              <Button
                variant="default"
                onClick={handleExportToExcel}
                disabled={exportingExcel || filteredResumes.length === 0}
                className="gap-2 shrink-0"
              >
                {exportingExcel ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )}
                Export
              </Button>
            </div>

            {/* Results Count */}
            {!loading && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing {filteredResumes.length} of {resumes.length} resumes
              </p>
            )}
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
                        {visibleColumns.name && <TableHead className="w-48">Name</TableHead>}
                        {visibleColumns.contact && <TableHead>Contact</TableHead>}
                        {visibleColumns.profile && <TableHead>Profile</TableHead>}
                        {visibleColumns.location && <TableHead>Location</TableHead>}
                        {visibleColumns.email && <TableHead>Email</TableHead>}
                        {visibleColumns.receivedDate && <TableHead>Received Date</TableHead>}
                        {visibleColumns.cvLink && <TableHead className="text-center">CV Link</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResumes.map((resume) => (
                        <TableRow key={resume.id}>
                          {visibleColumns.name && (
                            <TableCell className="font-medium max-w-xs truncate">
                              {resume.name || "-"}
                            </TableCell>
                          )}
                          {visibleColumns.contact && (
                            <TableCell>{resume.contact || "-"}</TableCell>
                          )}
                          {visibleColumns.profile && (
                            <TableCell className="max-w-xs truncate">
                              {resume.profile || "-"}
                            </TableCell>
                          )}
                          {visibleColumns.location && (
                            <TableCell className="max-w-xs truncate">
                              {resume.location || "-"}
                            </TableCell>
                          )}
                          {visibleColumns.email && (
                            <TableCell className="max-w-xs truncate">
                              {resume.email || "-"}
                            </TableCell>
                          )}
                          {visibleColumns.receivedDate && (
                            <TableCell>
                              {resume.receivedDate
                                ? new Date(resume.receivedDate).toLocaleDateString()
                                : "-"}
                            </TableCell>
                          )}
                          {visibleColumns.cvLink && (
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
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-16">
                {searchTerm || selectedJobTitle !== "all"
                  ? "No resumes match your filters."
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