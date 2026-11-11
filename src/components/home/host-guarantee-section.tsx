import { BadgeCheck, Headphones, Lock, ShieldCheck } from 'lucide-react';

interface AssuranceItem {
	title: string;
	description: string;
	icon: React.ElementType;
}

const ASSURANCES: AssuranceItem[] = [
	{
		title: 'Liability Protection',
		description: 'Property and venue damage coverage automatically active on every confirmed session.',
		icon: ShieldCheck,
	},
	{
		title: 'Verified Profiles',
		description: 'Strict identity checks and production credit validation for hosts and creators.',
		icon: BadgeCheck,
	},
	{
		title: 'Equipment Safety',
		description: 'Secure lockouts, gear holding bays, and certified power distribution standards on set.',
		icon: Lock,
	},
	{
		title: '24/7 Host Support',
		description: 'Dedicated studio dispatch specialists on call during your active reservation window.',
		icon: Headphones,
	},
];

export function HostGuaranteeSection() {
	return (
		<section id="host-guarantee" className="container pt-6 sm:pt-8 pb-8 sm:pb-12 lg:pb-14" aria-label="Host Guarantee and Creator Support">
			{/* Section Header */}
			<div className="space-y-1 mb-6 sm:mb-8">
				<h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Host Guarantee & Support</h2>
			</div>

			{/* Assurance Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{ASSURANCES.map(item => {
					const Icon = item.icon;

					return (
						<div key={item.title} className="rounded-2xl bg-secondary/70 dark:bg-card p-6 flex flex-col gap-3">
							<div className="flex items-center gap-3">
								<div className="size-9 rounded-xl bg-foreground/5 dark:bg-foreground/10 text-muted-foreground flex items-center justify-center shrink-0">
									<Icon className="size-5" />
								</div>
								<h3 className="text-lg sm:text-xl font-semibold text-foreground leading-snug">{item.title}</h3>
							</div>
							<p className="text-base text-muted-foreground">{item.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}

