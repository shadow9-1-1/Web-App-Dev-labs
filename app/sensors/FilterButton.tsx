'use client';

import { useRouter } from "next/navigation";

type FilterButtonProps = {
	label: string;
	targetId: string;
};

export default function FilterButton({ label, targetId }: FilterButtonProps) {
	const router = useRouter();

	return (
		<button
			type="button"
			className="rounded border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:text-zinc-900"
			onClick={() => router.push(`/sensors/${targetId}`)}
		>
			{label}
		</button>
	);
}
