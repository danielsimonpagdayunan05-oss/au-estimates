import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { clientInfoSchema, type ClientInfoFormValues } from "@/lib/schemas";
import type { EstimateResult, WizardSelections } from "@/types/estimate";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const BUDGET_RANGES = ["Under ₱2M", "₱2M – ₱5M", "₱5M – ₱10M", "₱10M – ₱25M", "₱25M+"];

interface ClientInfoFormProps {
  selections: WizardSelections;
  estimate: EstimateResult;
  onSubmitted: (leadId: string, client: ClientInfoFormValues) => void;
}

export function ClientInfoForm({ selections, estimate, onSubmitted }: ClientInfoFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const defaultLocation = [selections.location.city, selections.location.province].filter(Boolean).join(", ");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientInfoFormValues>({
    resolver: zodResolver(clientInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectLocation: defaultLocation,
      budget: "",
      targetCompletion: "",
      consultationDate: "",
      notes: "",
    },
  });

  const onSubmit = async (values: ClientInfoFormValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const lead = await api.post<{ id: number }>("/api/leads", {
        name: values.name,
        email: values.email,
        phone: values.phone,
        projectLocation: values.projectLocation,
        budget: values.budget,
        targetCompletion: values.targetCompletion,
        consultationDate: values.consultationDate,
        notes: values.notes,
        selections,
        estimate,
      });
      onSubmitted(`LEAD-${String(lead.id).padStart(6, "0")}`, values);
    } catch {
      setSubmitError("Something went wrong submitting your details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition-colors focus:border-olive-500 dark:border-white/10 dark:bg-ink-900 dark:text-white";
  const labelClass = "mb-1.5 block text-sm font-medium text-ink-600 dark:text-ink-300";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <Card className="p-6 sm:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-ink-950 dark:text-white">Get your detailed proposal</h3>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          Share your details and we'll send your full report and reach out to discuss next steps.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full Name</label>
          <input className={inputClass} placeholder="Juan Dela Cruz" {...register("name")} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input className={inputClass} type="email" placeholder="juan@email.com" {...register("email")} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Phone Number</label>
          <input className={inputClass} type="tel" placeholder="09XX XXX XXXX" {...register("phone")} />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Project Location</label>
          <input className={inputClass} placeholder="City, Province" {...register("projectLocation")} />
          {errors.projectLocation && <p className={errorClass}>{errors.projectLocation.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Budget Range</label>
          <select className={inputClass} {...register("budget")}>
            <option value="">Select budget range</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {errors.budget && <p className={errorClass}>{errors.budget.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Target Completion</label>
          <input className={inputClass} type="month" {...register("targetCompletion")} />
          {errors.targetCompletion && <p className={errorClass}>{errors.targetCompletion.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Preferred Consultation Date</label>
          <input className={inputClass} type="date" {...register("consultationDate")} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Notes (optional)</label>
          <textarea className={inputClass} rows={3} placeholder="Anything else we should know?" {...register("notes")} />
        </div>

        {submitError && (
          <p className="sm:col-span-2 text-sm text-red-500">{submitError}</p>
        )}

        <div className="sm:col-span-2">
          <Button type="submit" size="lg" className="w-full" disabled={submitting} icon={submitting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}>
            {submitting ? "Submitting..." : "Get My Full Report"}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-400">
            <CheckCircle2 size={13} /> No spam. We'll only reach out about your project.
          </p>
        </div>
      </form>
    </Card>
  );
}
