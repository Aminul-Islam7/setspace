'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import './theme-toggle.module.css';

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

	const isDark = mounted ? resolvedTheme === 'dark' : false;

	return (
		<label
			className={cn('switch', mounted && 'switch--ready', className)}
			title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
		>
			<input
				className="switch__input"
				type="checkbox"
				role="switch"
				checked={isDark}
				onChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
				aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
				suppressHydrationWarning
			/>
			<span className="switch__icon" aria-hidden="true">
				<span className="switch__icon-part switch__icon-part--1" />
				<span className="switch__icon-part switch__icon-part--2" />
				<span className="switch__icon-part switch__icon-part--3" />
				<span className="switch__icon-part switch__icon-part--4" />
				<span className="switch__icon-part switch__icon-part--5" />
				<span className="switch__icon-part switch__icon-part--6" />
				<span className="switch__icon-part switch__icon-part--7" />
				<span className="switch__icon-part switch__icon-part--8" />
				<span className="switch__icon-part switch__icon-part--9" />
				<span className="switch__icon-part switch__icon-part--10" />
				<span className="switch__icon-part switch__icon-part--11" />
			</span>
			<span className="switch__sr">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
		</label>
	);
}
