import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface StudioBreadcrumbProps {
	category?: string | null;
	categoryAsLink?: boolean;
	currentTitle?: string | null;
	className?: string;
}

export function StudioBreadcrumb({
	category,
	categoryAsLink = false,
	currentTitle,
	className,
}: StudioBreadcrumbProps) {
	const hasCategory = category && category !== 'All';

	return (
		<Breadcrumb>
			<BreadcrumbList className={cn('text-xs sm:text-sm', className)}>
				<BreadcrumbItem>
					<BreadcrumbLink render={<Link href="/" />} className="inline-flex items-center" aria-label="Home">
						<Home className="size-3.5 sm:size-4" />
					</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbSeparator />

				<BreadcrumbItem>
					{hasCategory || currentTitle ? (
						<BreadcrumbLink render={<Link href="/studios" />}>Studios</BreadcrumbLink>
					) : (
						<BreadcrumbPage>Studios</BreadcrumbPage>
					)}
				</BreadcrumbItem>

				{hasCategory && (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							{categoryAsLink || currentTitle ? (
								<BreadcrumbLink
									render={<Link href={`/studios?category=${encodeURIComponent(category)}`} />}
									className="font-medium text-foreground/80 truncate max-w-50 sm:max-w-none"
								>
									{category}
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage className="font-medium text-foreground/80 truncate max-w-50 sm:max-w-none">
									{category}
								</BreadcrumbPage>
							)}
						</BreadcrumbItem>
					</>
				)}

				{currentTitle && (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className="font-medium text-foreground/80 truncate max-w-50 sm:max-w-none">
								{currentTitle}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
