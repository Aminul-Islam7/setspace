import './globals.css';

import { Inter, Montserrat, Plus_Jakarta_Sans, Syne } from 'next/font/google';

import { Footer } from '@/components/layout/footer';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Suspense } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const montserratHeading = Montserrat({ subsets: ['latin'], variable: '--font-heading' });

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const fontDisplay = Syne({
	variable: '--font-display',
	subsets: ['latin'],
	display: 'swap',
});

const fontBody = Plus_Jakarta_Sans({
	variable: '--font-body',
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'SetSpace',
	description: 'Discover, book, and host iconic production spaces. From high-end cyclorama photo studios and sound stages to video podcast lounges and Dolby Atmos suites. SetSpace is a peer-to-peer marketplace connecting creators, filmmakers, and podcasters with verified studio spaces and transparent hourly pricing.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html lang="en" className={cn('h-full antialiased font-sans', fontDisplay.variable, fontBody.variable, inter.variable, montserratHeading.variable)} suppressHydrationWarning data-scroll-behavior="smooth">
			<body className="min-h-full flex flex-col">
				<ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
					<Suspense fallback={<div className="h-16 sm:h-20 w-full bg-background/80" />}>
						<Navbar />
					</Suspense>
					{children}
					<Footer />
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}

