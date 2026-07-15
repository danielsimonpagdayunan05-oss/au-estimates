import { MapPin } from "lucide-react";
import { useWizardStore } from "@/store/wizardStore";
import { useSiteData } from "@/lib/useSiteData";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

export function Step3Location() {
  const { selections, setLocation } = useWizardStore();
  const { data: siteData } = useSiteData();
  const province = siteData.provinces.find((p) => p.name === selections.location.province);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink-950 dark:text-white">Where is the project located?</h2>
      <p className="mt-2 text-ink-500 dark:text-ink-400">
        We automatically adjust labor and material cost factors by region.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Select
          label="Province"
          value={selections.location.province}
          onChange={(v) => setLocation({ province: v, city: "" })}
          options={["Select province", ...siteData.provinces.map((p) => p.name)]}
        />
        <Select
          label="City / Municipality"
          value={selections.location.city}
          onChange={(v) => setLocation({ city: v })}
          options={["Select city", ...(province?.cities ?? [])]}
        />
      </div>

      <label className="mt-5 block max-w-sm">
        <span className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">Barangay / Additional detail (optional)</span>
        <input
          value={selections.location.municipality}
          onChange={(e) => setLocation({ municipality: e.target.value })}
          placeholder="e.g. Barangay San Isidro"
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-900 outline-none transition-colors focus:border-olive-500 dark:border-white/10 dark:bg-ink-900 dark:text-white"
        />
      </label>

      {province && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-ink-100 bg-ink-50/60 px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
          <MapPin size={16} className="text-olive-500" />
          <span className="text-sm text-ink-600 dark:text-ink-300">
            {province.region} regional cost index:
          </span>
          <Badge tone={province.multiplier >= 1 ? "olive" : "success"}>
            {province.multiplier >= 1 ? "Baseline" : `${Math.round((1 - province.multiplier) * 100)}% below NCR`}
          </Badge>
        </div>
      )}
    </div>
  );
}
