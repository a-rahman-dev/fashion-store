"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plus,
  Home,
  Briefcase,
  Pencil,
  Trash2,
  X,
  Check,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

/* ══════════════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════════════ */
type AddressType = "home" | "work" | "other";

type Address = {
  id: string;
  label: string;
  type: AddressType;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code?: string;
  country: string;
  is_default?: boolean;
};

const STORAGE_KEY = "luvera-addresses";

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */
export function AddressesContent() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  /* ── Load ─────────────────────────────────────── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAddresses(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  /* ── Save to storage ──────────────────────────── */
  const persist = (next: Address[]) => {
    setAddresses(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  /* ── Add / Update ─────────────────────────────── */
  const handleSave = (data: Omit<Address, "id">) => {
    if (editing) {
      persist(
        addresses.map((a) =>
          a.id === editing.id ? { ...data, id: editing.id } : a
        )
      );
    } else {
      const newAddr: Address = {
        ...data,
        id: `addr_${Date.now()}`,
      };
      persist([...addresses, newAddr]);
    }
    setDrawerOpen(false);
    setEditing(null);
  };

  /* ── Remove ───────────────────────────────────── */
  const handleRemove = (id: string) => {
    persist(addresses.filter((a) => a.id !== id));
  };

  /* ── Set default ──────────────────────────────── */
  const handleSetDefault = (id: string) => {
    persist(addresses.map((a) => ({ ...a, is_default: a.id === id })));
  };

  /* ── Open drawer ──────────────────────────────── */
  const openNew = () => {
    setEditing(null);
    setDrawerOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditing(address);
    setDrawerOpen(true);
  };

  /* ── Loading ──────────────────────────────────── */
  if (!loaded) {
    return (
      <div className="glass-card relative overflow-hidden p-12 text-center rounded-2xl border border-[rgba(255,200,120,0.10)]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#FF9A3C] border-t-transparent shadow-[0_0_20px_rgba(255,154,60,0.4)]" />
        <p className="mt-4 text-sm text-[#9A94A8]">Loading addresses...</p>
      </div>
    );
  }

  return (
    <>
      {/* ═══════════════════════════════════════════
          TOOLBAR
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="glass-card relative overflow-hidden p-4 rounded-2xl border border-[rgba(255,200,120,0.10)] flex items-center justify-between gap-4 mb-6"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.22)] to-transparent"
        />

        <p className="text-xs text-[#9A94A8]">
          <span className="text-[#F5EFE7] font-semibold">
            {addresses.length}
          </span>{" "}
          {addresses.length === 1 ? "address" : "addresses"} saved
        </p>

        <motion.button
          onClick={openNew}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] px-3 py-2 text-xs font-semibold text-[#0B0A14] shadow-[0_4px_16px_rgba(255,154,60,0.3)] hover:shadow-[0_8px_24px_rgba(255,154,60,0.5)] transition-shadow"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={3} />
          Add Address
        </motion.button>
      </motion.div>

      {/* ═══════════════════════════════════════════
          EMPTY STATE
      ═══════════════════════════════════════════ */}
      {addresses.length === 0 ? (
        <EmptyAddresses onAdd={openNew} />
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => openEdit(address)}
                onRemove={() => handleRemove(address.id)}
                onSetDefault={() => handleSetDefault(address.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════
          DRAWER (Add / Edit)
      ═══════════════════════════════════════════ */}
      <AddressDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        editing={editing}
      />
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   Address Card
   ══════════════════════════════════════════════════════════ */
function AddressCard({
  address,
  onEdit,
  onRemove,
  onSetDefault,
}: {
  address: Address;
  onEdit: () => void;
  onRemove: () => void;
  onSetDefault: () => void;
}) {
  const typeIcon =
    address.type === "home" ? Home : address.type === "work" ? Briefcase : MapPin;

  const TypeIcon = typeIcon;

  return (
    <motion.div
      layout
      variants={fadeInUp}
      exit={{
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={spring}
      className={cn(
        "group glass-card relative overflow-hidden p-5 rounded-2xl border transition-all duration-500",
        address.is_default
          ? "border-[rgba(255,154,60,0.35)] shadow-[0_1px_0_rgba(255,200,120,0.1)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6),0_0_28px_-8px_rgba(255,154,60,0.35)]"
          : "border-[rgba(255,200,120,0.10)] hover:border-[rgba(255,200,120,0.22)] hover:shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_18px_40px_-16px_rgba(0,0,0,0.75),0_0_28px_-8px_rgba(255,154,60,0.2)]"
      )}
    >
      {/* Top hairline */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-opacity duration-300",
          address.is_default
            ? "via-[rgba(255,154,60,0.5)]"
            : "via-[rgba(255,200,120,0.25)] opacity-0 group-hover:opacity-100"
        )}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(255,154,60,0.1)] border border-[rgba(255,154,60,0.18)]">
            <TypeIcon className="h-4 w-4 text-[#FF9A3C]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F5EFE7]">
              {address.label}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[#6B6678]">
              {address.type}
            </p>
          </div>
        </div>

        {/* Default badge */}
        {address.is_default && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="inline-flex items-center gap-1 rounded-full border border-[rgba(255,154,60,0.35)] bg-[rgba(255,154,60,0.1)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#FF9A3C] shadow-[0_0_16px_-4px_rgba(255,154,60,0.5)]"
          >
            <Star className="h-2.5 w-2.5 fill-[#FF9A3C]" />
            Default
          </motion.span>
        )}
      </div>

      {/* Body */}
      <div className="space-y-0.5 mb-4">
        <p className="text-xs font-medium text-[#F5EFE7]">
          {address.full_name}
        </p>
        <p className="text-xs text-[#9A94A8]">
          {address.address_line1}
          {address.address_line2 && `, ${address.address_line2}`}
        </p>
        <p className="text-xs text-[#9A94A8]">
          {address.city}
          {address.postal_code && ` - ${address.postal_code}`}
        </p>
        <p className="text-xs text-[#9A94A8]">{address.country}</p>
        <p className="text-xs text-[#9A94A8] pt-1">{address.phone}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-[rgba(255,200,120,0.08)]">
        {!address.is_default && (
          <motion.button
            onClick={onSetDefault}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-[#9A94A8] hover:text-[#FF9A3C] hover:bg-[rgba(255,154,60,0.08)] transition-colors"
          >
            <Star className="h-3 w-3" />
            Set default
          </motion.button>
        )}

        <div className="flex-1" />

        <motion.button
          onClick={onEdit}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#9A94A8] hover:text-[#FF9A3C] hover:bg-[rgba(255,154,60,0.1)] transition-colors"
          aria-label="Edit address"
        >
          <Pencil className="h-3.5 w-3.5" />
        </motion.button>

        <motion.button
          onClick={onRemove}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#6B6678] hover:text-[#FF5C5C] hover:bg-[rgba(255,92,92,0.1)] transition-colors"
          aria-label="Remove address"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Address Drawer (Add / Edit form)
   ══════════════════════════════════════════════════════════ */
function AddressDrawer({
  open,
  onClose,
  onSave,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Address, "id">) => void;
  editing: Address | null;
}) {
  const [form, setForm] = useState<Omit<Address, "id">>({
    label: "Home",
    type: "home",
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    postal_code: "",
    country: "Pakistan",
    is_default: false,
  });

  // Populate when editing changes
  useEffect(() => {
    if (editing) {
      const { id, ...rest } = editing;
      setForm(rest);
    } else {
      setForm({
        label: "Home",
        type: "home",
        full_name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        postal_code: "",
        country: "Pakistan",
        is_default: false,
      });
    }
  }, [editing, open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.full_name.trim() ||
      !form.phone.trim() ||
      !form.address_line1.trim() ||
      !form.city.trim()
    ) {
      return;
    }
    onSave(form);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className={cn(
              "relative w-full max-w-md h-full flex flex-col",
              "bg-[#0B0A14]/95 backdrop-blur-2xl",
              "border-l border-[rgba(255,200,120,0.15)]",
              "shadow-[-30px_0_80px_-20px_rgba(0,0,0,0.9)]"
            )}
          >
            {/* Left hairline */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[rgba(255,200,120,0.35)] to-transparent"
            />

            {/* Header */}
            <div className="relative flex items-center justify-between px-5 py-4 border-b border-[rgba(255,200,120,0.10)]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_20px_-4px_rgba(255,154,60,0.6)]">
                  <MapPin
                    className="h-4 w-4 text-[#0B0A14]"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-[#F5EFE7]">
                    {editing ? "Edit Address" : "New Address"}
                  </h2>
                  <p className="text-[10px] uppercase tracking-wider text-[#6B6678]">
                    {editing ? "Update your address" : "Add a new address"}
                  </p>
                </div>
              </div>

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9A94A8] hover:bg-white/5 hover:text-[#F5EFE7] transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-5 space-y-4"
            >
              {/* Label + Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                    Label
                  </label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={(e) =>
                      setForm({ ...form, label: e.target.value })
                    }
                    placeholder="Home"
                    className="ember-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type: e.target.value as AddressType,
                      })
                    }
                    className="ember-input text-sm cursor-pointer"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Full name */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  placeholder="Ayesha Khan"
                  className="ember-input text-sm"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+92-300-1234567"
                  className="ember-input text-sm"
                />
              </div>

              {/* Address 1 */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  required
                  value={form.address_line1}
                  onChange={(e) =>
                    setForm({ ...form, address_line1: e.target.value })
                  }
                  placeholder="House 123, Street 45"
                  className="ember-input text-sm"
                />
              </div>

              {/* Address 2 */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={form.address_line2 ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, address_line2: e.target.value })
                  }
                  placeholder="Apartment, suite, etc."
                  className="ember-input text-sm"
                />
              </div>

              {/* City + Postal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    placeholder="Karachi"
                    className="ember-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={form.postal_code ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, postal_code: e.target.value })
                    }
                    placeholder="75500"
                    className="ember-input text-sm"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  className="ember-input text-sm"
                />
              </div>

              {/* Set default toggle */}
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, is_default: !form.is_default })
                }
                className={cn(
                  "w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-all duration-300",
                  form.is_default
                    ? "border-[rgba(255,154,60,0.35)] bg-[rgba(255,154,60,0.1)] text-[#FF9A3C] shadow-[0_0_20px_-6px_rgba(255,154,60,0.5)]"
                    : "border-[rgba(255,200,120,0.15)] bg-white/[0.02] text-[#9A94A8] hover:border-[rgba(255,200,120,0.25)] hover:text-[#F5EFE7]"
                )}
              >
                <span className="flex items-center gap-2">
                  <Star
                    className={cn(
                      "h-3.5 w-3.5",
                      form.is_default && "fill-[#FF9A3C]"
                    )}
                  />
                  Set as default address
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  {form.is_default && (
                    <motion.span
                      key="check"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </form>

            {/* Footer */}
            <div className="border-t border-[rgba(255,200,120,0.10)] p-5 flex gap-3">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 h-11 rounded-xl border border-[rgba(255,200,120,0.15)] text-sm font-medium text-[#9A94A8] hover:text-[#F5EFE7] hover:bg-white/5 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={handleSubmit}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 h-11 rounded-xl bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] text-sm font-semibold text-[#0B0A14] shadow-[0_4px_16px_rgba(255,154,60,0.3)] hover:shadow-[0_8px_24px_rgba(255,154,60,0.5)] transition-shadow"
              >
                {editing ? "Save Changes" : "Add Address"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════
   Empty State
   ══════════════════════════════════════════════════════════ */
function EmptyAddresses({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative overflow-hidden p-12 sm:p-16 text-center rounded-2xl border border-[rgba(255,200,120,0.12)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_20px_50px_-20px_rgba(0,0,0,0.8)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.35)] to-transparent"
      />

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.1,
          type: "spring",
          stiffness: 320,
          damping: 22,
        }}
        className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_30px_rgba(255,154,60,0.4),0_1px_0_rgba(255,255,255,0.3)_inset]"
      >
        <motion.span
          aria-hidden
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-[#FF9A3C]"
        />
        <MapPin className="relative h-9 w-9 text-[#0B0A14]" strokeWidth={2.5} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-display text-2xl sm:text-3xl font-bold text-[#F5EFE7] mb-3"
      >
        No addresses saved
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.5 }}
        className="text-sm text-[#9A94A8] max-w-md mx-auto mb-8"
      >
        Add a shipping address to speed up your checkout experience.
      </motion.p>

      <motion.button
        onClick={onAdd}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36, duration: 0.5 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] px-5 py-3 text-sm font-semibold text-[#0B0A14] shadow-[0_4px_16px_rgba(255,154,60,0.3)] hover:shadow-[0_8px_28px_rgba(255,154,60,0.5)] transition-shadow"
      >
        <Plus className="h-4 w-4" strokeWidth={3} />
        Add Your First Address
      </motion.button>
    </motion.div>
  );
}