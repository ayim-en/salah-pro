import { useRef, useEffect } from "react";

/**
 * Hook that tracks the previous value of a prop.
 * Returns undefined on first render, then the previous value on subsequent renders.
 * Useful for crossfade animations where you need both old and new values.
 */
export function usePreviousValue<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
