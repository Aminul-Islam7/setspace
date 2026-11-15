'use client';

import type { ApiResponse, Studio } from '@/types';
import { Building2, ExternalLink, Image as ImageIcon, MapPin, Pencil, Plus, Search, Trash2, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DeleteStudioDialog } from './delete-studio-dialog';
import { FaStar } from 'react-icons/fa6';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { isImgbbUrl } from '@/components/studios/create/types';
import { useSession } from '@/lib/auth-client';

export function MyListingsView() {
	const { data: session, isPending: isSessionPending } = useSession();
	const user = session?.user;
	const userEmail = user?.email;

	const [studios, setStudios] = useState<Studio[]>([]);
	const [isFetching, setIsFetching] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [studioToDelete, setStudioToDelete] = useState<Studio | null>(null);
	const [reloadKey, setReloadKey] = useState(0);

	useEffect(() => {
		if (!userEmail) return;

		let isMounted = true;
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

		fetch(`${apiUrl}/api/users/me/studios?email=${encodeURIComponent(userEmail)}`, {
			headers: { 'x-user-email': userEmail },
			cache: 'no-store',
		})
			.then(res => {
				if (res.ok) {
					return res.json() as Promise<ApiResponse<Studio[]>>;
				}
				// Fallback to studios list matching owner email
				return fetch(`${apiUrl}/api/studios?limit=100`, { cache: 'no-store' })
					.then(fallbackRes => {
						if (!fallbackRes.ok) throw new Error('Failed to load your studio listings.');
						return fallbackRes.json();
					})
					.then(json => {
						const list: Studio[] = json.data || [];
						return {
							success: true,
							data: list.filter(s => s.ownerEmail?.toLowerCase() === userEmail.toLowerCase()),
						} as ApiResponse<Studio[]>;
					});
			})
			.then(json => {
				if (isMounted) {
					setStudios(Array.isArray(json.data) ? json.data : []);
					setError(null);
				}
			})
			.catch(err => {
				if (isMounted) {
					console.error('Error loading my studios:', err);
					setError(err instanceof Error ? err.message : 'Failed to load your studio listings.');
				}
			})
			.finally(() => {
				if (isMounted) {
					setIsFetching(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, [userEmail, reloadKey]);

	const handleRetry = () => {
		setIsFetching(true);
		setError(null);
		setReloadKey(k => k + 1);
	};

	const isPageLoading = isSessionPending || (Boolean(userEmail) && isFetching);

	const handleStudioDeleted = (deletedId: string) => {
		setStudios(prev => prev.filter(s => s._id !== deletedId));
	};

	// Filtered Studios
	const filteredStudios = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return studios;
		return studios.filter(s => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.location.toLowerCase().includes(q));
	}, [studios, searchQuery]);

	if (isPageLoading) {
		return <MyListingsSkeletonContent />;
	}

	return (
		<div className="space-y-6 sm:space-y-8">
			{/* Search & Actions Bar */}
			<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Filter your listings by title, category, or city..." className="pl-10" />
				</div>

				<Button variant="default" render={<Link href="/studios/create" />} className="shrink-0 font-medium">
					<Plus className="size-4" />
					<span>Add New Studio</span>
				</Button>
			</div>

			{/* Error State */}
			{error && (
				<div className="p-4 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-between">
					<p className="text-sm font-medium">{error}</p>
					<Button variant="outline" size="sm" onClick={handleRetry}>
						Retry
					</Button>
				</div>
			)}

			{/* Listings List */}
			{filteredStudios.length > 0 ? (
				<div className="space-y-4">
					{filteredStudios.map(studio => {
						const hasValidImage = isImgbbUrl(studio.image);

						return (
							<article key={studio._id} className="rounded-2xl bg-secondary p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch md:items-center justify-between">
								{/* Left: Thumbnail & Details */}
								<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 min-w-0">
									{/* Studio Thumbnail */}
									<div className="relative w-full sm:w-44 md:w-48 aspect-video rounded-xl bg-card overflow-hidden shrink-0">
										{hasValidImage ? (
											<Image src={studio.image.trim()} alt={studio.title} fill unoptimized className="object-cover" />
										) : (
											<div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground p-2 text-center">
												<ImageIcon className="size-6 mb-1 opacity-50" />
												<span className="text-[10px]">No image</span>
											</div>
										)}
										<span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-card/90 text-[10px] font-semibold text-foreground backdrop-blur-md">{studio.category}</span>
									</div>

									{/* Text Details */}
									<div className="space-y-1.5 flex-1 min-w-0">
										<h2 className="font-display text-base sm:text-lg font-bold text-foreground line-clamp-1">
											<Link href={`/studios/${studio.slug || studio._id}`} className="hover:text-primary transition-colors">
												{studio.title}
											</Link>
										</h2>

										<div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
											<MapPin className="size-3.5 shrink-0" />
											<span className="truncate">{studio.location}</span>
										</div>

										<div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs sm:text-sm">
											<span className="font-semibold text-foreground">
												${studio.hourlyRate}
												<span className="font-normal text-muted-foreground">/hr</span>
											</span>
											<span className="text-muted-foreground">Deposit: ${studio.securityDeposit || 0}</span>
											<span className="flex items-center gap-1 text-muted-foreground">
												<Users className="size-3.5" />
												<span>{studio.maxCapacity} crew</span>
											</span>
											<span className="flex items-center gap-1 font-medium text-foreground">
												<FaStar className="size-3 text-amber-500" />
												<span>{studio.rating ? studio.rating.toFixed(1) : '5.0'}</span>
												<span className="text-muted-foreground font-normal">({studio.reviewCount || 0})</span>
											</span>
										</div>
									</div>
								</div>

								{/* Right: Actions */}
								<div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border/40 shrink-0">
									<Button variant="outline" size="sm" render={<Link href={`/studios/${studio.slug || studio._id}`} />} className="font-medium" title="View Studio">
										<ExternalLink className="size-3.5" />
										<span className="hidden sm:inline">View</span>
									</Button>

									<Button variant="secondary" size="sm" render={<Link href={`/studios/create`} />} className="font-medium" title="Update Studio">
										<Pencil className="size-3.5" />
										<span className="hidden sm:inline">Edit</span>
									</Button>

									<Button variant="destructive" size="sm" onClick={() => setStudioToDelete(studio)} className="font-medium" title="Delete Studio">
										<Trash2 className="size-3.5" />
										<span className="hidden sm:inline">Delete</span>
									</Button>
								</div>
							</article>
						);
					})}
				</div>
			) : (
				/* Empty State */
				<div className="rounded-2xl bg-secondary p-8 sm:p-12 text-center space-y-4 shadow-xs">
					<div className="size-14 sm:size-16 rounded-2xl bg-card flex items-center justify-center text-muted-foreground mx-auto">
						<Building2 className="size-7 sm:size-8 opacity-60" />
					</div>
					<div className="space-y-1 max-w-md mx-auto">
						<h3 className="font-display text-lg sm:text-xl font-bold text-foreground">{searchQuery ? 'No matching listings found' : 'No Studio Workspaces Listed Yet'}</h3>
						<p className="text-sm text-muted-foreground leading-relaxed">{searchQuery ? 'Try clearing your search query or check for typos.' : 'Host your photo studio, film soundstage, podcast room, or music suite and start booking creator shoots.'}</p>
					</div>
					<div>
						{searchQuery ? (
							<Button variant="outline" onClick={() => setSearchQuery('')}>
								Clear Search
							</Button>
						) : (
							<Button variant="glass" flat3d render={<Link href="/studios/create" />}>
								<Plus className="size-4" />
								<span>List Your First Studio</span>
							</Button>
						)}
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			<DeleteStudioDialog studio={studioToDelete} isOpen={Boolean(studioToDelete)} onClose={() => setStudioToDelete(null)} onDeleted={handleStudioDeleted} />
		</div>
	);
}

export function MyListingsSkeletonContent() {
	return (
		<div className="space-y-6 sm:space-y-8 animate-pulse">
			{/* Search & Action Skeleton */}
			<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
				<div className="h-10 max-w-md w-full bg-secondary rounded-lg" />
				<div className="h-10 w-36 bg-secondary rounded-lg" />
			</div>

			{/* Listing Row Skeletons */}
			<div className="space-y-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="rounded-2xl bg-secondary p-4 sm:p-5 flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch md:items-center justify-between">
						<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
							<div className="w-full sm:w-44 md:w-48 aspect-video rounded-xl bg-card shrink-0" />
							<div className="space-y-2 flex-1">
								<div className="h-5 w-48 bg-card rounded" />
								<div className="h-3 w-32 bg-card rounded" />
								<div className="h-4 w-60 bg-card rounded" />
							</div>
						</div>
						<div className="flex gap-2 shrink-0">
							<div className="h-8 w-16 bg-card rounded-lg" />
							<div className="h-8 w-16 bg-card rounded-lg" />
							<div className="h-8 w-16 bg-card rounded-lg" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

