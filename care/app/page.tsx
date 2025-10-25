import dynamic from "next/dynamic";
const DashboardTiles = dynamic(() => import("../components/DashboardTiles"), { ssr: false });

export default function Home() {
  return <DashboardTiles />;
}
