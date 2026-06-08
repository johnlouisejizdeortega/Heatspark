import { useEffect, useState } from 'react';

const MOBILE_MAX_WIDTH_PX = 768;

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH_PX}px)`).matches;
    });

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH_PX}px)`);
        const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

        setIsMobile(mql.matches);

        if (typeof mql.addEventListener === 'function') {
            mql.addEventListener('change', onChange);
            return () => mql.removeEventListener('change', onChange);
        }

        // Safari fallback
        (mql as any).addListener(onChange);
        return () => (mql as any).removeListener(onChange);
    }, []);

    return isMobile;
}
