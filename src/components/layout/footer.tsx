'use client';

import { ArrowRight, Check } from 'lucide-react';
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';

const STUDIO_CATEGORIES = [
	{ label: 'Photo Studio', href: '/studios?category=Photo%20Studio' },
	{ label: 'Sound Stage', href: '/studios?category=Sound%20Stage' },
	{ label: 'Podcast Lounge', href: '/studios?category=Podcast%20Lounge' },
	{ label: 'Music Suite', href: '/studios?category=Music%20Suite' },
	{ label: 'Art Workshop', href: '/studios?category=Art%20Workshop' },
	{ label: 'Exhibition Hall', href: '/studios?category=Exhibition%20Hall' },
];

const PLATFORM_LINKS = [
	{ label: 'Explore Studios', href: '/studios' },
	{ label: 'Host Your Space', href: '/add-studio' },
	{ label: 'How It Works', href: '/#how-it-works' },
	{ label: 'Host Guarantee', href: '/#host-guarantee' },
	{ label: 'Verified Spaces', href: '/studios?sort=rankingScore' },
];

const COMPANY_LINKS = [
	{ label: 'About SetSpace', href: '/about' },
	{ label: 'Creator Stories', href: '/stories' },
	{ label: 'Studio Guidelines', href: '/guidelines' },
	{ label: 'Help & Support', href: '/support' },
	{ label: 'Contact Team', href: '/contact' },
];

const SOCIAL_LINKS = [
	{ label: 'X (formerly Twitter)', href: 'https://x.com', icon: FaXTwitter },
	{ label: 'Instagram', href: 'https://instagram.com', icon: FaInstagram },
	{ label: 'YouTube', href: 'https://youtube.com', icon: FaYoutube },
	{ label: 'GitHub', href: 'https://github.com', icon: FaGithub },
	{ label: 'LinkedIn', href: 'https://linkedin.com', icon: FaLinkedinIn },
];

export function Footer() {
	const [isSubscribed, setIsSubscribed] = useState(false);

	const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const emailVal = (formData.get('email') as string)?.trim() || '';
		if (!emailVal || !emailVal.includes('@') || !emailVal.includes('.')) {
			toast.error('Please enter a valid email address.');
			return;
		}

		setIsSubscribed(true);
		toast.success('Subscribed! Welcome to the SetSpace Studio Dispatch.');
		form.reset();
	};

	return (
		<footer className="w-full bg-neutral-900/5 dark:bg-neutral-950/40 text-foreground transition-colors" aria-label="SetSpace Footer">
			<div className="container py-12 sm:py-16 lg:py-20 space-y-12 sm:space-y-16">
				{/* Brand & Newsletter */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
					{/* Brand */}
					<div className="lg:col-span-5 space-y-4 sm:space-y-5">
						<Link href="/" className="inline-flex items-center gap-2.5 group">
							<Image src="/logo.svg" alt="SetSpace Logo" width={32} height={32} className="size-8 transition-transform group-hover:scale-105" />
							<span className="font-display text-2xl font-bold tracking-tight text-foreground">SetSpace</span>
						</Link>
						<p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md font-body">Discover, reserve, and host iconic production spaces. From high-end cyclorama photo lofts to cinematic soundstages and Dolby Atmos suites, SetSpace empowers creators with transparent hourly booking.</p>

						{/* Social Links */}
						<div className="pt-2 flex items-center gap-2">
							{SOCIAL_LINKS.map(item => {
								const Icon = item.icon;
								return (
									<a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="size-9 rounded-full bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={item.label}>
										<Icon className="size-4" />
									</a>
								);
							})}
						</div>
					</div>

					{/* Newsletter */}
					<div className="lg:col-span-7 flex flex-col justify-center">
						<div className="rounded-2xl p-6 sm:p-8 bg-card text-card-foreground shadow-xs space-y-4">
							<div className="space-y-1.5">
								<h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">Subscribe to Studio Dispatch</h3>
								<p className="text-xs sm:text-sm text-muted-foreground font-body leading-relaxed">Weekly curated space drops, host insights, and hourly rate spotlights for creative teams.</p>
							</div>

							{isSubscribed ? (
								<div className="flex items-center gap-2.5 py-2 text-sm font-medium text-primary">
									<div className="size-6 rounded-full bg-primary/10 inline-flex items-center justify-center">
										<Check className="size-3.5" />
									</div>
									<span>You’re on the VIP studio dispatch list! Check your inbox soon.</span>
								</div>
							) : (
								<form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
									<Input name="email" type="email" required placeholder="creator@production.com" className="h-10 text-sm bg-background" aria-label="Email address for newsletter" />
									<Button type="submit" size="lg" className="sm:shrink-0 gap-1.5">
										<span>Subscribe</span>
										<ArrowRight className="size-4" />
									</Button>
								</form>
							)}
						</div>
					</div>
				</div>

				{/* Navigation */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
					{/* Categories */}
					<div className="space-y-3.5">
						<h4 className="font-display text-sm font-semibold tracking-wide text-foreground uppercase">Studio Categories</h4>
						<ul className="space-y-2.5 text-sm font-body">
							{STUDIO_CATEGORIES.map(cat => (
								<li key={cat.label}>
									<Link href={cat.href} className="text-muted-foreground hover:text-foreground transition-colors">
										{cat.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Platform */}
					<div className="space-y-3.5">
						<h4 className="font-display text-sm font-semibold tracking-wide text-foreground uppercase">Platform</h4>
						<ul className="space-y-2.5 text-sm font-body">
							{PLATFORM_LINKS.map(link => (
								<li key={link.label}>
									<Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company */}
					<div className="space-y-3.5">
						<h4 className="font-display text-sm font-semibold tracking-wide text-foreground uppercase">Company</h4>
						<ul className="space-y-2.5 text-sm font-body">
							{COMPANY_LINKS.map(link => (
								<li key={link.label}>
									<Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Trust */}
					<div className="space-y-3.5">
						<h4 className="font-display text-sm font-semibold tracking-wide text-foreground uppercase">Creator Safety</h4>
						<p className="text-xs sm:text-sm text-muted-foreground font-body leading-relaxed">Every reservation is backed by transparent hourly billing, host identity verification, and direct studio messaging.</p>
					</div>
				</div>

				{/* Legal */}
				<div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-body">
					<p>© 2026 SetSpace, Inc. All rights reserved.</p>
					<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
						<Link href="/privacy" className="hover:text-foreground transition-colors">
							Privacy Policy
						</Link>
						<Link href="/terms" className="hover:text-foreground transition-colors">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}

