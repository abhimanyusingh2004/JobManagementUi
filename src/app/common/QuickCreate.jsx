import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { API_URL } from "@/lib/contant";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import SearchableDropdown from "@/components/ui/searchable-dropdown";
import { ScrollArea } from "@/components/ui/scroll-area";

function QuickCreate({ open, onOpenChange }) {
  const userDetails = useSelector((state) => state.user.userDetails || {});
  const [issue, setIssue] = useState("");
  const [companyCode, setCompanyCode] = useState([]);
  const [selectedCompanyCode, setSelectedCompanyCode] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [severity, setSeverity] = useState("");

  const categories = [
    { value: "Routing", label: "Routing" },
    { value: "Testing", label: "Testing" },
    { value: "Whitelisting", label: "Whitelisting" },
    { value: "Others", label: "Others" },
  ];

  const severityLevels = [
    { value: " ", label: "None" },
    { value: "Minor", label: "Minor" },
    { value: "Major", label: "Major" },
    { value: "Critical", label: "Critical" },
  ];

  const priorityLevels = [
    { value: " ", label: "None" },
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Urgent", label: "Urgent" },
  ];

  useEffect(() => {
    const fetchClientsAndVendors = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch clients
        const clientResponse = await fetch(`${API_URL}/CompaniesAmMapping/clients`, {
          method: "GET",
          headers: {
            accept: "text/plain",
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch vendors
        const vendorResponse = await fetch(`${API_URL}/CompaniesAmMapping/vendors`, {
          method: "GET",
          headers: {
            accept: "text/plain",
            Authorization: `Bearer ${token}`,
          },
        });

        if (clientResponse.ok && vendorResponse.ok) {
          const clients = await clientResponse.json();
          const vendors = await vendorResponse.json();

          // Combine and deduplicate company codes
          const combinedCompanies = [
            ...clients.map(client => ({ value: client.companyCode, label: client.companyCode })),
            ...vendors.map(vendor => ({ value: vendor.companyCode, label: vendor.companyCode }))
          ];

          // Remove duplicates based on value
          const uniqueCompanies = Array.from(
            new Map(combinedCompanies.map(item => [item.value, item])).values()
          );

          setCompanyCode(uniqueCompanies);
        } else {
          // toast.error("Failed to fetch companies.", { position: "top-right" });
        }
      } catch (error) {
        // toast.error("An error occurred while fetching companies.", { position: "top-right" });
      }
    };

    fetchClientsAndVendors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!selectedCompanyCode) {
      toast.error("Company is required.", { position: "top-right" });
      return;
    }
    if (!category) {
      toast.error("Category is required.", { position: "top-right" });
      return;
    }
    if (!issue.trim()) {
      toast.error("Issue Description is required.", { position: "top-right" });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/ticket/create`, {
        method: "POST",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyCode: selectedCompanyCode,
          category,
          description: issue,
          severity,
          tat: 0,
          priority,
          source: "Panel",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message, { position: "top-right" });
        // Clear form fields
        setIssue("");
        setSelectedCompanyCode("");
        setCategory("");
        setPriority("");
        setSeverity("");
        onOpenChange(false);
      } else {
        toast.error("Failed to create ticket.", { position: "top-right" });
      }
    } catch (error) {
      toast.error("An error occurred while creating the ticket.", { position: "top-right" });
    }
  };

  const handleCancel = () => {
    setIssue("");
    setSelectedCompanyCode("");
    setCategory("");
    setPriority("");
    setSeverity("");
    onOpenChange(false);
  };

  // Check if required fields are filled to enable/disable the Create button
  const isFormValid = selectedCompanyCode && category && issue.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Quick Create Issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-[65svh] pr-3">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="company">
                  Company <span className="text-red-500">*</span>
                </Label>
                <SearchableDropdown
                  id="company"
                  label="Company"
                  items={companyCode}
                  selectedValue={selectedCompanyCode}
                  placeholder="Select Company"
                  onValueChange={setSelectedCompanyCode}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={setCategory} value={category} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="severity">Severity Level</Label>
                <Select onValueChange={setSeverity} value={severity}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select onValueChange={setPriority} value={priority}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="issue">
                  Issue Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="issue"
                  placeholder="Describe the issue"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default QuickCreate;