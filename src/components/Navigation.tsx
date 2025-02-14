
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Anchor, List, Ship, Wrench, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

export const Navigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <NavigationMenu className="mb-8">
      <NavigationMenuList className="flex justify-between w-full">
        <div className="flex space-x-2">
          <NavigationMenuItem>
            <Link to="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              <List className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/boats" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              <Ship className="mr-2 h-4 w-4" />
              Boats
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/assets" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              <Anchor className="mr-2 h-4 w-4" />
              Assets
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/maintenance" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              <Wrench className="mr-2 h-4 w-4" />
              Maintenance
            </Link>
          </NavigationMenuItem>
        </div>

        <NavigationMenuItem>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
