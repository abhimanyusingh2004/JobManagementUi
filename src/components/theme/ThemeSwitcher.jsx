import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { defaultPresets } from "@/config/Theme"; 

export function ThemeSwitcher() {
  const { themeSet, setThemeSet } = useTheme();

  const handleThemeSetChange = (newThemeSet, event) => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Use click coordinates for transition
    const coords = {
      x: event.clientX,
      y: event.clientY,
    };

    if (!document.startViewTransition || prefersReducedMotion) {
      setThemeSet(newThemeSet);
      return;
    }

    root.style.setProperty("--x", `${coords.x}px`);
    root.style.setProperty("--y", `${coords.y}px`);

    document.startViewTransition(() => {
      setThemeSet(newThemeSet);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Theme: {defaultPresets[themeSet]?.label || themeSet}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(defaultPresets).map(([key, preset]) => (
          <DropdownMenuItem
            key={key}
            onClick={(event) => handleThemeSetChange(key, event)}
          >
            {preset.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}