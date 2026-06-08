export function useInitials() {
    return (name: string): string => {
        const cleaned = (name ?? '').trim();
        if (!cleaned) return '';

        const parts = cleaned.split(/\s+/).filter(Boolean);
        const first = parts[0]?.[0] ?? '';
        const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';

        return (first + last).toUpperCase();
    };
}
