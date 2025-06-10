<script lang="ts">
	import logo from './logo.jpeg';
</script>

<header>
	<div class="constraints">
		<a href="/" class="logo">
			<img src={logo} alt="Easy-Rd logo" />
			<span>Easy-Rd</span>
		</a>
		<nav>
			<span title="Coming Soon" class="nav-item disabled">Docs</span>
			<span title="Coming Soon" class="nav-item disabled">Roadmap</span>
			<a href="/pricing" class="nav-item">Pricing</a>
		</nav>
		<a href="/workspace" class="cta-button">Launch Workspace <span class="arrow">→</span></a>
	</div>
</header>

<style>
	header {
		background-color: #1a1a1a;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: var(--header-height, 70px);
		color: #ffffff;
		z-index: 9999;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(8px);
	}

	.constraints {
		max-width: var(--content-width, 1200px);
		margin: 0 auto;
		padding: 0 var(--content-padding-inline, 20px);
		height: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		display: flex;
		align-items: center;
		text-decoration: none;
		color: #ffffff;
		font-weight: bold;
		font-size: 1.2rem;
	}

	.logo img {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		margin-right: 10px;
	}

	nav {
		display: flex;
		gap: 20px;
	}

	.nav-item {
		color: #94a3b8;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.nav-item.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.cta-button {
		background-color: #3b82f6;
		color: white;
		padding: 8px 16px;
		border-radius: 6px;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: bold;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.cta-button:hover {
		background-color: #2563eb;
		transform: translateY(-1px);
	}

	.arrow {
		margin-left: 5px;
		font-size: 1.2rem;
		transition: transform 0.2s ease;
	}

	.cta-button:hover .arrow {
		transform: translateX(2px);
	}

	@media (max-width: 768px) {
		.constraints {
			padding: 0 10px;
		}
		nav {
			gap: 10px;
		}
		.cta-button {
			padding: 6px 12px;
			font-size: 0.8rem;
		}
	}
</style>
