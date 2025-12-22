import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Camera,
  Calendar,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import AvatarSelector from "@/components/account/AvatarSelector";
import ProfileCompletionCircle from "@/components/account/ProfileCompletionCircle";
import { setUser } from "@/store/userSlice";
import {
  IconUserCircle,
  IconMail,
  IconShieldLock,
  IconLockPassword,
  IconPencilCog,
  IconBrandTeams,
  IconEdit,
} from "@tabler/icons-react";
import { API_URL } from "@/lib/contant";
import { format } from "date-fns";

const Account = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user);

  const [profile, setProfile] = useState({
    avatar: "../images/avatars/1.png",
    name: "",
    email: "",
    joinDate: "",
    title: "",
    teamsId: "",
  });

  const [editForm, setEditForm] = useState({
    avatar: "../images/avatars/1.png",
    name: "",
    email: "",
    joinDate: "",
    title: "",
    teamsId: "",
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Dialog & Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isTeamsDialog, setIsTeamsDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPasswordConfirmDialog, setShowPasswordConfirmDialog] = useState(false);
  const [showTeamsConfirmDialog, setShowTeamsConfirmDialog] = useState(false);

  // === PASSWORD CHANGE - MAIN FLOW ===
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  // === FORGOT PASSWORD FLOW ===
  const [showForgotFlow, setShowForgotFlow] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [finalNewPassword, setFinalNewPassword] = useState("");
  const [finalConfirmPassword, setFinalConfirmPassword] = useState("");
  const [showFinalNewPassword, setShowFinalNewPassword] = useState(false);
  const [showFinalConfirmPassword, setShowFinalConfirmPassword] = useState(false);
  const [finalNewPasswordError, setFinalNewPasswordError] = useState("");
  const [finalConfirmPasswordError, setFinalConfirmPasswordError] = useState("");

  const [loading, setLoading] = useState(false);

  // Teams ID
  const [newTeamsId, setNewTeamsId] = useState("");
  const [teamsIdError, setTeamsIdError] = useState("");

  // Calculate Profile Completion
  const calculateCompletion = () => {
    const hasName =
      profile.name && profile.name.trim() && profile.name !== "Unknown User";
    const hasValidEmail =
      profile.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email);
    const hasTitle = !!profile.title;
    const hasTeamsId = !!profile.teamsId;
    const hasCustomAvatar = profile.avatar && !profile.avatar.includes("1.png");

    const filled = [
      hasName,
      hasValidEmail,
      hasTitle,
      hasTeamsId,
      hasCustomAvatar,
    ].filter(Boolean).length;
    return Math.round((filled / 5) * 100);
  };

  // Fetch User Details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_URL}/User/GetUserDetails`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user details");

        const data = await response.json();

        dispatch(
          setUser({
            userName: data.name || "Unknown User",
            email: data.email || "",
            role: data.role || "",
            lastLogin: data.lastLogin || null,
            activeState: data.activeState ?? true,
          })
        );

        const updatedProfile = {
          avatar: data.imagePath || "../images/avatars/1.png",
          name: data.name || "Unknown User",
          email: data.email || "",
          joinDate: data.createdAt || new Date().toISOString(),
          title: data.role || "",
          teamsId: data.teamsId || "",
        };

        setProfile(updatedProfile);
        setEditForm(updatedProfile);
        setForgotEmail(data.email || "");
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchUserDetails();
  }, [dispatch]);

  // Sync with Redux
  useEffect(() => {
    if (userDetails?.userName) {
      const syncedProfile = {
        avatar: profile.avatar,
        name: userDetails.userName || "Unknown User",
        email: userDetails.email || "",
        joinDate: profile.joinDate,
        title: userDetails.role || "",
        teamsId: profile.teamsId,
      };
      setProfile(syncedProfile);
      setEditForm(syncedProfile);
      setForgotEmail(userDetails.email || "");
    }
  }, [userDetails]);

  // Update completion percentage
  useEffect(() => {
    setCompletionPercentage(calculateCompletion());
  }, [profile]);

  // Handlers
  const handleAvatarSelect = (avatar) => {
    setEditForm((prev) => ({ ...prev, avatar }));
    setShowAvatarSelector(false);
    toast.success("Avatar updated");
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/User/UpdateProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          imagePath: editForm.avatar,
        }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setProfile(editForm);
      dispatch(
        setUser({
          userName: editForm.name,
          email: editForm.email,
        })
      );
      setIsEditing(false);
      setShowConfirmDialog(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  // === MAIN PASSWORD CHANGE ===
  const handleMainPasswordConfirm = () => {
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmNewPasswordError("");

    if (!oldPassword) return setOldPasswordError("Old password is required");
    if (newPassword.length < 6)
      return setNewPasswordError("Password must be at least 6 characters");
    if (newPassword !== confirmNewPassword)
      return setConfirmNewPasswordError("Passwords do not match");

    setShowPasswordConfirmDialog(true);
  };

  const handleMainPasswordChange = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/User/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: profile.email,
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");

      toast.success("Password changed successfully");
      closePasswordDialog();
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // === SEND OTP ===
  const handleSendOtp = async () => {
    setForgotEmailError("");
    if (
      !forgotEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)
    ) {
      return setForgotEmailError("Enter a valid email");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/User/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(forgotEmail),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      toast.success("OTP sent to your email");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // === VERIFY OTP (sends dummy password — only OTP + email matter) ===
 const handleVerifyOtp = async () => {
  setOtpError("");
  if (otp.length !== 6 || !/^\d+$/.test(otp)) {
    return setOtpError("Enter a valid 6-digit OTP");
  }

  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/User/reset-password-with-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: forgotEmail,
        otp,
        newPassword: "temp123", // dummy password — backend ignores it
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid OTP");

    toast.success("OTP verified successfully");
    setOtpVerified(true); // Now real!
  } catch (err) {
    toast.error(err.message || "OTP verification failed");
    setOtpError(err.message);
  } finally {
    setLoading(false);
  }
};

 
 const handleFinalSubmit = async () => {
  setFinalNewPasswordError("");
  setFinalConfirmPasswordError("");

  if (finalNewPassword.length < 6)
    return setFinalNewPasswordError("Password must be at least 6 characters");
  if (finalNewPassword !== finalConfirmPassword)
    return setFinalConfirmPasswordError("Passwords do not match");

  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/User/reset-password-with-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: forgotEmail,
        otp,
        newPassword: finalNewPassword, // REAL password
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update password");

    toast.success("Password updated successfully");
    closePasswordDialog();
  } catch (err) {
    toast.error(err.message || "Failed to update password");
  } finally {
    setLoading(false);
  }
};
  // === CLOSE & RESET ALL ===
  const closePasswordDialog = () => {
    setShowPasswordDialog(false);
    setShowPasswordConfirmDialog(false);
    setShowForgotFlow(false);
    setOtpSent(false);
    setOtpVerified(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setOtp("");
    setFinalNewPassword("");
    setFinalConfirmPassword("");
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmNewPasswordError("");
    setForgotEmailError("");
    setOtpError("");
    setFinalNewPasswordError("");
    setFinalConfirmPasswordError("");
  };

  const handleTeamsDialogConfirm = () => {
    if (!newTeamsId.trim()) {
      setTeamsIdError("Teams ID cannot be empty");
      return;
    }
    setShowTeamsConfirmDialog(true);
  };

  const handleTeamsIdChange = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/User/UpdateTeamsId`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ teamsId: newTeamsId }),
      });

      if (!response.ok) throw new Error("Failed to update Teams ID");

      setProfile((prev) => ({ ...prev, teamsId: newTeamsId }));
      setIsTeamsDialog(false);
      setShowTeamsConfirmDialog(false);
      setNewTeamsId("");
      toast.success("Teams ID updated");
    } catch (error) {
      toast.error("Failed to update Teams ID");
    }
  };

  return (
    <div className="px-4 sm:px-6 py-4">
      <div className="space-y-6">
        <div className="text-start">
          <h1 className="text-2xl font-bold text-foreground">
            Account Details
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your profile and account settings
          </p>
        </div>

        {/* Profile Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          <CardContent className="relative px-8 py-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-8">
              <div className="relative group">
                <ProfileCompletionCircle percentage={completionPercentage}>
                  <Avatar className="w-full h-full border-2 border-background shadow-lg">
                    <AvatarImage
                      src={isEditing ? editForm.avatar : profile.avatar}
                      alt="Profile Avatar"
                    />
                    <AvatarFallback className="text-2xl">
                      {(isEditing ? editForm.name : profile.name)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </ProfileCompletionCircle>

                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-2 right-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-10"
                  onClick={() => setShowAvatarSelector(true)}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-3 sm:space-y-4 text-center md:text-left my-auto">
                <div>
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-center md:justify-start gap-4">
                    <h2 className="text-2xl font-bold text-foreground">
                      {isEditing ? editForm.name : profile.name}
                    </h2>
                    <Badge
                      variant="secondary"
                      className="text-xs relative pl-8 pr-4 py-1 flex items-center gap-1"
                    >
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                        </span>
                      </span>
                      {userDetails?.activeState ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {profile.title}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Last Login</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {userDetails?.lastLogin
                        ? format(
                            new Date(userDetails.lastLogin),
                            "dd MMMM, yyyy - hh:mm a"
                          )
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute right-4 md:right-8 top-6">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline md:hidden lg:inline">
                      Edit Profile
                    </span>
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <AlertDialog
                      open={showConfirmDialog}
                      onOpenChange={setShowConfirmDialog}
                    >
                      <AlertDialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <Save className="w-4 h-4" />
                          Save
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to save the changes to your
                            profile?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleSave}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid Sections */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-muted p-1 rounded-full shadow-md">
                  <IconUserCircle stroke={1.5} size={20} />
                </span>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    placeholder="Enter full name"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {profile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <p className="text-sm text-muted-foreground">
                  {profile.title}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Member Since</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {profile.joinDate
                      ? format(new Date(profile.joinDate), "dd MMMM, yyyy")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="bg-muted p-1 rounded-full shadow-md">
                    <IconMail stroke={1.5} size={20} />
                  </span>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      placeholder="Enter email address"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {profile.email}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="bg-muted p-1 rounded-full shadow-md">
                    <IconShieldLock stroke={1.5} size={20} />
                  </span>
                  Security Setting
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-end gap-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="text-blue-400 border py-1 px-2 rounded-sm shadow-sm flex flex-row items-center gap-2">
                    <IconLockPassword
                      stroke={2}
                      size={18}
                      className="text-muted-foreground"
                    />
                    <span> ●●●●●●●●</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="shadow-md gap-1"
                  onClick={() => setShowPasswordDialog(true)}
                >
                  Change <IconPencilCog stroke={2} size={20} />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="bg-muted p-1 rounded-full shadow-md">
                    <IconBrandTeams stroke={1.5} size={20} />
                  </span>
                  Teams Details
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-end">
                <div className="space-y-2">
                  <Label>Teams ID</Label>
                  <div className="text-sm text-muted-foreground break-words max-w-56 sm:max-w-70 lg:max-w-100">
                    {profile.teamsId || "Not set"}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="shadow-md gap-1"
                  onClick={() => {
                    setNewTeamsId(profile.teamsId);
                    setIsTeamsDialog(true);
                  }}
                >
                  Update <IconEdit stroke={2} size={20} />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Avatar Selector Dialog */}
      <Dialog open={showAvatarSelector} onOpenChange={setShowAvatarSelector}>
        <DialogContent className="sm:max-w-md pb-2">
          <DialogHeader>
            <DialogTitle>Choose Avatar</DialogTitle>
          </DialogHeader>
          <AvatarSelector
            onSelect={handleAvatarSelect}
            currentAvatar={editForm.avatar}
          />
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}

<Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Change Password</DialogTitle>
    </DialogHeader>

    {/* MAIN FLOW: Old + New Password */}
    {!showForgotFlow && (
      <div className="space-y-4">
        {/* Old Password */}
        <div className="space-y-2">
          <Label htmlFor="old-password">Old Password</Label>
          <div className="relative">
            <Input
              id="old-password"
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className={oldPasswordError ? "border-red-500" : ""}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          {oldPasswordError && <p className="text-sm text-red-500">{oldPasswordError}</p>}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className={newPasswordError ? "border-red-500" : ""}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          {newPasswordError && <p className="text-sm text-red-500">{newPasswordError}</p>}
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <Label htmlFor="confirm-new-password">Re-enter New Password</Label>
          <div className="relative">
            <Input
              id="confirm-new-password"
              type={showConfirmNewPassword ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-enter new password"
              className={confirmNewPasswordError ? "border-red-500" : ""}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            >
              {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          {confirmNewPasswordError && (
            <p className="text-sm text-red-500">{confirmNewPasswordError}</p>
          )}
        </div>

        {/* <div className="text-center">
          <button
            type="button"
            onClick={() => setShowForgotFlow(true)}
            className="text-sm text-primary hover:underline"
          >
            Try another way
          </button>
        </div> */}
      </div>
    )}

   
{/* OTP + NEW PASSWORD FLOW */}
{showForgotFlow && (
  <div className="space-y-5">
    {/* Email + Send OTP */}
    <div className="space-y-2">
      <Label htmlFor="forgot-email">Email Address</Label>
      <div className="flex gap-2">
        <Input
          id="forgot-email"
          type="email"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
          placeholder="Enter your email"
          className={`flex-1 ${forgotEmailError ? "border-red-500" : ""}`}
          disabled={otpSent}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSendOtp}
          disabled={loading || otpSent}
        >
          {loading ? "..." : otpSent ? "Sent" : "Send OTP"}
        </Button>
      </div>
      {forgotEmailError && <p className="text-sm text-red-500">{forgotEmailError}</p>}
    </div>

    {/* OTP Field */}
    {otpSent && !otpVerified && (
      <div className="space-y-2">
        <Label htmlFor="otp">Enter OTP</Label>
        <div className="flex gap- irod2">
          <Input
            id="otp"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(value);
              setOtpError("");
            }}
            placeholder="6-digit OTP"
            maxLength={6}
            className={`flex-1 ${otpError ? "border-red-500" : ""}`}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleVerifyOtp} // Now calls real API
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </div>
        {otpError && <p className="text-sm text-red-500">{otpError}</p>}
      </div>
    )}

    {/* New Password Fields – Only after REAL OTP verification */}
    {otpVerified && (
      <>
        <div className="space-y-2">
          <Label htmlFor="final-new-password">New Password</Label>
          <div className="relative">
            <Input
              id="final-new-password"
              type={showFinalNewPassword ? "text" : "password"}
              value={finalNewPassword}
              onChange={(e) => setFinalNewPassword(e.target.value)}
              placeholder="Enter new password"
              className={finalNewPasswordError ? "border-red-500" : ""}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowFinalNewPassword(!showFinalNewPassword)}
            >
              {showFinalNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          {finalNewPasswordError && (
            <p className="text-sm text-red-500">{finalNewPasswordError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="final-confirm-password">Re-enter New Password</Label>
          <div className="relative">
            <Input
              id="final-confirm-password"
              type={showFinalConfirmPassword ? "text" : "password"}
              value={finalConfirmPassword}
              onChange={(e) => setFinalConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className={finalConfirmPasswordError ? "border-red-500" : ""}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowFinalConfirmPassword(!showFinalConfirmPassword)}
            >
              {showFinalConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
          {finalConfirmPasswordError && (
            <p className="text-sm text-red-500">{finalConfirmPasswordError}</p>
          )}
        </div>
      </>
    )}
  </div>
)}

    {/* FOOTER */}
    <DialogFooter className="flex justify-between mt-4">
      <Button variant="outline" onClick={closePasswordDialog}>
        Cancel
      </Button>

      {/* Main Flow Confirm */}
      {!showForgotFlow && (
        <AlertDialog
          open={showPasswordConfirmDialog}
          onOpenChange={setShowPasswordConfirmDialog}
        >
          <AlertDialogTrigger asChild>
            <Button onClick={handleMainPasswordConfirm} disabled={loading}>
              Confirm
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Password Change</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to change your password?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleMainPasswordChange}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* OTP Flow Submit */}
      {showForgotFlow && otpVerified && (
        <Button onClick={handleFinalSubmit} disabled={loading}>
          {loading ? "Updating..." : "Submit"}
        </Button>
      )}

      {/* Back Button for OTP Flow */}
      {showForgotFlow && (
        <Button
          variant="ghost"
          onClick={() => {
            setShowForgotFlow(false);
            setOtpSent(false);
            setOtpVerified(false);
            setOtp("");
            setFinalNewPassword("");
            setFinalConfirmPassword("");
            setOtpError("");
            setFinalNewPasswordError("");
            setFinalConfirmPasswordError("");
          }}
        >
          Back
        </Button>
      )}
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Teams ID Update Dialog */}
      <Dialog open={isTeamsDialog} onOpenChange={setIsTeamsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Teams ID</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-teams-id">New Teams ID</Label>
              <Input
                id="new-teams-id"
                value={newTeamsId}
                onChange={(e) => setNewTeamsId(e.target.value)}
                placeholder="Enter new Teams ID"
                className={teamsIdError ? "border-red-500" : ""}
              />
              {teamsIdError && (
                <p className="text-sm text-red-500">{teamsIdError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTeamsDialog(false)}>
              Cancel
            </Button>
            <AlertDialog
              open={showTeamsConfirmDialog}
              onOpenChange={setShowTeamsConfirmDialog}
            >
              <AlertDialogTrigger asChild>
                <Button onClick={handleTeamsDialogConfirm}>Update</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Teams ID Update</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to update your Teams ID?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleTeamsIdChange}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Account;