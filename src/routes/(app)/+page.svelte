<script lang="ts">
	import penIcon from '$lib/ui/home/pen.svg';
	import shareIcon from '$lib/ui/home/share.svg';
	import previewGif from '$lib/ui/home/preview.gif';
</script>

<main class="dark-theme">
	<div class="constraints">
		<section class="hero">
			<div class="hero-content">
				<h2>Database Design for Backend Engineers</h2>
				<p class="hero-description">
					Write your database schema like you write your code. Transform DBML into professional
					diagrams instantly.
				</p>
				<div class="cta-container">
					<a href="/workspace" class="cta-button">Start Diagramming</a>
					<span class="tech-badge">Powered by DBML</span>
				</div>
				<div class="preview-container">
					<div class="preview-header">
						<div class="preview-dots">
							<span></span>
							<span></span>
							<span></span>
						</div>
						<span class="preview-title">schema.dbml</span>
					</div>
					<img class="preview-image" src={previewGif} alt="ERD creation demo" />
				</div>
			</div>
		</section>

		<section class="features">
			<h2>Professional Database Modeling</h2>
			<div class="features-grid">
				<article class="feature-card">
					<span class="icon-wrapper">
						<img src={penIcon} alt="Code-First Design" />
					</span>
					<div class="feature-content">
						<h3>Code-First Design</h3>
						<p>
							Write your database schema in DBML - designed for backend engineers who prefer coding
							over drag-and-drop.
						</p>
					</div>
				</article>
				<article class="feature-card">
					<span class="icon-wrapper">
						<img src={shareIcon} alt="Team Collaboration" />
					</span>
					<div class="feature-content">
						<h3>Team Collaboration</h3>
						<p>
							Share and collaborate on database designs with your team. Real-time updates included.
						</p>
					</div>
				</article>
			</div>
			<div class="features-footer">
				<p class="tech-stack">
					Built with <strong><a href="https://flitter.dev">Flitter</a></strong> • Powered by
					<a href="https://dbml.dbdiagram.io/home/"><strong>DBML</strong></a>
				</p>
				<p class="free-forever">
					Start Free • <a href="/pricing" class="pricing-link">View Pricing</a>
				</p>
			</div>
		</section>

		<section class="community">
			<h2>Join Our Developer Community</h2>
			<p>Connect with fellow backend engineers and database designers.</p>
			<div class="contact-links">
				<a href="https://discord.gg/n8dffUVbtp" class="discord-button">Join Discord Community</a>
				<span class="contact-divider">•</span>
				<div class="secondary-links">
					<a href="https://github.com/your-org/easy-rd" target="_blank" rel="noopener">GitHub</a>
					<span class="contact-divider">•</span>
					<a href="https://github.com/your-org/easy-rd#examples" target="_blank" rel="noopener">Examples</a>
				</div>
			</div>
		</section>
	</div>
</main>

<style>
	main.dark-theme {
		background: linear-gradient(to bottom, #1a1a1a, #2d2d2d);
		min-height: 100vh;
		color: #ffffff;
	}

	.constraints {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.hero {
		text-align: center;
		margin-bottom: 4rem;
	}

	.hero h2 {
		font-size: 3rem;
		font-weight: 700;
		margin-bottom: 1rem;
		background: linear-gradient(to right, #60a5fa, #93c5fd);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.hero-description {
		font-size: 1.25rem;
		color: #94a3b8;
		max-width: 600px;
		margin: 0 auto 2rem;
	}

	.cta-container {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		margin-bottom: 3rem;
	}

	.cta-button {
		background-color: #3b82f6;
		color: white;
		padding: 0.8rem 2rem;
		border-radius: 6px;
		text-decoration: none;
		font-weight: bold;
		transition: background-color 0.3s ease;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.cta-button:hover {
		background-color: #2563eb;
	}

	.tech-badge {
		background: rgba(59, 130, 246, 0.1);
		color: #93c5fd;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		border: 1px solid rgba(147, 197, 253, 0.2);
	}

	.preview-container {
		background: #1e1e1e;
		border-radius: 8px;
		overflow: hidden;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.preview-header {
		background: #2d2d2d;
		padding: 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.preview-dots {
		display: flex;
		gap: 0.375rem;
	}

	.preview-dots span {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
	}

	.preview-dots span:nth-child(1) {
		background: #ff5f56;
	}
	.preview-dots span:nth-child(2) {
		background: #ffbd2e;
	}
	.preview-dots span:nth-child(3) {
		background: #27c93f;
	}

	.preview-title {
		color: #8b949e;
		font-size: 0.875rem;
		margin-left: 1rem;
	}

	.preview-image {
		width: 100%;
		height: auto;
		display: block;
	}

	.features {
		margin-bottom: 4rem;
	}

	.features h2 {
		font-size: 2.25rem;
		text-align: center;
		margin-bottom: 2.5rem;
		color: #ffffff;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.feature-card {
		background: rgba(255, 255, 255, 0.05);
		padding: 1.5rem;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		transition: transform 0.2s ease;
	}

	.feature-card:hover {
		transform: translateY(-4px);
	}

	.icon-wrapper {
		background-color: rgba(59, 130, 246, 0.1);
		border-radius: 8px;
		padding: 0.75rem;
		display: inline-flex;
		margin-bottom: 1rem;
	}

	.icon-wrapper img {
		width: 24px;
		height: 24px;
	}

	.feature-content h3 {
		color: #ffffff;
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
	}

	.feature-content p {
		color: #94a3b8;
	}

	.features-footer {
		text-align: center;
		color: #94a3b8;
	}

	.tech-stack {
		margin-bottom: 1rem;
	}

	.tech-stack a {
		color: #60a5fa;
		text-decoration: none;
	}

	.free-forever {
		color: #10b981;
		font-weight: bold;
	}

	.pricing-link {
		color: #2196f3;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.pricing-link:hover {
		color: #42a5f5;
		text-decoration: underline;
	}

	.community {
		text-align: center;
	}

	.community h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.community p {
		color: #94a3b8;
		margin-bottom: 2rem;
	}

	.contact-links {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}

	.discord-button {
		background-color: #5865f2;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		text-decoration: none;
		font-weight: bold;
		transition: background-color 0.3s ease;
	}

	.discord-button:hover {
		background-color: #4752c4;
	}

	.contact-divider {
		color: #4b5563;
	}

	.secondary-links a {
		color: #94a3b8;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.secondary-links a:hover {
		color: #ffffff;
	}

	@media (max-width: 768px) {
		.hero h2 {
			font-size: 2rem;
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.contact-links {
			flex-direction: column;
		}

		.contact-divider {
			display: none;
		}
	}
</style>
