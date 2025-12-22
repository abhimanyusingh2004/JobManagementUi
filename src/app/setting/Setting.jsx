import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "@/components/theme/ThemeProvider";
import { Palette, FolderPlus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function Setting() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const settingsOptions = [
    {
      title: "Theme Settings",
      description: "Customize colors, fonts, and appearance",
      icon: <Palette className="w-6 h-6" />,
      path: "/themesSetting",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      title: "Add Category",
      description: "Create and manage new categories",
      icon: <FolderPlus className="w-6 h-6" />,
      path: "/addcategory",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
  ];

  return (
    <div className="px-4 sm:px-6 py-8 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and configurations.</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsOptions.map((option) => (
          <Card
            key={option.path}
            className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-border/50 overflow-hidden"
            onClick={() => navigate(option.path)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${option.color} transition-colors`}>
                  {option.icon}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(option.path);
                  }}
                >
                  Open →
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 pt-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                {option.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {option.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Optional: Add more sections later */}
      <div className="h-20"></div>
    </div>
  );
}

export default Setting;