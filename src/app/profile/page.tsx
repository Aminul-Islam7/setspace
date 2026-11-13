'use client';

import { AlertCircle, Building2, Calendar, Camera, CheckCircle2, Compass, Eye, EyeOff, KeyRound, Loader2, LogOut, Mail, Pencil, PlusCircle, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { changePassword, signOut, updateUser, useSession } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ActiveSection = 'profile' | 'security';

export default function ProfilePage() {
	const router = useRouter();
	const { data: session, isPending } = useSession();
	const user = session?.user;

	const [activeSection, setActiveSection] = useState<ActiveSection>('profile');

	// Name Modal State
	const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
	const [nameInput, setNameInput] = useState('');
	const [isSavingName, setIsSavingName] = useState(false);
	const [nameError, setNameError] = useState<string | null>(null);

	// Image Modal State
	const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
	const [imageInput, setImageInput] = useState('');
	const [isSavingImage, setIsSavingImage] = useState(false);
	const [imageError, setImageError] = useState<string | null>(null);

	// Password Form State
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSavingPassword, setIsSavingPassword] = useState(false);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

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

	// Save Display Name
	const handleSaveName = async (e: React.FormEvent) => {
		e.preventDefault();
		setNameError(null);

		const trimmed = nameInput.trim();
		if (!trimmed) {
			setNameError('Name cannot be empty.');
			return;
		}

		setIsSavingName(true);
		try {
			const res = await updateUser({ name: trimmed });
			if (res?.error) {
				setNameError(res.error.message || 'Failed to update name.');
			} else {
				setIsNameDialogOpen(false);
				router.refresh();
			}
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
			setNameError(msg);
		} finally {
			setIsSavingName(false);
		}
	};

	// Save Profile Image URL
	const handleSaveImage = async (e: React.FormEvent) => {
		e.preventDefault();
		setImageError(null);

		const trimmed = imageInput.trim();
		if (trimmed && !/^https?:\/\/.+/i.test(trimmed)) {
			setImageError('Please enter a valid HTTP or HTTPS image URL.');
			return;
		}

		setIsSavingImage(true);
		try {
			const res = await updateUser({ image: trimmed || null });
			if (res?.error) {
				setImageError(res.error.message || 'Failed to update image.');
			} else {
				setIsImageDialogOpen(false);
				router.refresh();
			}
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
			setImageError(msg);
		} finally {
			setIsSavingImage(false);
		}
	};

	// Change Password Instantly
	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordError(null);
		setPasswordSuccess(null);

		if (!currentPassword) {
			setPasswordError('Current password is required.');
			return;
		}

		if (newPassword.length < 6) {
			setPasswordError('Password must be at least 6 characters long.');
			return;
		}

		if (!/[A-Z]/.test(newPassword)) {
			setPasswordError('Password must contain at least one uppercase letter.');
			return;
		}

		if (!/[a-z]/.test(newPassword)) {
			setPasswordError('Password must contain at least one lowercase letter.');
			return;
		}

		if (newPassword !== confirmPassword) {
			setPasswordError('New password and confirmation do not match.');
			return;
		}

		setIsSavingPassword(true);
		try {
			const res = await changePassword({
				currentPassword,
				newPassword,
				revokeOtherSessions: false,
			});

			if (res?.error) {
				setPasswordError(res.error.message || 'Failed to update password. Check your current password.');
			} else {
				setPasswordSuccess('Password updated successfully.');
				setCurrentPassword('');
				setNewPassword('');
				setConfirmPassword('');
			}
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'Failed to update password.';
			setPasswordError(msg);
		} finally {
			setIsSavingPassword(false);
		}
	};

	// Loading Skeleton
	if (isPending) {
		return (
			<div className="container py-8 sm:py-12">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
					<div className="hidden md:block md:col-span-4 lg:col-span-3 space-y-4">
						<div className="rounded-2xl bg-secondary/50 p-5 space-y-4 animate-pulse shadow-sm dark:shadow-none">
							<div className="flex items-center gap-3">
								<Skeleton className="size-12 rounded-full" />
								<div className="space-y-1.5 flex-1">
									<Skeleton className="h-4 w-28 rounded" />
									<Skeleton className="h-3 w-36 rounded" />
								</div>
							</div>
							<div className="space-y-2 pt-2">
								<Skeleton className="h-9 w-full rounded-lg" />
								<Skeleton className="h-9 w-full rounded-lg" />
								<Skeleton className="h-9 w-full rounded-lg" />
							</div>
						</div>
					</div>

					<div className="w-full md:col-span-8 lg:col-span-9 space-y-6">
						<div className="flex md:hidden h-10 w-full rounded-xl bg-secondary/50 animate-pulse" />
						<div className="rounded-2xl bg-secondary/50 p-6 sm:p-8 space-y-6 animate-pulse shadow-sm dark:shadow-none">
							<div className="flex items-center gap-5">
								<Skeleton className="size-24 rounded-full" />
								<div className="space-y-2 flex-1">
									<Skeleton className="h-6 w-48 rounded" />
									<Skeleton className="h-4 w-36 rounded" />
								</div>
							</div>
						</div>
						<div className="rounded-2xl bg-secondary/50 p-6 sm:p-8 space-y-4 animate-pulse shadow-sm dark:shadow-none">
							<Skeleton className="h-6 w-40 rounded" />
							<Skeleton className="h-10 w-full rounded-lg" />
							<Skeleton className="h-10 w-full rounded-lg" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Unauthenticated State
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
				<Button asChild variant="default" className="w-full">
					<Link href="/login">Sign in</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="container py-8 sm:py-12">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
				{/* Left Sidebar (Desktop) */}
				<aside className="hidden md:block md:col-span-4 lg:col-span-3 space-y-4 md:sticky md:top-24">
					{/* Sidebar Card */}
					<div className="rounded-2xl bg-secondary/60 p-4 sm:p-5 space-y-5 shadow-sm dark:shadow-none">
						{/* User Summary */}
						<div className="flex items-center gap-3">
							<Avatar className="size-12 shrink-0">
								{user.image ? <AvatarImage src={user.image} alt={user.name || 'User'} /> : null}
								<AvatarFallback className="text-sm font-semibold">{getUserInitials(user.name)}</AvatarFallback>
							</Avatar>
							<div className="min-w-0 flex-1">
								<p className="text-sm font-semibold text-foreground truncate">{user.name || 'Creator'}</p>
								<p className="text-xs text-muted-foreground truncate">{user.email}</p>
							</div>
						</div>

						<Separator />

						{/* Section Navigation */}
						<div className="space-y-1">
							<button type="button" onClick={() => setActiveSection('profile')} className={cn('flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer text-left', activeSection === 'profile' ? 'bg-foreground/10 text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5')}>
								<UserIcon className="size-4 shrink-0" />
								<span>Account Settings</span>
							</button>

							<button type="button" onClick={() => setActiveSection('security')} className={cn('flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer text-left', activeSection === 'security' ? 'bg-foreground/10 text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5')}>
								<KeyRound className="size-4 shrink-0" />
								<span>Update Password</span>
							</button>
						</div>

						<Separator />

						{/* Quick Links */}
						<div className="space-y-1">
							<Link href="/my-bookings" className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
								<Calendar className="size-4 shrink-0" />
								<span>My Bookings</span>
							</Link>

							<Link href="/my-listings" className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
								<Building2 className="size-4 shrink-0" />
								<span>My Studio Listings</span>
							</Link>

							<Link href="/add-studio" className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
								<PlusCircle className="size-4 shrink-0" />
								<span>Host My Studio</span>
							</Link>

							<Link href="/studios" className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
								<Compass className="size-4 shrink-0" />
								<span>Browse Spaces</span>
							</Link>
						</div>

						<Separator />

						{/* Sign Out Action */}
						<Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start gap-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 cursor-pointer">
							<LogOut className="size-4 shrink-0" />
							<span>Sign out</span>
						</Button>
					</div>
				</aside>

				{/* Main Content */}
				<main className="w-full md:col-span-8 lg:col-span-9 space-y-6 sm:space-y-8">
					{/* Mobile Segmented Tab Switcher */}
					<div className="flex md:hidden items-center p-1 rounded-xl bg-secondary/80 gap-1 shadow-sm dark:shadow-none">
						<button type="button" onClick={() => setActiveSection('profile')} className={cn('flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer', activeSection === 'profile' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
							<UserIcon className="size-3.5" />
							<span>Account Settings</span>
						</button>

						<button type="button" onClick={() => setActiveSection('security')} className={cn('flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer', activeSection === 'security' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
							<KeyRound className="size-3.5" />
							<span>Update Password</span>
						</button>
					</div>
					{activeSection === 'profile' ? (
						<>
							{/* Section Header */}
							<div className="space-y-1">
								<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Profile Information</h1>
							</div>

							{/* Profile Card */}
							<div className="rounded-2xl bg-secondary/60 p-6 sm:p-8 space-y-8 shadow-sm dark:shadow-none">
								{/* Avatar & Basic Info */}
								<div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
									{/* Avatar with Camera Hover Overlay */}
									<div
										role="button"
										tabIndex={0}
										onClick={() => {
											setImageInput(user.image || '');
											setImageError(null);
											setIsImageDialogOpen(true);
										}}
										onKeyDown={e => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												setImageInput(user.image || '');
												setImageError(null);
												setIsImageDialogOpen(true);
											}
										}}
										aria-label="Change profile picture"
										className="relative group size-24 sm:size-28 rounded-full overflow-hidden cursor-pointer select-none shrink-0"
									>
										<Avatar className="size-full">
											{user.image ? <AvatarImage src={user.image} alt={user.name || 'User avatar'} /> : null}
											<AvatarFallback className="text-2xl font-bold">{getUserInitials(user.name)}</AvatarFallback>
										</Avatar>

										{/* Camera Hover Overlay */}
										<div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200">
											<Camera className="size-6 text-white" />
											<span className="text-[11px] font-semibold text-white tracking-wide mt-1">Change</span>
										</div>
									</div>

									{/* Name & Badges */}
									<div className="space-y-1.5 flex-1 min-w-0">
										<h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground truncate">{user.name || 'Creator'}</h2>
										<p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 truncate">
											<Mail className="size-4 shrink-0" />
											<span>{user.email}</span>
										</p>
									</div>
								</div>

								<Separator />

								{/* Identity Fields Grid */}
								<div className="space-y-4">
									<h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Account Credentials</h3>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										{/* Full Name Row */}
										<div className="rounded-xl bg-background dark:bg-background/50 p-4 space-y-1.5 flex items-center justify-between">
											<div className="min-w-0 flex-1 pr-3">
												<p className="text-xs font-medium text-muted-foreground">Display Name</p>
												<p className="text-sm font-semibold text-foreground truncate">{user.name || 'Not set'}</p>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													setNameInput(user.name || '');
													setNameError(null);
													setIsNameDialogOpen(true);
												}}
												className="gap-1.5 cursor-pointer shrink-0"
											>
												<Pencil className="size-3.5" />
												<span>Edit</span>
											</Button>
										</div>

										{/* Email Row */}
										<div className="rounded-xl  bg-background dark:bg-background/50 p-4 space-y-1.5 flex items-center justify-between">
											<div className="min-w-0 flex-1">
												<p className="text-xs font-medium text-muted-foreground">Email Address</p>
												<p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
											</div>
											<span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10 text-muted-foreground font-medium shrink-0">Primary</span>
										</div>
									</div>
								</div>
							</div>
						</>
					) : (
						<>
							{/* Section Header */}
							<div className="space-y-1">
								<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Password & Security</h1>
							</div>

							{/* Password Form Card */}
							<div className="rounded-2xl bg-secondary/60 p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none">
								{/* In-UI Status Message */}
								{passwordSuccess && (
									<div role="status" className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
										<CheckCircle2 className="size-4 shrink-0" />
										<span>{passwordSuccess}</span>
									</div>
								)}

								{passwordError && (
									<div role="alert" className="flex items-center gap-2.5 p-3.5 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
										<AlertCircle className="size-4 shrink-0" />
										<span>{passwordError}</span>
									</div>
								)}

								<form onSubmit={handleChangePassword} className="space-y-5 max-w-lg">
									{/* Current Password Field */}
									<div className="space-y-2">
										<label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
											Current Password
										</label>
										<div className="relative">
											<Input id="currentPassword" type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter your current password" className="pr-10  bg-background dark:bg-background/50" required />
											<button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'} className="absolute right-2.5 inset-y-0 my-auto active:translate-y-0 size-7 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer rounded-md transition-colors">
												{showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
											</button>
										</div>
									</div>

									{/* New Password Field */}
									<div className="space-y-2">
										<label htmlFor="newPassword" className="text-sm font-medium text-foreground">
											New Password
										</label>
										<div className="relative">
											<Input id="newPassword" type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 6 characters" className="pr-10  bg-background dark:bg-background/50" required />
											<button type="button" onClick={() => setShowNewPassword(!showNewPassword)} aria-label={showNewPassword ? 'Hide new password' : 'Show new password'} className="absolute right-2.5 inset-y-0 my-auto active:translate-y-0 size-7 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer rounded-md transition-colors">
												{showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
											</button>
										</div>
										<p className="text-xs text-muted-foreground">Must be at least 6 characters with at least one uppercase and one lowercase letter.</p>
									</div>

									{/* Confirm New Password Field */}
									<div className="space-y-2">
										<label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
											Confirm New Password
										</label>
										<div className="relative">
											<Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat your new password" className="pr-10  bg-background dark:bg-background/50" required />
											<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} className="absolute right-2.5 inset-y-0 my-auto active:translate-y-0 size-7 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer rounded-md transition-colors">
												{showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
											</button>
										</div>
									</div>

									<Button type="submit" variant="default" disabled={isSavingPassword} className="w-full sm:w-auto gap-2">
										{isSavingPassword ? (
											<>
												<Loader2 className="size-4 animate-spin" />
												<span>Updating Password...</span>
											</>
										) : (
											<span>Update Password</span>
										)}
									</Button>
								</form>
							</div>
						</>
					)}

					{/* Mobile Quick Links & Sign Out */}
					<div className="block md:hidden rounded-2xl bg-secondary/60 p-4 space-y-3 shadow-sm dark:shadow-none">
						<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Quick Navigation</p>
						<div className="space-y-1">
							<Link href="/my-bookings" className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
								<Calendar className="size-4 shrink-0" />
								<span>My Bookings</span>
							</Link>

							<Link href="/my-listings" className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
								<Building2 className="size-4 shrink-0" />
								<span>My Studio Listings</span>
							</Link>

							<Link href="/add-studio" className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
								<PlusCircle className="size-4 shrink-0" />
								<span>Host My Studio</span>
							</Link>

							<Link href="/studios" className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
								<Compass className="size-4 shrink-0" />
								<span>Browse Spaces</span>
							</Link>
						</div>

						<Separator />

						<Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start gap-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 cursor-pointer">
							<LogOut className="size-4 shrink-0" />
							<span>Sign out</span>
						</Button>
					</div>
				</main>
			</div>

			{/* Modal Dialog: Update Profile Picture */}
			<Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Update Profile Picture</DialogTitle>
						<DialogDescription>Enter a public image URL (e.g. from ImgBB, Unsplash, or GitHub) to update your avatar.</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSaveImage} className="space-y-4">
						{imageError && (
							<div role="alert" className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
								<AlertCircle className="size-4 shrink-0" />
								<span>{imageError}</span>
							</div>
						)}

						{/* Preview */}
						<div className="flex items-center justify-center py-2">
							<Avatar className="size-20 ring-2 ring-primary/20">
								{imageInput.trim() ? <AvatarImage src={imageInput.trim()} alt="Avatar preview" /> : user.image ? <AvatarImage src={user.image} alt="Current avatar" /> : null}
								<AvatarFallback className="text-xl font-bold">{getUserInitials(user.name)}</AvatarFallback>
							</Avatar>
						</div>

						<div className="space-y-2">
							<label htmlFor="imageUrl" className="text-sm font-medium text-foreground">
								Image URL
							</label>
							<Input id="imageUrl" type="url" value={imageInput} onChange={e => setImageInput(e.target.value)} placeholder="https://example.com/avatar.jpg" autoFocus />
							<p className="text-xs text-muted-foreground">Leave empty and save to reset your avatar to default initials.</p>
						</div>

						<DialogFooter>
							<DialogClose render={<Button type="button" variant="outline" disabled={isSavingImage} />}>Cancel</DialogClose>
							<Button type="submit" variant="default" disabled={isSavingImage} className="gap-2">
								{isSavingImage ? (
									<>
										<Loader2 className="size-4 animate-spin" />
										<span>Saving...</span>
									</>
								) : (
									<span>Save Picture</span>
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Modal Dialog: Update Display Name */}
			<Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Update Display Name</DialogTitle>
						<DialogDescription>This name is visible to studio hosts, creators, and across your bookings.</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSaveName} className="space-y-4">
						{nameError && (
							<div role="alert" className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
								<AlertCircle className="size-4 shrink-0" />
								<span>{nameError}</span>
							</div>
						)}

						<div className="space-y-2">
							<label htmlFor="displayName" className="text-sm font-medium text-foreground">
								Full Name
							</label>
							<Input id="displayName" type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="Enter your full name" required autoFocus />
						</div>

						<DialogFooter>
							<DialogClose render={<Button type="button" variant="outline" disabled={isSavingName} />}>Cancel</DialogClose>
							<Button type="submit" variant="default" disabled={isSavingName} className="gap-2">
								{isSavingName ? (
									<>
										<Loader2 className="size-4 animate-spin" />
										<span>Saving...</span>
									</>
								) : (
									<span>Save Name</span>
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}

