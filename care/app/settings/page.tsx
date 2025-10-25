import dynamic from "next/dynamic";
const SettingsPanel = dynamic(() => import("../../components/SettingsPanel"), { ssr: false });
const SeedDemo = dynamic(() => import("../../components/SeedDemo"), { ssr: false });

export default function SettingsPage() {
  return (
    <section className="col-span-full grid gap-2">
      <div className="flex justify-end"><SeedDemo /></div>
      <SettingsPanel />
    </section>
  );
}
