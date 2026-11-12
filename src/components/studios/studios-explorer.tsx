'use client';

import { ChevronDown, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import type { Studio, StudioCategory } from '@/types';
import { StudioCard, StudioCardSkeleton } from '@/components/studios/studio-card';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { StudioBreadcrumb } from '@/components/studios/studio-breadcrumb';
import { cn } from '@/lib/utils';

export const CATEGORIES: (StudioCategory | 'All')[] = ['All', 'Photo Studio', 'Sound Stage', 'Podcast Lounge', 'Music Suite', 'Art Workshop', 'Exhibition Hall'];

export interface SortOption {
	id: 'newest' | 'featured' | 'rating' | 'price-asc' | 'price-desc';
	label: string;
}

const SORT_OPTIONS: SortOption[] = [
	{ id: 'newest', label: 'Newest' },
	{ id: 'featured', label: 'Featured' },
	{ id: 'rating', label: 'Top Rated' },
	{ id: 'price-asc', label: 'Price: Low to High' },
	{ id: 'price-desc', label: 'Price: High to Low' },
];

const PAGE_SIZE = 12;
const MIN_PRICE = 20;
const MAX_PRICE = 400;
const PRICE_STEP = 10;

export function StudiosExplorer() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Read state from URL query parameters
	const paramCategory = searchParams.get('category');
	const selectedCategory = useMemo<StudioCategory | 'All'>(() => {
		return paramCategory && CATEGORIES.includes(paramCategory as StudioCategory) ? (paramCategory as StudioCategory) : 'All';
	}, [paramCategory]);

	const paramSearch = searchParams.get('search') || '';
	const paramSort = searchParams.get('sort') as SortOption['id'] | null;
	const selectedSort = useMemo<SortOption['id']>(() => {
		return paramSort && SORT_OPTIONS.some(o => o.id === paramSort) ? paramSort : 'newest';
	}, [paramSort]);

	const paramMinPrice = searchParams.get('minPrice');
	const paramMaxPrice = searchParams.get('maxPrice');
	const priceRange = useMemo<[number, number] | null>(() => {
		if (paramMinPrice !== null && paramMaxPrice !== null) {
			const min = Number(paramMinPrice);
			const max = Number(paramMaxPrice);
			if (!isNaN(min) && !isNaN(max)) return [min, max];
		}
		return null;
	}, [paramMinPrice, paramMaxPrice]);

	const paramPage = searchParams.get('page');
	const currentPage = useMemo(() => {
		const parsed = parseInt(paramPage || '1', 10);
		return isNaN(parsed) || parsed < 1 ? 1 : parsed;
	}, [paramPage]);

	// Local UI states
	const [studios, setStudios] = useState<Studio[]>([]);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [prevParamsKey, setPrevParamsKey] = useState('');

	// Adjust searchInput state when URL query changes (React official render adjustment)
	const [prevParamSearch, setPrevParamSearch] = useState(paramSearch);
	const [searchInput, setSearchInput] = useState(paramSearch);
	if (paramSearch !== prevParamSearch) {
		setPrevParamSearch(paramSearch);
		setSearchInput(paramSearch);
	}

	// Adjust sliderRange state when URL price query changes
	const [prevPriceRange, setPrevPriceRange] = useState(priceRange);
	const [sliderRange, setSliderRange] = useState<[number, number] | null>(priceRange);
	if (priceRange !== prevPriceRange) {
		setPrevPriceRange(priceRange);
		setSliderRange(priceRange);
	}

	const [isFilterOpen, setIsFilterOpen] = useState(false);

	// Central URL query updater
	const updateUrl = useCallback(
		(updates: { category?: StudioCategory | 'All'; search?: string; sort?: SortOption['id']; minPrice?: number | null; maxPrice?: number | null; page?: number }) => {
			const params = new URLSearchParams(searchParams.toString());

			if (updates.category !== undefined) {
				if (updates.category === 'All') params.delete('category');
				else params.set('category', updates.category);
			}

			if (updates.search !== undefined) {
				const trimmed = updates.search.trim();
				if (!trimmed) params.delete('search');
				else params.set('search', trimmed);
			}

			if (updates.sort !== undefined) {
				if (updates.sort === 'newest') params.delete('sort');
				else params.set('sort', updates.sort);
			}

			if (updates.minPrice !== undefined || updates.maxPrice !== undefined) {
				if (updates.minPrice === null || updates.maxPrice === null) {
					params.delete('minPrice');
					params.delete('maxPrice');
				} else {
					if (updates.minPrice !== undefined) params.set('minPrice', String(updates.minPrice));
					if (updates.maxPrice !== undefined) params.set('maxPrice', String(updates.maxPrice));
				}
			}

			if (updates.page !== undefined) {
				if (updates.page <= 1) params.delete('page');
				else params.set('page', String(updates.page));
			}

			const queryString = params.toString();
			const newUrl = queryString ? `/studios?${queryString}` : '/studios';
			router.replace(newUrl, { scroll: false });
		},
		[searchParams, router],
	);

	// Debounce slider changes to update URL
	useEffect(() => {
		if (!sliderRange) return;
		const timer = setTimeout(() => {
			if (priceRange?.[0] !== sliderRange[0] || priceRange?.[1] !== sliderRange[1]) {
				updateUrl({
					minPrice: sliderRange[0],
					maxPrice: sliderRange[1],
					page: 1,
				});
			}
		}, 350);
		return () => clearTimeout(timer);
	}, [sliderRange, priceRange, updateUrl]);

	// Fetch Studios from Backend when URL Query Parameters Change
	const currentParamsKey = `${selectedCategory}-${paramSearch}-${selectedSort}-${priceRange?.[0]}-${priceRange?.[1]}-${currentPage}`;

	useEffect(() => {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
		const params = new URLSearchParams();

		if (selectedCategory !== 'All') {
			params.set('category', selectedCategory);
		}
		if (paramSearch.trim()) {
			params.set('search', paramSearch.trim());
		}
		if (selectedSort && selectedSort !== 'newest') {
			params.set('sort', selectedSort);
		}
		if (priceRange) {
			params.set('minPrice', String(priceRange[0]));
			params.set('maxPrice', String(priceRange[1]));
		}
		params.set('page', String(currentPage));
		params.set('limit', String(PAGE_SIZE));

		const endpoint = `${apiUrl}/api/studios?${params.toString()}`;

		let isMounted = true;

		fetch(endpoint)
			.then(res => {
				if (!res.ok) throw new Error('Failed to fetch studios');
				return res.json();
			})
			.then(json => {
				if (!isMounted) return;
				const list: Studio[] = Array.isArray(json) ? json : json.data || json.studios || [];
				setStudios(list);

				if (json && typeof json === 'object') {
					if (typeof json.totalPages === 'number') {
						setTotalPages(Math.max(1, json.totalPages));
					} else if (typeof json.totalCount === 'number') {
						setTotalPages(Math.max(1, Math.ceil(json.totalCount / PAGE_SIZE)));
					} else {
						setTotalPages(Math.max(1, Math.ceil(list.length / PAGE_SIZE)));
					}
				}
			})
			.catch(err => {
				if (isMounted) {
					console.error('Failed to fetch studios from backend:', err);
					setStudios([]);
					setTotalPages(1);
				}
			})
			.finally(() => {
				if (isMounted) {
					setLoading(false);
					setPrevParamsKey(currentParamsKey);
				}
			});

		return () => {
			isMounted = false;
		};
	}, [selectedCategory, paramSearch, selectedSort, priceRange, currentPage, currentParamsKey]);

	const currentPriceRange = useMemo<[number, number]>(() => {
		if (sliderRange) return sliderRange;
		if (priceRange) return priceRange;
		return [MIN_PRICE, MAX_PRICE];
	}, [sliderRange, priceRange]);

	const hasNextPage = currentPage < totalPages;
	const isDataLoading = loading || prevParamsKey !== currentParamsKey;

	// Handle Category Change
	const handleCategoryChange = (category: StudioCategory | 'All') => {
		updateUrl({ category, page: 1 });
	};

	// Handle Search Form Submit
	const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		updateUrl({ search: searchInput, page: 1 });
	};

	const handleClearSearch = () => {
		setSearchInput('');
		updateUrl({ search: '', page: 1 });
	};

	const handleSortChange = (sortId: SortOption['id']) => {
		updateUrl({ sort: sortId, page: 1 });
	};

	const handlePriceChange = (value: number | readonly number[]) => {
		if (Array.isArray(value) && value.length === 2) {
			setSliderRange([value[0], value[1]]);
		}
	};

	const handleResetFilters = () => {
		setSearchInput('');
		setSliderRange(null);
		router.replace('/studios', { scroll: false });
	};

	const handlePageChange = (page: number) => {
		if (page < 1 || page > totalPages) return;
		updateUrl({ page });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const currentSortLabel = SORT_OPTIONS.find(s => s.id === selectedSort)?.label || 'Newest';

	return (
		<div className="container pt-3 sm:pt-4 lg:pt-6 pb-8 sm:pb-10 lg:pb-12 space-y-6 sm:space-y-8">
			{/* Breadcrumbs */}
			<StudioBreadcrumb category={selectedCategory} />

			{/* Search Bar & Filter Controls */}
			<div className="space-y-3">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
					{/* Search Bar */}
					<form onSubmit={handleSearchSubmit} className="relative flex-1 flex items-center">
						<div className="relative flex-1 flex items-center bg-secondary/80 border border-border/40 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 transition-all overflow-hidden rounded-full">
							<Input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search by title, city, or equipment..." className="h-10 sm:h-11 border-0 bg-transparent px-4 pr-10 text-sm focus-visible:ring-0 shadow-none rounded-none" aria-label="Search studios" />
							{searchInput && (
								<Button type="button" variant="ghost" size="icon-xs" onClick={handleClearSearch} className="absolute right-16 text-muted-foreground hover:text-foreground hover:bg-transparent" aria-label="Clear search query">
									<X className="size-5" />
								</Button>
							)}
							<Button flat3d type="submit" variant="ghost" shape="none" className="h-10 sm:h-11 px-4 sm:px-5 bg-foreground/5 hover:bg-foreground/10 border-0 border-l border-border/40 text-muted-foreground hover:text-foreground shrink-0 rounded-none shadow-none" aria-label="Submit search">
								<Search className="size-4" />
							</Button>
						</div>
					</form>

					{/* Filter Toggle */}
					<Button type="button" variant="secondary" flat3d onClick={() => setIsFilterOpen(prev => !prev)} className="h-10 sm:h-11 px-4 gap-2 shrink-0 text-xs sm:text-sm font-medium border border-border/40 rounded-full" aria-expanded={isFilterOpen}>
						<SlidersHorizontal className="size-3.5 sm:size-4" />
						<span className="truncate max-w-45 sm:max-w-none">
							{selectedCategory === 'All' ? 'All Spaces' : selectedCategory} / {currentSortLabel}
						</span>
						<ChevronDown className={cn('size-3.5 transition-transform duration-200', isFilterOpen && 'rotate-180')} />
					</Button>
				</div>

				{/* Filter Panel */}
				{isFilterOpen && (
					<div className="rounded-2xl bg-secondary/35 dark:bg-card/25 p-4 sm:p-6 space-y-5 border border-border/40 transition-all">
						{/* Categories */}
						<div className="space-y-2">
							<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
							<div className="flex flex-wrap items-center gap-2">
								{CATEGORIES.map(category => {
									const isActive = selectedCategory === category;
									return (
										<Button key={category} type="button" flat3d size="sm" variant="secondary" onClick={() => handleCategoryChange(category)} className={cn('text-xs sm:text-sm font-medium transition-colors', isActive ? 'bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-xs' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80')}>
											{category === 'All' ? 'All' : category}
										</Button>
									);
								})}
							</div>
						</div>

						{/* Sort & Price */}
						<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-2 border-t border-border/40">
							{/* Sort Options */}
							<div className="space-y-2">
								<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort By</span>
								<div className="flex flex-wrap items-center gap-2">
									{SORT_OPTIONS.map(opt => {
										const isActive = selectedSort === opt.id;
										return (
											<Button key={opt.id} type="button" flat3d size="sm" variant="secondary" onClick={() => handleSortChange(opt.id)} className={cn('text-xs sm:text-sm font-medium transition-colors', isActive ? 'bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-xs' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80')}>
												{opt.label}
											</Button>
										);
									})}
								</div>
							</div>

							{/* Price Slider */}
							<div className="space-y-2.5 w-full lg:w-80 shrink-0">
								<div className="flex items-center justify-between text-xs sm:text-sm">
									<span className="font-semibold text-foreground">Hourly Rate</span>
									<span className="text-muted-foreground font-medium">
										${currentPriceRange[0]} – ${currentPriceRange[1]} / hr
									</span>
								</div>
								<Slider min={MIN_PRICE} max={MAX_PRICE} step={PRICE_STEP} value={currentPriceRange} onValueChange={handlePriceChange} className="py-1" />
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Studio Grid */}
			{isDataLoading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-7 gap-y-10 sm:gap-y-12">
					{Array.from({ length: PAGE_SIZE }).map((_, i) => (
						<StudioCardSkeleton key={i} />
					))}
				</div>
			) : studios.length > 0 ? (
				<div className="space-y-10 sm:space-y-12">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-7 gap-y-10 sm:gap-y-12">
						{studios.map((studio, index) => (
							<StudioCard key={studio._id} studio={studio} priority={index < 3} />
						))}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-center pt-4 sm:pt-6">
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} />
									</PaginationItem>

									{currentPage > 1 && (
										<PaginationItem>
											<PaginationLink onClick={() => handlePageChange(currentPage - 1)}>{currentPage - 1}</PaginationLink>
										</PaginationItem>
									)}

									<PaginationItem>
										<PaginationLink isActive onClick={() => handlePageChange(currentPage)}>
											{currentPage}
										</PaginationLink>
									</PaginationItem>

									{hasNextPage && (
										<PaginationItem>
											<PaginationLink onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 1}</PaginationLink>
										</PaginationItem>
									)}

									<PaginationItem>
										<PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNextPage} />
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					)}
				</div>
			) : (
				/* Empty State */
				<div className="rounded-3xl bg-secondary/35 dark:bg-card/25 p-12 sm:p-16 text-center space-y-4 max-w-xl mx-auto">
					<div className="size-14 rounded-2xl bg-secondary/70 dark:bg-card mx-auto flex items-center justify-center text-muted-foreground">
						<SlidersHorizontal className="size-6" />
					</div>
					<div className="space-y-1.5">
						<h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">No Spaces Match Criteria</h3>
						<p className="text-sm text-muted-foreground font-body">No production workspaces found matching your search and filter parameters. Try adjusting keywords, price, or category.</p>
					</div>
					<div className="pt-2">
						<Button type="button" flat3d variant="default" onClick={handleResetFilters} className="gap-2">
							<RotateCcw className="size-4" />
							<span>Reset Filters</span>
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

