import React, { useState, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const SearchableAddDropdown = ({ label, items, selectedValue, placeholder, onValueChange, onInputChange }) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const commandRef = useRef(null);

    const handleAlphanumericChange = (value) => {
        if (/^[A-Za-z0-9\s]*$/.test(value)) {
            setInputValue(value);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === "Enter" && highlightedIndex >= 0) {
            e.preventDefault();
            const item = items[highlightedIndex];
            if (item) {
                onValueChange(item.value);
                setInputValue("");
                setOpen(false);
                setHighlightedIndex(-1);
            }
        } else if (e.key === "Enter" && inputValue) {
            e.preventDefault();
            onValueChange(inputValue);
            onInputChange?.(inputValue);
            setInputValue("");
            setOpen(false);
            setHighlightedIndex(-1);
        }
    };

    return (
        <>
            <Popover
                open={open}
                onOpenChange={(isOpen) => {
                    setOpen(isOpen);
                    setHighlightedIndex(-1);
                }}
            >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={selectedValue ? "w-full justify-between" : "w-full justify-between text-muted-foreground font-normal"}
                    >
                        <span className="truncate"> {selectedValue || placeholder} </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" side="bottom" className="w-56 p-0" onWheel={(e) => e.stopPropagation()}>
                    <Command ref={commandRef} onKeyDown={handleKeyDown}>
                        <CommandInput
                            placeholder={`Search ${label?.toLowerCase()}...`}
                            value={inputValue}
                            onValueChange={handleAlphanumericChange}
                            className="sticky top-0 z-10"
                        />
                        <ScrollArea>
                            <div className="max-h-72">
                                <CommandEmpty>No {label?.toLowerCase()} found.</CommandEmpty>
                                <CommandGroup>
                                    {items
                                        .filter((item) => item.value?.toLowerCase().includes(inputValue.toLowerCase()))
                                        .map((item, index) => {
                                            const fullLabel = item.value;
                                            const indexLower = fullLabel.toLowerCase().indexOf(inputValue.toLowerCase());
                                            let before = fullLabel;
                                            let match = "";
                                            let after = "";

                                            if (indexLower !== -1 && inputValue.length > 0) {
                                                before = fullLabel.slice(0, indexLower);
                                                match = fullLabel.slice(indexLower, indexLower + inputValue.length);
                                                after = fullLabel.slice(indexLower + inputValue.length);
                                            }

                                            return (
                                                <CommandItem
                                                    key={item.value}
                                                    data-index={index}
                                                    value={fullLabel}
                                                    onSelect={() => {
                                                        onValueChange(item.value);
                                                        setOpen(false);
                                                        setHighlightedIndex(-1);
                                                        setInputValue("");
                                                    }}
                                                    className={cn(
                                                        "cursor-pointer",
                                                        highlightedIndex === index && "bg-accent text-accent-foreground"
                                                    )}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedValue === item.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <span>
                                                        {before}
                                                        {match && <span className="font-semibold">{match}</span>}
                                                        {after}
                                                    </span>
                                                </CommandItem>
                                            );
                                        })}
                                    {inputValue && !items.some((t) => t.value.toLowerCase() === inputValue.toLowerCase()) && (
                                        <CommandItem
                                            value={inputValue}
                                            onSelect={() => {
                                                onValueChange(inputValue);
                                                onInputChange?.(inputValue);
                                                setOpen(false);
                                                setHighlightedIndex(-1);
                                                setInputValue("");
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedValue === inputValue ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <span>Add "{inputValue}"</span>
                                        </CommandItem>
                                    )}
                                </CommandGroup>
                            </div>
                        </ScrollArea>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default SearchableAddDropdown;