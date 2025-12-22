import { useEffect, useRef, useState } from 'react';

export const useResize = ({
  elementRef,
  size,
  onSizeChange,
  minWidth = 200,
  minHeight = 200,
  maxWidth = window.innerWidth - 20,
  maxHeight = window.innerHeight - 20
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseDown = (e) => {
      const rect = element.getBoundingClientRect();
      const isNearRightEdge = e.clientX >= rect.right - 10;
      const isNearBottomEdge = e.clientY >= rect.bottom - 10;

      if (isNearRightEdge || isNearBottomEdge) {
        setIsResizing(true);
        resizeStart.current = {
          x: e.clientX,
          y: e.clientY,
          width: size.width,
          height: size.height
        };
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleMouseMove = (e) => {
      if (!isResizing) {
        // Change cursor when near resize area
        const rect = element.getBoundingClientRect();
        const isNearRightEdge = e.clientX >= rect.right - 10;
        const isNearBottomEdge = e.clientY >= rect.bottom - 10;

        if (isNearRightEdge && isNearBottomEdge) {
          element.style.cursor = 'se-resize';
        } else if (isNearRightEdge) {
          element.style.cursor = 'e-resize';
        } else if (isNearBottomEdge) {
          element.style.cursor = 's-resize';
        } else {
          element.style.cursor = 'default';
        }
        return;
      }

      const deltaX = e.clientX - resizeStart.current.x;
      const deltaY = e.clientY - resizeStart.current.y;

      const newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, resizeStart.current.width + deltaX)
      );
      const newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, resizeStart.current.height + deltaY)
      );

      onSizeChange({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        element.style.cursor = 'default';
      }
    };

    const handleMouseLeave = () => {
      if (!isResizing) {
        element.style.cursor = 'default';
      }
    };

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isResizing, size, onSizeChange, minWidth, minHeight, maxWidth, maxHeight, elementRef]);

  return { isResizing };
};
