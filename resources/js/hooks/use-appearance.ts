import { useCallback, useEffect, useMemo, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string) {
    if (typeof document === 'undefined') return;
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
}

function applyAppearance(appearance: Appearance) {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = appearance === 'dark' || (appearance === 'system' && prefersDark);

    root.classList.toggle('dark', shouldBeDark);
}

export function initializeTheme() {
    const appearance = (getCookie('appearance') as Appearance | null) ?? 'system';
    applyAppearance(appearance);
}

export function useAppearance() {
    const initial = useMemo<Appearance>(() => {
        const cookie = getCookie('appearance') as Appearance | null;
        if (cookie === 'light' || cookie === 'dark' || cookie === 'system') return cookie;
        return 'system';
    }, []);

    const [appearance, setAppearance] = useState<Appearance>(initial);

    useEffect(() => {
        applyAppearance(appearance);
        setCookie('appearance', appearance);
    }, [appearance]);

    useEffect(() => {
        const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
        if (!mql) return;
        const onChange = () => {
            if (appearance === 'system') applyAppearance('system');
        };

        if (typeof mql.addEventListener === 'function') {
            mql.addEventListener('change', onChange);
            return () => mql.removeEventListener('change', onChange);
        }

        (mql as any).addListener(onChange);
        return () => (mql as any).removeListener(onChange);
    }, [appearance]);

    const updateAppearance = useCallback((value: Appearance) => setAppearance(value), []);

    return { appearance, updateAppearance };
}
