import React, { useState } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export default function ImagePreview({
  src = "",
  alt = "Preview image",
  width = 400,
  height = 400,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`cursor-pointer rounded-lg hover:opacity-90 transition-opacity ${className}`}
        onClick={() => setIsOpen(true)}
        loading="lazy"
      />

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-55" />
          <Dialog.Content
            className="fixed inset-0 flex items-center justify-center z-60 p-4"
            aria-label="Image preview"
          >
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <X className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </button>

              <img
                src={src}
                alt={alt}
                style={{ maxWidth: "90vw", maxHeight: "90vh" }}
                className="object-contain rounded-md"
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
