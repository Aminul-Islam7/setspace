'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const emptySubscribe = () => () => {};

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon-sm" className="opacity-0 pointer-events-none" aria-hidden="true">
				<Sun className="size-4" />
			</Button>
		);
	}

	const isDark = resolvedTheme === 'dark';

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon-sm"
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
		>
			{isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
		</Button>
	);
}
