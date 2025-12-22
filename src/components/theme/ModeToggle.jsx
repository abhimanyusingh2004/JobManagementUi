import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function ModeToggle({ onBeforeThemeChange }) {
  const { theme, setTheme } = useTheme();

  const handleToggle = (event) => {
    const newTheme = theme === "dark" ? "light" : "dark";

    // Get click coordinates relative to the viewport
    const coords = {
      x: event.clientX,
      y: event.clientY,
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Call onBeforeThemeChange if provided
    if (onBeforeThemeChange) {
      onBeforeThemeChange(newTheme);
    }

    const root = document.documentElement;

    // If View Transitions API is not supported or reduced motion is preferred, change theme immediately
    if (!document.startViewTransition || prefersReducedMotion) {
      setTheme(newTheme);
      return;
    }

    // Set CSS custom properties for transition origin
    root.style.setProperty("--x", `${coords.x}px`);
    root.style.setProperty("--y", `${coords.y}px`);

    // Start view transition
    document.startViewTransition(() => {
      setTheme(newTheme);
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggle}
            className="h-8 w-8 relative z-10"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}