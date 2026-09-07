import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Copy-to-clipboard with a short confirmation window.
 *
 * `navigator.clipboard` is unavailable on insecure origins and can reject when
 * the document is not focused, so a failure reports itself rather than showing
 * a success state for a copy that did not happen.
 */
export function useCopy(text: string, resetAfterMs = 1800) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('failed');
    }

    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), resetAfterMs);
  }, [text, resetAfterMs]);

  return { state, copy };
}
