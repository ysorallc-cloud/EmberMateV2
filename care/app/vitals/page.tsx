import dynamic from "next/dynamic";
const VitalsTrends = dynamic(() => import("../../components/VitalsTrends"), { ssr: false });

export default function VitalsPage() {
  return (
    <section className="col-span-full">
      <VitalsTrends />
    </section>
  );
}
