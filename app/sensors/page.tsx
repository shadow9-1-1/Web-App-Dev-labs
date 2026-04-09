import FilterButton from "./FilterButton";

const Sensors = [
	{ id: "temp-001", name: "Temperature Sensor" },
	{ id: "motion-99", name: "Motion Sensor" },
	{ id: "humid-210", name: "Humidity Sensor" },
];

export default function SensorsPage() {
	return (
		<main className="mx-auto max-w-3xl px-6 py-12">
			<h1 className="text-3xl font-semibold">Sensors</h1>
			<p className="mt-4 text-base">
				Select a sensor to view the detail
			</p>
			<ul className="mt-6 space-y-3">
				{Sensors.map((sensor) => (
					<li
						key={sensor.id}
						className="flex items-center justify-between rounded border border-zinc-200 bg-white px-4 py-3"
					>
						<div>
							<p className="text-base font-medium text-zinc-900">{sensor.name}</p>
							<p className="text-sm text-zinc-500">ID: {sensor.id}</p>
						</div>
						<FilterButton label="View" targetId={sensor.id} />
					</li>
				))}
			</ul>
		</main>
	);
}
