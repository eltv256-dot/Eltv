import { useEffect, useState, useCallback } from 'react';
import { getPreferences, savePreferences } from '../services/storage';

export function useTVNavigation(onBack?: () => void) {
  const [isTVMode, setIsTVMode] = useState<boolean>(() => {
    const prefs = getPreferences();
    if (typeof prefs.tvMode === 'boolean') return prefs.tvMode;
    // Auto-detect Smart TV user agents or large screens
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      const isSmartTV = /smart-tv|smarttv|googletv|appletv|androidtv|hbbtv|pov_tv|netcast|viera|webos|tizen|roku/.test(ua);
      return isSmartTV || window.innerWidth >= 2560;
    }
    return false;
  });

  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const toggleTVMode = useCallback(() => {
    setIsTVMode((prev) => {
      const next = !prev;
      savePreferences({ tvMode: next });
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isTVMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      const navigableElements = Array.from(
        document.querySelectorAll<HTMLElement>(
          '.tv-nav-item, button:not([disabled]), a:not([disabled]), [tabindex="0"]'
        )
      ).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
      });

      if (navigableElements.length === 0) return;

      const currentActive = document.activeElement as HTMLElement;
      let currentIndex = navigableElements.indexOf(currentActive);
      if (currentIndex === -1) currentIndex = 0;

      switch (e.key) {
        case 'ArrowRight': {
          e.preventDefault();
          const next = (currentIndex + 1) % navigableElements.length;
          setFocusedIndex(next);
          const el = navigableElements[next];
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          const prev = (currentIndex - 1 + navigableElements.length) % navigableElements.length;
          setFocusedIndex(prev);
          const el = navigableElements[prev];
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          // Find element geometrically below current
          const currentRect = navigableElements[currentIndex].getBoundingClientRect();
          let bestIdx = (currentIndex + 1) % navigableElements.length;
          let minDistance = Infinity;

          navigableElements.forEach((el, idx) => {
            if (idx === currentIndex) return;
            const r = el.getBoundingClientRect();
            if (r.top >= currentRect.bottom - 10) {
              const dy = r.top - currentRect.bottom;
              const dx = Math.abs(r.left - currentRect.left);
              const dist = dy * 2 + dx;
              if (dist < minDistance) {
                minDistance = dist;
                bestIdx = idx;
              }
            }
          });

          setFocusedIndex(bestIdx);
          const el = navigableElements[bestIdx];
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          // Find element geometrically above current
          const currentRect = navigableElements[currentIndex].getBoundingClientRect();
          let bestIdx = (currentIndex - 1 + navigableElements.length) % navigableElements.length;
          let minDistance = Infinity;

          navigableElements.forEach((el, idx) => {
            if (idx === currentIndex) return;
            const r = el.getBoundingClientRect();
            if (r.bottom <= currentRect.top + 10) {
              const dy = currentRect.top - r.bottom;
              const dx = Math.abs(r.left - currentRect.left);
              const dist = dy * 2 + dx;
              if (dist < minDistance) {
                minDistance = dist;
                bestIdx = idx;
              }
            }
          });

          setFocusedIndex(bestIdx);
          const el = navigableElements[bestIdx];
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.click();
          }
          break;
        }
        case 'Escape':
        case 'Backspace': {
          if (onBack) {
            e.preventDefault();
            onBack();
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTVMode, onBack]);

  return {
    isTVMode,
    toggleTVMode,
    focusedIndex,
  };
}
