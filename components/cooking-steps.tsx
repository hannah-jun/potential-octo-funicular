import type { CookingStep } from "@/lib/recipes";

export function CookingSteps({ steps }: { steps: CookingStep[] }) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="cooking-steps-heading"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <h2 id="cooking-steps-heading" className="font-heading text-lg">
        조리 순서
      </h2>
      <ol className="flex flex-col gap-4">
        {steps.map((step) => (
          <li key={step.order} className="flex gap-3 text-sm">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
            >
              {step.order}
            </span>
            <div className="flex flex-col gap-1 pt-0.5">
              <p>{step.description}</p>
              {step.tip ? (
                <p className="text-xs text-muted-foreground">Tip. {step.tip}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
