interface StepItem {
	step: number;
	title: string;
	description: string;
}

const STEPS: StepItem[] = [
	{
		step: 1,
		title: 'Discover Spaces',
		description: 'Browse vetted studios with real-time equipment inventories, lighting rigs, and floor plans.',
	},
	{
		step: 2,
		title: 'Select Shoot Hours',
		description: 'Pick session dates and custom shooting windows with transparent hourly pricing.',
	},
	{
		step: 3,
		title: 'Book Instantly',
		description: 'Confirm reservation slots in seconds with direct host confirmation and calendar sync.',
	},
	{
		step: 4,
		title: 'Create & Produce',
		description: 'Receive access codes and check-in instructions so your team can focus on production.',
	},
];

export function HowItWorksSection() {
	return (
		<section id="how-it-works" className="container pt-8 sm:pt-12 lg:pt-14 pb-6 sm:pb-8" aria-label="How Booking Works">
			{/* Section Header */}
			<div className="space-y-1 mb-6 sm:mb-8">
				<h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">How Booking Works</h2>
			</div>

			{/* Steps Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{STEPS.map(item => (
					<div key={item.step} className="rounded-2xl bg-secondary/70 dark:bg-card p-6 flex flex-col gap-3">
						<div className="flex items-center gap-3">
							<span className="size-9 rounded-xl bg-foreground/5 dark:bg-foreground/10 text-foreground text-sm font-semibold flex items-center justify-center shrink-0">{item.step}</span>
							<h3 className="text-lg sm:text-xl font-semibold text-foreground leading-snug">{item.title}</h3>
						</div>
						<p className="text-base text-muted-foreground">{item.description}</p>
					</div>
				))}
			</div>
		</section>
	);
}

