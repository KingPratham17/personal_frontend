import { useState, useCallback } from 'react';

export function useDragDrop() {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const handleDragStart = useCallback((e, item) => {
    setDraggedItem(item);
    if (e?.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  }, []);

  const handleDragOver = useCallback((e, target) => {
    e?.preventDefault();
    setDropTarget(target);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDropTarget(null);
  }, []);

  const handleDrop = useCallback((e, onDropCallback) => {
    e?.preventDefault();
    if (draggedItem && onDropCallback) {
      onDropCallback(draggedItem, dropTarget);
    }
    setDraggedItem(null);
    setDropTarget(null);
  }, [draggedItem, dropTarget]);

  const resetDrag = useCallback(() => {
    setDraggedItem(null);
    setDropTarget(null);
  }, []);

  const isDragging = draggedItem !== null;
  const isDropTarget = (target) => dropTarget === target;

  return {
    draggedItem,
    dropTarget,
    isDragging,
    isDropTarget,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    resetDrag
  };
}