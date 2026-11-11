import { CategorySection } from '@/components/home/category-section';
import { FeaturedStudiosSection } from '@/components/home/featured-studios-section';
import { HeroSection } from '@/components/home/hero-section';
import { HostGuaranteeSection } from '@/components/home/host-guarantee-section';
import { HowItWorksSection } from '@/components/home/how-it-works-section';

export default function Home() {
	return (
		<main className="flex-1 w-full flex flex-col">
			<HeroSection />
			<CategorySection />
			<FeaturedStudiosSection />
			<HowItWorksSection />
			<HostGuaranteeSection />
		</main>
	);
}
