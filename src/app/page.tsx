import { CategorySection } from '@/components/home/category-section';
import { FeaturedStudiosSection } from '@/components/home/featured-studios-section';
import { HeroSection } from '@/components/home/hero-section';

export default function Home() {
	return (
		<main className="flex-1 w-full flex flex-col">
			<HeroSection />
			<CategorySection />
			<FeaturedStudiosSection />
		</main>
	);
}

