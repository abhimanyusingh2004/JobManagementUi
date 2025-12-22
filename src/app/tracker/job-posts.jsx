// components/job-titles/JobTitleManager.jsx
import { useState, useMemo } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";

export default function JobTitleManager() {
  const [newTitle, setNewTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [jobTitles, setJobTitles] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState({
    id: null,
    currentActive: null,
    title: "",
  });

  const filteredJobTitles = useMemo(() => {
    if (!searchTerm.trim()) return jobTitles;
    return jobTitles.filter((job) =>
      job.jobTitles.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobTitles, searchTerm]);

  const fetchJobTitles = async () => {
    setLoadingFetch(true);
    try {
      const res = await fetch("https://localhost:7245/api/JobTitle");
      const data = await res.json();

      if (data.status) {
        setJobTitles(data.data || []);
        toast("Job titles refreshed successfully");
      } else {
        toast.error(data.message || "Failed to fetch job titles");
      }
    } catch (err) {
      toast.error("Network error – could not fetch job titles");
    } finally {
      setLoadingFetch(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setLoadingCreate(true);
    try {
      const res = await fetch("https://localhost:7245/api/JobTitle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitleId: 0,
          jobTitles: newTitle.trim(),
          description: "string",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (data.status) {
        toast.success(data.message || "Job title created successfully!");
        setNewTitle("");
        await fetchJobTitles(); // Refresh list
      } else {
        toast.error(data.message || "Failed to create job title");
      }
    } catch (err) {
      toast.error("Failed to create job title");
    } finally {
      setLoadingCreate(false);
    }
  };

  const openConfirmDialog = (id, currentActive, title) => {
    setPendingToggle({ id, currentActive, title });
    setConfirmDialogOpen(true);
  };

  const confirmToggle = async () => {
    const { id, currentActive, title } = pendingToggle;
    setConfirmDialogOpen(false);
    setTogglingId(id);

    try {
      const res = await fetch(
        `https://localhost:7245/api/JobTitle/${id}?isActive=${!currentActive}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (data.status) {
        toast.success(data.message || `Job title "${title}" updated`);
        setJobTitles((prev) =>
          prev.map((jt) =>
            jt.jobTitleId === id ? { ...jt, isActive: !currentActive } : jt
          )
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Failed to update job title status");
    } finally {
      setTogglingId(null);
      setPendingToggle({ id: null, currentActive: null, title: "" });
    }
  };

  return (
    <>
      <div className="space-y-8 p-6 max-w-6xl mx-auto">
        {/* Create Section */}
        <Card>
          <CardHeader>
            <CardTitle>Enter a new job title</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="e.g., Senior Developer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  disabled={loadingCreate}
                />
              </div>
              <Button type="submit" disabled={loadingCreate || !newTitle.trim()}>
                {loadingCreate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* View & Manage Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>View all roles</CardTitle>
                <CardDescription className="mt-2">
                  Press on a job title button to toggle its status.
                </CardDescription>
              </div>
              <Button onClick={fetchJobTitles} disabled={loadingFetch}>
                {loadingFetch && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get All
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search Filter */}
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
            {filteredJobTitles.length > 0 ? (
              <div className="rounded-md border">
                <div className="max-h-96 overflow-y-auto"> {/* ← This enables body-only scroll */}
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                      {" "}
                      {/* ← Header stays fixed */}
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobTitles.map((job) => (
                        <TableRow key={job.jobTitleId}>
                          <TableCell className="font-mono text-sm">
                            {job.jobTitleId}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={job.isActive ? "default" : "destructive"}
                              size="sm"
                              onClick={() =>
                                openConfirmDialog(job.jobTitleId, job.isActive, job.jobTitles)
                              }
                              disabled={togglingId !== null}
                              className={
                                job.isActive
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-red-600 hover:bg-red-700"
                              }
                            >
                              {togglingId === job.jobTitleId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                job.jobTitles
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>{job.description || "-"}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                job.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {job.isActive ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(job.updatedAt).toLocaleDateString()}
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
                  ? "No job titles match your search."
                  : "No job titles loaded yet. Click 'Get All' to fetch them."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingToggle.currentActive === false
                ? "Activate Job Title?"
                : "Deactivate Job Title?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              <strong>
                {pendingToggle.currentActive === false ? "activate" : "deactivate"}
              </strong>{" "}
              the job title "<strong>{pendingToggle.title}</strong>"?
              <br />
              {pendingToggle.currentActive === false
                ? "It will become visible to applicants."
                : "It will no longer be visible to applicants."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggle}>
              {pendingToggle.currentActive === false ? "Activate" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}