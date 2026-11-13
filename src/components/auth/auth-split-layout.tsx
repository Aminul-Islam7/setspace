import Image from 'next/image';

export interface AuthFeatureItem {
	icon: React.ElementType;
	text: string;
}

export interface AuthHighlight {
	badge?: string;
	headline: React.ReactNode;
	description?: string;
	features: AuthFeatureItem[];
}

interface AuthSplitLayoutProps {
	title: string;
	subtitle: string;
	children: React.ReactNode;
	highlight?: AuthHighlight;
}

export function AuthSplitLayout({ title, subtitle, children, highlight }: AuthSplitLayoutProps) {
	return (
		<div className="grid min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] lg:grid-cols-2 pt-2 pb-10">
			{/* Design / Showcase Side */}
			<div className="relative hidden lg:flex flex-col justify-end overflow-hidden bg-card p-12 text-foreground rounded-r-4xl">
				{/* Background Studio Visual */}
				<Image src="https://i.ibb.co/hFDT6Nz4/chromavault-led-volume-virtual-stage-5t9k1j-image-0.jpg" alt="Cinematic production studio stage" fill priority className="object-cover object-center brightness-60 dark:brightness-40" sizes="50vw" />

				{/* Vignette Overlay */}
				<div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />

				{/* Bottom Showcase Content */}
				<div className="relative z-10 space-y-5 max-w-lg">
					{highlight?.badge && <p className="font-semibold text-sm tracking-widest text-background py-0.5 px-1.5 uppercase bg-primary/90 rounded inline">{highlight?.badge}</p>}

					<h2 className="font-display text-2xl mt-2 font-bold tracking-tight text-foreground sm:text-3xl leading-snug">{highlight?.headline}</h2>

					{highlight?.description && <p className="text-sm text-muted-foreground leading-relaxed">{highlight?.description}</p>}

					{/* Icon Feature List */}
					<div className="space-y-3 pt-2">
						{highlight?.features.map((feat, index) => {
							const Icon = feat.icon;
							return (
								<div key={index} className="flex items-center gap-3 text-sm text-foreground/90">
									<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
										<Icon className="size-4" />
									</div>
									<span className="font-medium leading-tight">{feat.text}</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Form Side */}
			<div className="flex flex-col justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-12 xl:px-16">
				<div className="mx-auto w-full max-w-md space-y-6">
					{/* Header */}
					<div className="space-y-2 text-left">
						<h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
						<p className="text-sm text-muted-foreground">{subtitle}</p>
					</div>

					{/* Form Content */}
					{children}
				</div>
			</div>
		</div>
	);
}

