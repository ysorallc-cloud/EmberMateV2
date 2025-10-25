import dynamic from "next/dynamic";
const MedsManager = dynamic(() => import("../../components/MedsManager"), { ssr: false });

export default function MedsPage() {
  return (
    <section className="col-span-full">
      <MedsManager />
    </section>
  );
}
