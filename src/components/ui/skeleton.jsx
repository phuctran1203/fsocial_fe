import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-muted transition", className)}
			{...props}
		/>
	);
}

export { Skeleton };
