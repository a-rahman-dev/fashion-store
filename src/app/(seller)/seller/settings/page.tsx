import { SettingsContent } from "./components/SettingsContent";

export const metadata = {
  title: "Settings — Seller Console",
};

export default function SellerSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-[#F5EFE7]">
          Settings
        </h2>
        <p className="mt-1 text-sm text-[#9A94A8]">
          Manage your store information and preferences
        </p>
      </div>

      <SettingsContent />
    </div>
  );
}