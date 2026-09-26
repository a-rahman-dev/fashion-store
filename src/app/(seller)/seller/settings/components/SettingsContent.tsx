"use client";

import { useState, useEffect } from "react";
import {
  Store,
  Truck,
  Percent,
  Share2,
  Save,
  RotateCcw,
  Music,
  Loader2,
  Check,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toast";
import { useStoreSettings, type StoreSettings } from "@/hooks/useStoreSettings";
import { cn } from "@/lib/utils/cn";


// ══════════════════════════════════════════════════════════
// Inline SVG Icons (lucide-react fallback)
// ══════════════════════════════════════════════════════════
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function SettingsContent() {
  const { settings, isLoaded, saveSettings, resetSettings } =
    useStoreSettings();

  const [form, setForm] = useState<StoreSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showReset, setShowReset] = useState(false);

  // Sync form with loaded settings
  useEffect(() => {
    if (isLoaded) {
      setForm(settings);
    }
  }, [isLoaded, settings]);

  const update = <K extends keyof StoreSettings>(
    key: K,
    value: StoreSettings[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ── Save ──────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulate network delay for UX
    await new Promise((r) => setTimeout(r, 500));

    saveSettings(form);
    setSaving(false);
    setSaved(true);
    showToast("Settings saved successfully", "success");

    setTimeout(() => setSaved(false), 2000);
  };

  // ── Reset ─────────────────────────────────────────────────
  const handleReset = () => {
    resetSettings();
    setShowReset(false);
    showToast("Settings reset to defaults", "info");
  };

  if (!isLoaded) {
    return (
      <div className="glass-card p-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF9A3C] mx-auto" />
        <p className="mt-4 text-sm text-[#9A94A8]">Loading settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* ═══════════════════════════════════════════
          STORE INFORMATION
      ═══════════════════════════════════════════ */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-[#FF9A3C]" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7]">
            Store Information
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
              Store Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="ember-input text-sm"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              className="ember-input text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
            Description
          </label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="ember-input text-sm resize-none"
          />
        </div>

        {/* Contact row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2 flex items-center gap-1.5">
              <Mail className="h-3 w-3" />
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="ember-input text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2 flex items-center gap-1.5">
              <Phone className="h-3 w-3" />
              Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="ember-input text-sm"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2 flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            Address
          </label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            className="ember-input text-sm"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SHIPPING
      ═══════════════════════════════════════════ */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-[#FF9A3C]" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7]">
            Shipping
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Delivery Fee */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
              Delivery Fee (PKR)
            </label>
            <input
              type="number"
              min={0}
              value={form.deliveryFee}
              onChange={(e) => update("deliveryFee", Number(e.target.value))}
              className="ember-input text-sm"
            />
          </div>

          {/* Free Delivery Above */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
              Free Delivery Above (PKR)
            </label>
            <input
              type="number"
              min={0}
              value={form.freeDeliveryAbove}
              onChange={(e) =>
                update("freeDeliveryAbove", Number(e.target.value))
              }
              className="ember-input text-sm"
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          TAX
      ═══════════════════════════════════════════ */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Percent className="h-4 w-4 text-[#FF9A3C]" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7]">
            Tax
          </h3>
        </div>

        <div className="max-w-xs">
          <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
            Tax Rate (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={(form.taxRate * 100).toFixed(1)}
            onChange={(e) =>
              update("taxRate", Number(e.target.value) / 100)
            }
            className="ember-input text-sm"
          />
          <p className="mt-1.5 text-[10px] text-[#6B6678]">
            Applied at checkout on subtotal
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SOCIAL LINKS
      ═══════════════════════════════════════════ */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-[#FF9A3C]" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7]">
            Social Links
          </h3>
        </div>

        <div className="space-y-3">
          {[
            {
              icon: InstagramIcon,
              key: "instagram" as const,
              label: "Instagram",
              placeholder: "@luvera.store",
            },
            {
              icon: FacebookIcon,
              key: "facebook" as const,
              label: "Facebook",
              placeholder: "luverastore",
            },
            {
              icon: Music,
              key: "tiktok" as const,
              label: "TikTok",
              placeholder: "@luvera.store",
            },
          ].map(({ icon: Icon, key, label, placeholder }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[rgba(255,200,120,0.15)] bg-white/[0.03]">
                <Icon className="h-4 w-4 text-[#FF9A3C]" />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-medium uppercase tracking-wider text-[#6B6678] mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={placeholder}
                  className="ember-input text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          DANGER ZONE
      ═══════════════════════════════════════════ */}
      <div className="glass-card p-6 border-l-2 border-l-[#FF5C5C]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[rgba(255,92,92,0.1)]">
            <AlertTriangle className="h-4 w-4 text-[#FF5C5C]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#F5EFE7] mb-1">
              Reset Settings
            </h3>
            <p className="text-xs text-[#9A94A8] mb-4">
              Restore all settings to their default values. This will not
              affect your products or orders.
            </p>
            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(255,92,92,0.2)] bg-[rgba(255,92,92,0.08)] px-3 py-2 text-xs font-medium text-[#FF5C5C] hover:bg-[rgba(255,92,92,0.15)] transition-all"
            >
              <RotateCcw className="h-3 w-3" />
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          STICKY SAVE BAR
      ═══════════════════════════════════════════ */}
      <div className="sticky bottom-4 flex items-center justify-end gap-3 p-4 glass-card">
        <p className="text-xs text-[#9A94A8] mr-auto">
          Changes are saved locally to your browser
        </p>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* ═══════════════════════════════════════════
          RESET CONFIRMATION
      ═══════════════════════════════════════════ */}
      <Dialog open={showReset} onClose={() => setShowReset(false)}>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,92,92,0.15)] border border-[rgba(255,92,92,0.2)]">
          <AlertTriangle className="h-5 w-5 text-[#FF5C5C]" />
        </div>

        <div className="text-center mb-6">
          <h3 className="font-display text-xl font-bold text-[#F5EFE7] mb-2">
            Reset All Settings?
          </h3>
          <p className="text-sm text-[#9A94A8]">
            This will restore all store settings to their default values.
            You cannot undo this action.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowReset(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-[#FF5C5C] text-white text-sm font-semibold hover:bg-[#ff4444] transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </Dialog>
    </form>
  );
}