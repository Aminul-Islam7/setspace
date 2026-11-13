'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Calendar, Compass, HelpCircle, Home, LogOut, Menu, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { signOut, useSession } from '@/lib/auth-client';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

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
	const router = useRouter();
	const { data: session, isPending } = useSession();
	const user = session?.user;
	const isLoggedIn = !!user;

	const handleSignOut = async () => {
		await signOut();
		router.push('/');
		router.refresh();
	};

	const getUserInitials = (name?: string | null) => {
		if (!name) return 'SS';
		return name
			.split(' ')
			.map(part => part[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	};

	const isLinkActive = (href: string) => {
		if (href === '/') return pathname === '/';
		if (href.startsWith('/#')) return false;
		return pathname.startsWith(href);
	};

	return (
		<header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-2xl">
			<div className="container h-16 sm:h-20 flex items-center justify-between">
				{/* Brand Logo */}
				<Link href="/" className="flex items-center gap-2.5 group">
					<Image src="/logo.svg" alt="SetSpace Logo" width={32} height={32} className="size-8 transition-transform group-hover:scale-105" priority />
					<span className="font-display text-xl font-bold tracking-tight text-foreground">SetSpace</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
					{NAV_LINKS.map(link => {
						const active = isLinkActive(link.href);
						return (
							<Link key={link.href} href={link.href} className={cn('px-3.5 py-2 text-sm font-medium rounded-lg transition-colors', active ? 'text-foreground font-semibold bg-foreground/5' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5')}>
								{link.label}
							</Link>
						);
					})}
				</nav>

				{/* Right Actions */}
				<div className="hidden md:flex items-center gap-3">
					<ThemeToggle />

					{isPending ? (
						<Skeleton className="size-9 rounded-full shrink-0" />
					) : isLoggedIn ? (
						<DropdownMenu>
							<DropdownMenuTrigger render={<Button variant="ghost" size="icon" shape="full" className="p-0 size-9 overflow-hidden cursor-pointer" aria-label="Open user menu" />}>
								<Avatar size="default">
									{user?.image ? <AvatarImage src={user.image} alt={user?.name || 'User avatar'} /> : null}
									<AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-60">
								<DropdownMenuItem
									render={
										<Link href="/profile" className="flex items-center gap-3 w-full py-1 text-left cursor-pointer group">
											<Avatar size="default" className="size-9 shrink-0">
												{user?.image ? <AvatarImage src={user.image} alt={user?.name || 'User avatar'} /> : null}
												<AvatarFallback className="text-xs font-semibold">{getUserInitials(user?.name)}</AvatarFallback>
											</Avatar>
											<div className="flex flex-col space-y-1 text-left min-w-0 flex-1">
												<p className="text-sm font-semibold leading-none text-foreground truncate group-hover:text-primary transition-colors">{user?.name || 'Creator'}</p>
												<p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
											</div>
										</Link>
									}
								/>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
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
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									variant="destructive"
									onClick={handleSignOut}
									className="flex items-center gap-2.5 cursor-pointer hover:text-destructive focus:text-destructive data-highlighted:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 data-highlighted:bg-destructive/10 dark:data-highlighted:bg-destructive/20"
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

				{/* Mobile Drawer */}
				<div className="flex items-center gap-2 md:hidden">
					<ThemeToggle />

					<Sheet>
						<SheetTrigger nativeButton render={<Button variant="ghost" size="icon-sm" aria-label="Open mobile menu" />}>
							<Menu className="size-5" />
						</SheetTrigger>
						<SheetContent side="right" className="w-4/5 sm:max-w-sm flex flex-col justify-between p-6">
							{/* Drawer Header */}
							<div className="space-y-6">
								<SheetHeader className="p-0 text-left">
									<SheetTitle className="flex items-center gap-2">
										<Image src="/logo.svg" alt="SetSpace" width={28} height={28} className="size-7" />
										<span className="font-display text-lg font-bold">SetSpace</span>
									</SheetTitle>
								</SheetHeader>

								{/* Navigation */}
								<nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
									{NAV_LINKS.map(link => {
										const active = isLinkActive(link.href);
										const Icon = link.icon;
										return (
											<SheetClose key={link.href} render={<Link href={link.href} className={cn('flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-lg transition-colors', active ? 'text-foreground font-semibold bg-foreground/5' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5')} />}>
												<Icon className="size-5 shrink-0" />
												<span>{link.label}</span>
											</SheetClose>
										);
									})}
								</nav>
							</div>

							{/* Drawer Footer */}
							<div className="pt-4 space-y-4">
								{isPending ? (
									<div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-foreground/5 animate-pulse">
										<Skeleton className="size-9 rounded-full shrink-0" />
										<div className="flex flex-col gap-1.5 flex-1 min-w-0">
											<Skeleton className="h-4 w-24 rounded" />
											<Skeleton className="h-3 w-32 rounded" />
										</div>
									</div>
								) : isLoggedIn ? (
									<div className="space-y-3">
										<SheetClose render={<Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors group" />}>
											<Avatar>
												{user?.image ? <AvatarImage src={user.image} alt={user?.name || 'User avatar'} /> : null}
												<AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
											</Avatar>
											<div className="flex flex-col min-w-0">
												<p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{user?.name || 'Creator'}</p>
												<p className="text-xs text-muted-foreground truncate">{user?.email}</p>
											</div>
										</SheetClose>

										<div className="flex flex-col space-y-1">
											<SheetClose render={<Link href="/my-bookings" className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg" />}>
												<Calendar className="size-4" />
												<span>My Bookings</span>
											</SheetClose>
											<SheetClose render={<Link href="/my-listings" className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg" />}>
												<Building2 className="size-4" />
												<span>My Studios Listings</span>
											</SheetClose>
											<SheetClose render={<Link href="/add-studio" className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg" />}>
												<PlusCircle className="size-4" />
												<span>Host My Studio</span>
											</SheetClose>
										</div>

										<Button variant="destructive" size="sm" className="w-full mt-2 py-4" onClick={handleSignOut}>
											<LogOut className="size-4" />
											<span>Sign out</span>
										</Button>
									</div>
								) : (
									<div className="flex flex-col gap-2.5">
										<SheetClose render={<Button variant="ghost" size="lg" className="w-full" />}>
											<Link href="/login" className="w-full text-center">
												Sign in
											</Link>
										</SheetClose>
										<SheetClose render={<Button variant="default" size="lg" className="w-full" />}>
											<Link href="/register" className="w-full text-center">
												Sign up
											</Link>
										</SheetClose>
									</div>
								)}

								<div className="text-xs text-muted-foreground text-center">SetSpace &copy; 2026</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}

