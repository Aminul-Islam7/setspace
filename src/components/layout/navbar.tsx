'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Building2,
	Calendar,
	Compass,
	HelpCircle,
	Home,
	LogOut,
	Menu,
	PlusCircle,
} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavLinkItem {
	label: string;
	href: string;
	icon: React.ElementType;
}

const NAV_LINKS: NavLinkItem[] = [
	{ label: 'Home', href: '/', icon: Home },
	{ label: 'How It Works', href: '/#how-it-works', icon: HelpCircle },
	{ label: 'Studios', href: '/studios', icon: Compass },
];

export function Navbar() {
	const pathname = usePathname();
	// Mutual exclusivity flag per instructions. Default to false, toggleable for demo/dev.
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const isLinkActive = (href: string) => {
		if (href === '/') return pathname === '/';
		if (href.startsWith('/#')) return false;
		return pathname.startsWith(href);
	};

	return (
		<header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md">
			<div className="container h-16 sm:h-20 flex items-center justify-between">
				{/* Brand Logo */}
				<Link href="/" className="flex items-center gap-2.5 group">
					<Image
						src="/logo.svg"
						alt="SetSpace Logo"
						width={32}
						height={32}
						className="size-8 transition-transform group-hover:scale-105"
						priority
					/>
					<span className="font-display text-xl font-bold tracking-tight text-foreground">
						SetSpace
					</span>
				</Link>

				{/* Desktop Navigation Links */}
				<nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
					{NAV_LINKS.map((link) => {
						const active = isLinkActive(link.href);
						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									'px-3.5 py-2 text-sm font-medium rounded-lg transition-colors',
									active
										? 'text-foreground font-semibold bg-foreground/5'
										: 'text-muted-foreground hover:text-foreground hover:bg-foreground/5',
								)}
							>
								{link.label}
							</Link>
						);
					})}
				</nav>

				{/* Desktop Right Actions: Theme Toggle + Auth / Profile */}
				<div className="hidden md:flex items-center gap-3">
					<ThemeToggle />

					{isLoggedIn ? (
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<Button
										variant="ghost"
										size="icon"
										shape="full"
										className="p-0 size-9 overflow-hidden"
									/>
								}
							>
								<Avatar size="default">
									<AvatarImage
										src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
										alt="Aminul Islam avatar"
									/>
									<AvatarFallback>AI</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-semibold leading-none text-foreground">
											Aminul Islam
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											aminul@setspace.io
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									render={
										<Link href="/my-bookings" className="flex items-center gap-2.5 w-full">
											<Calendar className="size-4" />
											<span>My Bookings</span>
										</Link>
									}
								/>
								<DropdownMenuItem
									render={
										<Link href="/my-listings" className="flex items-center gap-2.5 w-full">
											<Building2 className="size-4" />
											<span>My Studios Listings</span>
										</Link>
									}
								/>
								<DropdownMenuItem
									render={
										<Link href="/add-studio" className="flex items-center gap-2.5 w-full">
											<PlusCircle className="size-4" />
											<span>Host My Studio</span>
										</Link>
									}
								/>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									variant="destructive"
									onClick={() => setIsLoggedIn(false)}
									className="flex items-center gap-2.5 cursor-pointer"
								>
									<LogOut className="size-4" />
									<span>Sign out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="sm">
								<Link href="/login">Sign in</Link>
							</Button>
							<Button variant="default" size="sm">
								<Link href="/register">Sign up</Link>
							</Button>
						</div>
					)}
				</div>

				{/* Mobile Drawer (Sheet) */}
				<div className="flex items-center gap-2 md:hidden">
					<ThemeToggle />

					<Sheet>
						<SheetTrigger
							render={
								<Button variant="ghost" size="icon-sm" aria-label="Open mobile menu" />
							}
						>
							<Menu className="size-5" />
						</SheetTrigger>
						<SheetContent side="right" className="w-4/5 sm:max-w-sm flex flex-col justify-between p-6">
							{/* Top Area: Logo + Navlinks with Icons */}
							<div className="space-y-6">
								<SheetHeader className="p-0 text-left">
									<SheetTitle className="flex items-center gap-2">
										<Image src="/logo.svg" alt="SetSpace" width={28} height={28} className="size-7" />
										<span className="font-display text-lg font-bold">SetSpace</span>
									</SheetTitle>
								</SheetHeader>

								{/* Mobile Nav Links with Icons on the left */}
								<nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
									{NAV_LINKS.map((link) => {
										const active = isLinkActive(link.href);
										const Icon = link.icon;
										return (
											<SheetClose
												key={link.href}
												render={
													<Link
														href={link.href}
														className={cn(
															'flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-lg transition-colors',
															active
																? 'text-foreground font-semibold bg-foreground/5'
																: 'text-muted-foreground hover:text-foreground hover:bg-foreground/5',
														)}
													/>
												}
											>
												<Icon className="size-5 shrink-0" />
												<span>{link.label}</span>
											</SheetClose>
										);
									})}
								</nav>
							</div>

							{/* Bottom Area: Auth Links / Profile + Static Year */}
							<div className="pt-4 space-y-4">
								{isLoggedIn ? (
									<div className="space-y-3">
										<div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-foreground/5">
											<Avatar size="sm">
												<AvatarImage
													src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
													alt="Aminul Islam"
												/>
												<AvatarFallback>AI</AvatarFallback>
											</Avatar>
											<div className="flex flex-col min-w-0">
												<p className="text-sm font-semibold text-foreground truncate">
													Aminul Islam
												</p>
												<p className="text-xs text-muted-foreground truncate">
													aminul@setspace.io
												</p>
											</div>
										</div>

										<div className="flex flex-col space-y-1">
											<SheetClose
												render={
													<Link
														href="/my-bookings"
														className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg"
													/>
												}
											>
												<Calendar className="size-4" />
												<span>My Bookings</span>
											</SheetClose>
											<SheetClose
												render={
													<Link
														href="/my-listings"
														className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg"
													/>
												}
											>
												<Building2 className="size-4" />
												<span>My Studios Listings</span>
											</SheetClose>
											<SheetClose
												render={
													<Link
														href="/add-studio"
														className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg"
													/>
												}
											>
												<PlusCircle className="size-4" />
												<span>Host My Studio</span>
											</SheetClose>
										</div>

										<Button
											variant="destructive"
											size="sm"
											className="w-full mt-2"
											onClick={() => setIsLoggedIn(false)}
										>
											<LogOut className="size-4" />
											<span>Sign out</span>
										</Button>
									</div>
								) : (
									<div className="flex flex-col gap-2.5">
										<SheetClose
											render={
												<Button variant="ghost" size="lg" className="w-full" />
											}
										>
											<Link href="/login" className="w-full text-center">
												Sign in
											</Link>
										</SheetClose>
										<SheetClose
											render={
												<Button variant="default" size="lg" className="w-full" />
											}
										>
											<Link href="/register" className="w-full text-center">
												Sign up
											</Link>
										</SheetClose>
									</div>
								)}

								<div className="text-xs text-muted-foreground text-center">
									SetSpace &copy; 2026
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
