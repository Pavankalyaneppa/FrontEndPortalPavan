import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate} from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BellIcon,
  EnterFullScreenIcon,
  PersonIcon,
  ExitIcon,
} from "@radix-ui/react-icons";
import { NotificationBell } from "@/components/custom/NotificationBell";
import { useDispatch, useSelector } from "react-redux";


const Header = () => {

  const { user } = useSelector(state => state.authentication);

  const navigate = useNavigate();
const dispatch=useDispatch();
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(
          `Error attempting to enable full-screen mode: ${e.message}`
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const openProfile = () => {
    navigate("/adminProfile");
  };
  
  const handleLogout = () => {
    // Clear all authentication-related localStorage items
    localStorage.removeItem('authToken');
    localStorage.removeItem('orgId');
    localStorage.removeItem('id');
    localStorage.removeItem('roleId');
    
    // Redirect to login page
    navigate("/login");
    
    // Force reload to ensure all application state is reset
    window.location.reload();
  };


  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          {/* <Input type="search" placeholder="Search..." className="w-64" /> */}
        </div>
        <div className="flex items-center space-x-4">
          <NotificationBell/>
          <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
            <EnterFullScreenIcon className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <PersonIcon className="h-4 w-4" />
                <span>{user?.firstName || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{`${user?.firstName || ''} ${user?.lastName || ''}`}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ''}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openProfile}>
                <PersonIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <ExitIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
