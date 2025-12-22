import {
  IconUserCircle,
  IconLogout,
} from "@tabler/icons-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/store/userSlice";
import { toast } from "sonner";

export function NavUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userName, email, isAuthenticated } = useSelector((state) => state.user);

  const fallbackUser = {
    name: "Guest User",
    email: "guest@example.com",
    imagePath: "./images/avatars/1.png",
  };

  const displayUser = isAuthenticated
    ? { name: userName, email: email, imagePath: "./images/avatars/1.png" }
    : fallbackUser;

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 rounded-lg cursor-pointer">
              <AvatarImage src={displayUser.imagePath} alt={displayUser.name} />
              <AvatarFallback className="rounded-lg">
                {displayUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-2 text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={displayUser.imagePath} alt={displayUser.name} />
                  <AvatarFallback className="rounded-lg">
                    {displayUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium truncate">{displayUser.name}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {displayUser.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {isAuthenticated && (
              <>
                <DropdownMenuGroup>
                  <Link to="/account">
                    <DropdownMenuItem>
                      <IconUserCircle className="mr-2 h-4 w-4" />
                      Account
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout}>
                  <IconLogout className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
