import type { Metadata } from "next";

type SensorPageProps = {
	params: Promise<{
		id: string;
	}>;
};

export async function generateMetadata({ params }: SensorPageProps): Promise<Metadata> {
	const { id } = await params;

	return {
		title: `Sensor - ${id}`,
		description: `Details for sensor ${id}.`,
	};
}

export default async function SensorPage({ params }: SensorPageProps) {
	const { id } = await params;

	return (
		<main className="mx-auto max-w-3xl px-6 py-12">
			<h1 className="text-3xl font-semibold">Sensor Detail</h1>
			<p className="mt-4 text-base">
				sensor ID: <strong>{id}</strong>
			</p>
		</main>
	);
}
