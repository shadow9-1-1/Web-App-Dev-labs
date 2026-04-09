type DashboardLayoutProps = {
	children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div className="flex min-h-screen bg-zinc-50">
			<aside className="w-64 border-r border-zinc-200 bg-white p-6">
				<h2 className="text-lg font-semibold text-black">Dashboard</h2>
				<nav className="mt-6 space-y-3 text-sm">
					<a className="block text-zinc-700 hover:text-zinc-900" href="/dashboard">
						Overview
					</a>
					<a
						className="block text-zinc-700 hover:text-zinc-900"
						href="/dashboard/settings"
					>
						Settings
					</a>
				</nav>
			</aside>
			<section className="flex-1 p-8 text-black">{children}</section>
		</div>
	);
}
