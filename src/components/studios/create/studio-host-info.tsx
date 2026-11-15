'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, Lock } from 'lucide-react';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface StudioHostInfoProps {
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	} | null;
}

export function StudioHostInfo({ user }: StudioHostInfoProps) {
	const getUserInitials = (name?: string | null) => {
		if (!name) return 'SS';
		return name
			.split(' ')
			.map(part => part[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	};

	return (
		<div className="rounded-2xl bg-secondary p-5 sm:p-7 space-y-6 shadow-sm">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">Host Identity & Ownership</h2>
					<p className="text-sm text-muted-foreground">Listing ownership is automatically bound to your authenticated SetSpace creator profile.</p>
				</div>
				<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary font-semibold text-xs">
					<CheckCircle2 className="size-3.5" />
					<span>Verified Host</span>
				</span>
			</div>

			{/* Host Profile Card */}
			<div className="flex items-center gap-4 p-4 rounded-xl bg-card">
				<Avatar className="size-12 shrink-0">
					{user?.image ? <AvatarImage src={user.image} alt={user.name || 'Host'} /> : null}
					<AvatarFallback className="text-sm font-semibold">{getUserInitials(user?.name)}</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<p className="text-sm font-semibold text-foreground truncate">{user?.name || 'Verified Creator Host'}</p>
					<p className="text-xs text-muted-foreground truncate">{user?.email || 'Authenticated Account'}</p>
				</div>
				<div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
					<Lock className="size-3" />
					<span>Read-only</span>
				</div>
			</div>

			<FieldGroup className="gap-5">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<Field>
						<FieldLabel htmlFor="ownerName">Host Display Name</FieldLabel>
						<Input
							id="ownerName"
							value={user?.name || ''}
							readOnly
							className="cursor-default bg-card font-medium text-foreground border border-border/50 dark:border-0"
						/>
					</Field>

					<Field>
						<FieldLabel htmlFor="ownerEmail">Host Contact Email</FieldLabel>
						<Input
							id="ownerEmail"
							value={user?.email || ''}
							readOnly
							className="cursor-default bg-card font-medium text-foreground border border-border/50 dark:border-0"
						/>
					</Field>
				</div>
			</FieldGroup>
		</div>
	);
}
