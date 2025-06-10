<section class="flex flex-col items-center text-white">
	<h2 class="text-4xl font-bold mb-4">Choose Your Plan</h2>
	<p class="text-gray-400 mb-8 text-lg">
		Scale your database design workflow with our flexible plans
	</p>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
		<!-- Free Tier -->
		<div class="pricing-card group">
			<div class="p-8 flex flex-col h-full">
				<div>
					<h3 class="text-2xl font-bold mb-2">Free</h3>
					<p class="text-gray-400 mb-6 h-12">Start designing your database with AI assistance</p>
					<div class="text-4xl font-bold mb-8">
						$0<span class="text-lg text-gray-400">/month</span>
					</div>
					<ul class="space-y-4 mb-12">
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> Create up to 10 tables
						</li>
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> Unlimited sharing
						</li>
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> AI Chat Assistant - Get instant help with
							DBML syntax
						</li>
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> Leave feedback & feature requests to admin
						</li>
					</ul>
				</div>
				<div class="mt-auto text-center">
					<a href="/workspace" class="pricing-button inline-block"> Get Started Free </a>
				</div>
			</div>
		</div>

		<!-- Pro Tier -->
		<div class="pricing-card group pro-card">
			<div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
				<span class="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium"
					>Most Popular</span
				>
			</div>
			<div class="p-8 flex flex-col h-full">
				<div>
					<h3 class="text-2xl font-bold mb-2">Pro</h3>
					<p class="text-gray-400 mb-6 h-12">
						Enhanced features with priority support from the creator
					</p>
					<div class="text-4xl font-bold mb-8">
						$1.99<span class="text-lg text-gray-300">/month</span>
					</div>
					<ul class="space-y-4 mb-12">
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> Unlimited table creation
						</li>
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> Enhanced sharing with custom permissions
						</li>
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> Advanced AI Assistant with code suggestions
						</li>
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> Direct support from creator (24h response)
						</li>
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> Priority feature implementation
						</li>
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> Custom theme options
						</li>
					</ul>
				</div>
				<div class="mt-auto text-center">
					<a href="/workspace" class="pricing-button pro-button inline-block"> Upgrade Now </a>
				</div>
			</div>
		</div>

		<!-- Enterprise Tier -->
		<div class="pricing-card group">
			<div class="p-8 flex flex-col h-full">
				<div>
					<h3 class="text-2xl font-bold mb-2">Enterprise</h3>
					<p class="text-gray-400 mb-6 h-12">Advanced AI & cloud features for teams</p>
					<div class="text-4xl font-bold mb-8">
						$19.99<span class="text-lg text-gray-400">/month</span>
					</div>
					<ul class="space-y-4 mb-12">
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> Everything in Pro
						</li>
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> AI-powered DBML generation
						</li>
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> Cloud migration support
						</li>
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> Team collaboration
						</li>
						<li class="flex items-center">
							<span class="text-primary-500 mr-2">✓</span> Version history
						</li>
					</ul>
				</div>
				<div class="mt-auto text-center">
					<a
						href="https://discord.gg/n8dffUVbtp"
						class="pricing-button inline-block"
						target="_blank"
						rel="noopener noreferrer"
					>
						Contact Sales
					</a>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-16 text-center max-w-2xl">
		<p class="text-gray-400 leading-relaxed">
			Thanks to your incredible support, our community has grown beyond our expectations. While we
			need to introduce pricing to sustain our server costs, we're excited to bring you all the
			features we've been planning. Let's make database design better, together! 🚀
		</p>
	</div>
</section>

<style>
	.pricing-card {
		position: relative;
		background-color: rgba(47, 47, 47, 0.5);
		border-radius: 0.75rem;
		border: 1px solid rgba(75, 75, 75, 0.5);
		backdrop-filter: blur(8px);
		transition: all 0.3s ease;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.pro-card {
		background: linear-gradient(135deg, rgba(47, 47, 47, 0.8), rgba(20, 20, 20, 0.8));
		border-color: rgba(33, 150, 243, 0.3);
		box-shadow: 0 0 40px -10px rgba(33, 150, 243, 0.3);
	}

	.pricing-card:hover {
		border-color: rgba(75, 75, 75, 0.5);
		transform: translateY(-4px);
		box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
	}

	.pro-card:hover {
		border-color: rgba(33, 150, 243, 0.5);
		box-shadow: 0 10px 40px -10px rgba(33, 150, 243, 0.4);
	}

	.pricing-button {
		width: 100%;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		background-color: rgba(75, 75, 75, 0.5);
		color: white;
		font-weight: 500;
		border: 1px solid rgba(75, 75, 75, 0.3);
		backdrop-filter: blur(8px);
		transition: all 0.3s ease;
	}

	.pricing-button:hover {
		background-color: rgba(75, 75, 75, 0.7);
		border-color: rgba(75, 75, 75, 0.5);
	}

	.pro-button {
		background-color: rgba(33, 150, 243, 0.8);
		border-color: rgba(66, 165, 245, 0.3);
	}

	.pro-button:hover {
		background-color: rgba(66, 165, 245, 0.9);
		border-color: rgba(100, 181, 246, 0.5);
	}

	.text-primary-500 {
		color: #2196f3;
	}

	.bg-primary-500 {
		background-color: #2196f3;
	}
</style>
