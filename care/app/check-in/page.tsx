import dynamic from "next/dynamic";
const CheckInFlow = dynamic(() => import("../../components/CheckInFlow"), { ssr: false });

export default function CheckInPage() {
  return (
    <section className="col-span-full">
      <CheckInFlow />
    </section>
  );
}
