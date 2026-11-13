'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Calendar, Compass, LogOut, Mail, PlusCircle, ShieldCheck, User as UserIcon } from 'lucide-react';
import { signOut, useSession } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
	const router = useRouter();
	const { data: session, isPending } = useSession();
	const user = session?.user;

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

	if (isPending) {
		return (
			<div className="container py-12 max-w-3xl">
				<div className="h-64 animate-pulse rounded-2xl bg-secondary/70" />
			</div>
		);
	}

	if (!user) {
		return (
			<div className="container py-16 max-w-md text-center space-y-6">
				<div className="size-16 mx-auto rounded-full bg-secondary/70 flex items-center justify-center text-muted-foreground">
					<UserIcon className="size-8" />
				</div>
				<div className="space-y-2">
					<h1 className="font-display text-2xl font-bold text-foreground">Sign in to view your profile</h1>
					<p className="text-sm text-muted-foreground">You need an active session to access your account information.</p>
				</div>
				<Button asChild variant="default" flat3d className="w-full">
					<Link href="/login">Sign in</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="container py-8 sm:py-12 max-w-3xl space-y-8">
			{/* Page Header */}
			<div className="space-y-1">
				<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Account Profile</h1>
				<p className="text-sm text-muted-foreground">Manage your identity, active reservations, and studio listings.</p>
			</div>

			{/* Profile Card */}
			<div className="rounded-2xl bg-secondary/70 p-6 sm:p-8 space-y-6">
				<div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
					<Avatar className="size-20 sm:size-24 border-2 border-primary/20">
						{user.image ? <AvatarImage src={user.image} alt={user.name || 'User avatar'} /> : null}
						<AvatarFallback className="text-2xl font-bold">{getUserInitials(user.name)}</AvatarFallback>
					</Avatar>

					<div className="space-y-2 flex-1 min-w-0">
						<div className="flex flex-col sm:flex-row sm:items-center gap-2">
							<h2 className="font-display text-xl sm:text-2xl font-bold text-foreground truncate">{user.name || 'Creator'}</h2>
							<span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary w-fit mx-auto sm:mx-0">
								<ShieldCheck className="size-3.5" />
								Verified Creator
							</span>
						</div>

						<p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 truncate">
							<Mail className="size-3.5 shrink-0" />
							{user.email}
						</p>
					</div>
				</div>

				{/* Quick Actions Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
					<Button asChild variant="secondary" flat3d className="w-full justify-start gap-2.5 h-11">
						<Link href="/my-bookings">
							<Calendar className="size-4" />
							<span>My Bookings</span>
						</Link>
					</Button>

					<Button asChild variant="secondary" flat3d className="w-full justify-start gap-2.5 h-11">
						<Link href="/my-listings">
							<Building2 className="size-4" />
							<span>My Listings</span>
						</Link>
					</Button>

					<Button asChild variant="secondary" flat3d className="w-full justify-start gap-2.5 h-11">
						<Link href="/add-studio">
							<PlusCircle className="size-4" />
							<span>Host Studio</span>
						</Link>
					</Button>
				</div>
			</div>

			{/* Account Actions */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
				<Button asChild variant="outline" flat3d size="sm" className="w-full sm:w-auto gap-2">
					<Link href="/studios">
						<Compass className="size-4" />
						<span>Browse Spaces</span>
					</Link>
				</Button>

				<Button variant="destructive" flat3d size="sm" onClick={handleSignOut} className="w-full sm:w-auto gap-2">
					<LogOut className="size-4" />
					<span>Sign out of SetSpace</span>
				</Button>
			</div>
		</div>
	);
}
