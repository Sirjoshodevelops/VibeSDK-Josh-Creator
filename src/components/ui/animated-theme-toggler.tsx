'use client';

import { useCallback, useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/theme-context';

type AnimatedThemeTogglerProps = ComponentPropsWithoutRef<'button'>;

export function AnimatedThemeToggler({ className, ...props }: AnimatedThemeTogglerProps) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const { setTheme } = useTheme();
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const updateThemeState = () => {
			const prefersDark = document.documentElement.classList.contains('dark');
			setIsDark(prefersDark);
		};

		updateThemeState();

		const observer = new MutationObserver(updateThemeState);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		return () => observer.disconnect();
	}, []);

	const toggleTheme = useCallback(async () => {
		if (!buttonRef.current) return;

		const nextIsDark = !isDark;
		const newTheme = nextIsDark ? 'dark' : 'light';

		const startViewTransition = (document as unknown as {
			startViewTransition?: (callback: () => void) => { ready: Promise<void> };
		}).startViewTransition;

		if (typeof startViewTransition !== 'function') {
			flushSync(() => {
				setTheme(newTheme);
				setIsDark(nextIsDark);
			});
			return;
		}

		await startViewTransition(() => {
			flushSync(() => {
				setTheme(newTheme);
				setIsDark(nextIsDark);
			});
		}).ready;

		const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
		const x = left + width / 2;
		const y = top + height / 2;
		const maxRadius = Math.hypot(
			Math.max(x, window.innerWidth - x),
			Math.max(y, window.innerHeight - y),
		);

		document.documentElement.animate(
			{
				clipPath: [
					`circle(0px at ${x}px ${y}px)`,
					`circle(${maxRadius}px at ${x}px ${y}px)`,
				],
			},
			{
				duration: 700,
				easing: 'ease-in-out',
				pseudoElement: '::view-transition-new(root)',
			},
		);
	}, [isDark, setTheme]);

	return (
		<button
			type="button"
			ref={buttonRef}
			onClick={toggleTheme}
			className={cn('relative inline-flex items-center justify-center rounded-full p-2 transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/10', className)}
			{...props}
		>
			<span className="sr-only">Toggle theme</span>
			{isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
		</button>
	);
}
