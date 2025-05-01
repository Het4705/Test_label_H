
import { useAuth } from "@/contexts/AuthContext";
import { useAuthDialog } from "@/contexts/AuthDialogContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const UserAvatar = () => {
  const { currentUser, logout } = useAuth();
  const { openLogin } = useAuthDialog();
  const navigate = useNavigate();

  const getUserInitials = () => {
    if (!currentUser) return "G";
    
    if (currentUser.displayName) {
      return currentUser.displayName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    
    return currentUser.email ? currentUser.email[0].toUpperCase() : "U";
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!currentUser) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-full"
        onClick={openLogin}
      >
        Sign in
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer border-2 border-accent">
          <AvatarFallback className="bg-accent text-white">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5 text-sm font-medium">
          {currentUser.email}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/orders")}>
          My Orders
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/favorites")}>
          My Favorites
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
