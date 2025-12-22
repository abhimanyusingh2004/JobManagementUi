import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { defaultPresets } from "@/config/Theme";

const NotFound = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [theme, setTheme] = useState("light");
    const [themeSet, setThemeSet] = useState("default");

    useEffect(() => {
        const storedTheme = localStorage.getItem("vite-ui-theme") || "light";
        const storedThemeSet = localStorage.getItem("vite-ui-theme-set") || "default";
        setTheme(storedTheme);
        setThemeSet(storedThemeSet);

        const root = window.document.documentElement;

        root.classList.remove("light", "dark");
        Object.keys(defaultPresets).forEach((preset) => {
            root.classList.remove(`theme-${preset}`);
        });

        root.classList.add(storedTheme, `theme-${storedThemeSet}`);

        const preset = defaultPresets[storedThemeSet]?.styles[storedTheme];
        if (preset) {
            Object.entries(preset).forEach(([key, value]) => {
                root.style.setProperty(`--${key}`, value);
            });
        } else {
            const fallbackPreset =
                storedTheme === "dark"
                    ? {
                        background: "222.2 84% 4.9%",
                        foreground: "210 40% 98%",
                        muted: "217.2 32.6% 17.5%",
                        "muted-foreground": "215 20.2% 65.1%",
                    }
                    : {
                        background: "0 0% 100%",
                        foreground: "222.2 84% 4.9%",
                        muted: "210 40% 96.1%",
                        "muted-foreground": "215.4 16.3% 46.9%",
                    };
            Object.entries(fallbackPreset).forEach(([key, value]) => {
                root.style.setProperty(`--${key}`, value);
            });
        }
    }, []);

    // Log 404 error
    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="h-screen w-full flex flex-col gap-6 items-center justify-center bg-background text-foreground">
            <div className="flex flex-col items-center gap-4">
                <img
                    src="/images/404.svg"
                    alt="404 visual"
                    className="object-scale-down w-64 sm:w-80 md:w-96"
                />
                <div className="text-center space-y-3 flex flex-col gap-3 justify-center items-center">
                    <div className="flex flex-row gap-6 justify-center items-center">
                        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-muted-foreground">
                            404
                        </h1>
                        <Separator
                            orientation="vertical"
                            className="h-8 md:h-10 data-[orientation=vertical]:w-0.5 bg-muted-foreground"
                        />
                        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-muted-foreground">
                            Page Not Found
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Sorry, we couldn’t find the page you’re looking for. It might have been moved or doesn’t exist.
                    </p>

                    <Button
                        size="lg"
                        variant="ghost"
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2"
                    >
                        Go Back Home
                        <ArrowRight className="h-4 w-4" />
                    </Button>

                </div>
            </div>
        </div>
    );
};

export default NotFound;