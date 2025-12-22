import React from 'react'

import { useTheme } from "@/components/theme/ThemeProvider";
import { defaultPresets } from "@/config/Theme";
import { Check } from "lucide-react";
import { Card, CardHeader } from '@/components/ui/card';

const SettingThemes = () => {
    const { theme, themeSet, setThemeSet } = useTheme();

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
        <div className='px-4 sm:px-6 py-8 space-y-10 max-w-7xl mx-auto'>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Theme Setting</h2>
                    <p className="text-muted-foreground mb-6">Choose your preferred color theme.</p>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(defaultPresets).map(([key, preset]) => (
                            <div
                                key={key}
                                className={`relative cursor-pointer rounded-lg border-2 transition-all duration-500 hover:scale-105 ${themeSet === key
                                    ? 'border-primary shadow-lg'
                                    : 'border-border hover:border-muted-foreground'
                                    }`}
                                onClick={(event) => handleThemeSetChange(key, event)}
                                style={Object.entries(preset.styles[theme]).reduce((styles, [prop, value]) => ({
                                    ...styles,
                                    [`--${prop}`]: value,
                                }), {})}
                            >
                                {/* Theme Preview */}
                                <div className="p-4 rounded-t-lg bg-background">
                                    <div className="space-y-3">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="w-16 h-2 bg-primary rounded"></div>
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-muted rounded-full"></div>
                                                <div className="w-2 h-2 bg-muted rounded-full"></div>
                                                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-2">
                                            <div className="w-full h-1.5 bg-muted rounded"></div>
                                            <div className="w-3/4 h-1.5 bg-muted-foreground rounded"></div>
                                            <div className="w-1/2 h-1.5 bg-muted rounded"></div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex space-x-2">
                                            <div className="w-12 h-6 bg-primary rounded text-xs flex items-center justify-center">
                                                <div className="w-8 h-1 bg-primary-foreground rounded"></div>
                                            </div>
                                            <div className="w-12 h-6 bg-secondary rounded text-xs flex items-center justify-center">
                                                <div className="w-8 h-1 bg-secondary-foreground rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Theme Name */}
                                <div className="p-3 border-t rounded-b-lg bg-card">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-card-foreground">{preset.label}</span>
                                        {themeSet === key && (
                                            <div className="flex items-center justify-center w-5 h-5 bg-primary rounded-full">
                                                <Check className="w-3 h-3 text-primary-foreground" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Selection Overlay */}
                                {themeSet === key && (
                                    <div className="absolute inset-0 bg-primary/10 rounded-lg pointer-events-none"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SettingThemes