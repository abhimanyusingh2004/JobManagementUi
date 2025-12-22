import { useEffect, useRef, useState } from 'react';

export const useDrag = ({
  elementRef,
  handleRef,
  position,
  onPositionChange,
  onDragStart,
  onDragEnd
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleElement = handleRef.current;
    if (!handleElement) return;

    const handleMouseDown = (e) => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      setIsDragging(true);
      if (onDragStart) onDragStart();

      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const newPosition = {
        x: Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.current.y))
      };

      onPositionChange(newPosition);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (onDragEnd) onDragEnd();
      }
    };

    handleElement.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      handleElement.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onPositionChange, onDragStart, onDragEnd, elementRef, handleRef]);

  return { isDragging };
};
