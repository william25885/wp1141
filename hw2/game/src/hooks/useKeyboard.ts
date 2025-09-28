import { useEffect, useCallback, useRef } from 'react';

interface KeyMap {
  [key: string]: () => void;
}

interface KeyHoldMap {
  [key: string]: (holdDuration: number) => void;
}

export const useKeyboard = (keyMap: KeyMap, keyHoldMap?: KeyHoldMap) => {
  const keyHoldStart = useRef<{ [key: string]: number }>({});

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (keyMap[key]) {
        event.preventDefault();
        keyMap[key]();
      }

      // 記錄按鍵開始時間（用於計算持續時間）
      if (keyHoldMap && keyHoldMap[key]) {
        keyHoldStart.current[key] = Date.now();
      }
    },
    [keyMap, keyHoldMap]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (keyHoldMap && keyHoldMap[key] && keyHoldStart.current[key]) {
        const holdDuration = Date.now() - keyHoldStart.current[key];
        keyHoldMap[key](holdDuration);
        delete keyHoldStart.current[key];
      }
    },
    [keyHoldMap]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
};
