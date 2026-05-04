import { HomeExperience } from "@/components/home-experience";
import { getVehicles } from "@/lib/vehicles";

export default async function Home() {
  const vehicles = await getVehicles();

  return <HomeExperience vehicles={vehicles} />;
}
