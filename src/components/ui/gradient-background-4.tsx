import { cn } from "@/lib/utils";

export const Component = () => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 h-full w-full pointer-events-none",
        // Always-dark site: Weavy accent-cyan at ~11% opacity, radiating from above
        "[background:radial-gradient(125%_125%_at_50%_-20%,#3ab3e81c_40%,transparent_100%)]"
      )}
    />
  );
};
