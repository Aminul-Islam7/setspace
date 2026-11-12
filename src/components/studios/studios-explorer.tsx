'use client';

import { ChevronDown, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import type { Studio, StudioCategory } from '@/types';
import { StudioCard, StudioCardSkeleton } from '@/components/studios/studio-card';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { StudioBreadcrumb } from '@/components/studios/studio-breadcrumb';
import { cn } from '@/lib/utils';

const CATEGORIES: (StudioCategory | 'All')[] = ['All', 'Photo Studio', 'Sound Stage', 'Podcast Lounge', 'Music Suite', 'Art Workshop', 'Exhibition Hall'];

interface SortOption {
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

export function StudiosExplorer() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [rawStudios, setRawStudios] = useState<Studio[]>([]);
	const [loading, setLoading] = useState(true);

	const paramCategory = searchParams.get('category');
	const selectedCategory = useMemo<StudioCategory | 'All'>(() => {
		return paramCategory && CATEGORIES.includes(paramCategory as StudioCategory) ? (paramCategory as StudioCategory) : 'All';
	}, [paramCategory]);

	// Search & Filter State
	const [searchInput, setSearchInput] = useState('');
	const [submittedSearch, setSubmittedSearch] = useState('');
	const [selectedSort, setSelectedSort] = useState<SortOption['id']>('newest');
	const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	// Initial data fetch from API
	useEffect(() => {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL;
		const endpoint = `${apiUrl}/api/studios?limit=100`;

		let isMounted = true;

		fetch(endpoint)
			.then(res => {
				if (!res.ok) throw new Error('Failed to fetch studios');
				return res.json();
			})
			.then(data => {
				if (isMounted) {
					const list: Studio[] = Array.isArray(data) ? data : data.studios || [];
					setRawStudios(list);
				}
			})
			.catch(() => {
				if (isMounted) {
					setRawStudios([]);
				}
			})
			.finally(() => {
				if (isMounted) setLoading(false);
			});

		return () => {
			isMounted = false;
		};
	}, []);

	// Category-scoped studios for dynamic bounds
	const categoryStudios = useMemo(() => {
		if (selectedCategory === 'All') return rawStudios;
		return rawStudios.filter(s => s.category === selectedCategory);
	}, [rawStudios, selectedCategory]);

	// Dynamic Min/Max Hourly Rate Bounds from Currently Available Studios
	const { minAvailableRate, maxAvailableRate } = useMemo(() => {
		const rates = categoryStudios.map(s => s.hourlyRate).filter((r): r is number => typeof r === 'number' && !isNaN(r));
		if (rates.length === 0) {
			return { minAvailableRate: 0, maxAvailableRate: 350 };
		}
		const min = Math.min(...rates);
		const max = Math.max(...rates);
		return {
			minAvailableRate: min,
			maxAvailableRate: max === min ? min + 10 : max,
		};
	}, [categoryStudios]);

	const currentPriceRange = useMemo<[number, number]>(() => {
		if (!priceRange) {
			return [minAvailableRate, maxAvailableRate];
		}
		return [Math.max(minAvailableRate, Math.min(priceRange[0], maxAvailableRate)), Math.min(maxAvailableRate, Math.max(priceRange[1], minAvailableRate))];
	}, [priceRange, minAvailableRate, maxAvailableRate]);

	// Filter and Sort Studios
	const filteredStudios = useMemo(() => {
		let result = [...categoryStudios];

		// Search Filter
		if (submittedSearch.trim()) {
			const term = submittedSearch.trim().toLowerCase();
			result = result.filter(s => s.title.toLowerCase().includes(term) || s.location.toLowerCase().includes(term) || s.description.toLowerCase().includes(term) || (s.amenities && s.amenities.some(a => a.toLowerCase().includes(term))));
		}

		// Price Filter
		if (priceRange) {
			result = result.filter(s => s.hourlyRate >= priceRange[0] && s.hourlyRate <= priceRange[1]);
		}

		// Sort
		if (selectedSort === 'price-asc') {
			result.sort((a, b) => a.hourlyRate - b.hourlyRate);
		} else if (selectedSort === 'price-desc') {
			result.sort((a, b) => b.hourlyRate - a.hourlyRate);
		} else if (selectedSort === 'rating') {
			result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
		} else if (selectedSort === 'featured') {
			result.sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0));
		} else {
			// newest
			result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
		}

		return result;
	}, [categoryStudios, submittedSearch, priceRange, selectedSort]);

	// Pagination
	const totalPages = Math.ceil(filteredStudios.length / PAGE_SIZE);
	const paginatedStudios = useMemo(() => {
		const start = (currentPage - 1) * PAGE_SIZE;
		return filteredStudios.slice(start, start + PAGE_SIZE);
	}, [filteredStudios, currentPage]);

	const hasNextPage = currentPage < totalPages;

	// Handle Category Change
	const handleCategoryChange = (category: StudioCategory | 'All') => {
		setCurrentPage(1);
		const params = new URLSearchParams(searchParams.toString());
		if (category === 'All') {
			params.delete('category');
		} else {
			params.set('category', category);
		}
		const newUrl = params.toString() ? `/studios?${params.toString()}` : '/studios';
		router.replace(newUrl, { scroll: false });
	};

	// Handle Search Form Submit
	const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSubmittedSearch(searchInput.trim());
		setCurrentPage(1);
	};

	const handleClearSearch = () => {
		setSearchInput('');
		setSubmittedSearch('');
		setCurrentPage(1);
	};

	const handleSortChange = (sortId: SortOption['id']) => {
		setSelectedSort(sortId);
		setCurrentPage(1);
	};

	const handlePriceChange = (value: number | readonly number[]) => {
		if (Array.isArray(value) && value.length === 2) {
			setPriceRange([value[0], value[1]]);
			setCurrentPage(1);
		}
	};

	const handleResetFilters = () => {
		setSearchInput('');
		setSubmittedSearch('');
		setSelectedSort('newest');
		setPriceRange(null);
		setCurrentPage(1);
		router.replace('/studios', { scroll: false });
	};

	const handlePageChange = (page: number) => {
		if (page < 1 || page > totalPages) return;
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const currentSortLabel = SORT_OPTIONS.find(s => s.id === selectedSort)?.label || 'Newest';
	const isPriceFiltered = priceRange !== null;
	const hasActiveFilters = selectedCategory !== 'All' || Boolean(submittedSearch) || selectedSort !== 'newest' || isPriceFiltered;

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
								<Slider min={minAvailableRate} max={maxAvailableRate} step={5} value={currentPriceRange} onValueChange={handlePriceChange} className="py-1" />
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Studio Grid */}
			{loading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-7 gap-y-10 sm:gap-y-12">
					{Array.from({ length: PAGE_SIZE }).map((_, i) => (
						<StudioCardSkeleton key={i} />
					))}
				</div>
			) : paginatedStudios.length > 0 ? (
				<div className="space-y-10 sm:space-y-12">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-7 gap-y-10 sm:gap-y-12">
						{paginatedStudios.map((studio, index) => (
							<StudioCard key={studio._id} studio={studio} priority={index < 3} />
						))}
					</div>

					{/* Pagination */}
					{(currentPage > 1 || hasNextPage) && (
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

