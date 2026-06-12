import TransitScreen from "@/features/transit/TransitScreen";
import { useEffect, useState } from "react";

export default function Index() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Den här korta fördröjningen ser till att Android
    // hinner bygga klart sin native-brygga i bakgrunden.
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return null; // Ger appen en millisekund andrum innan ljudkomponenten laddas
  }

  return <TransitScreen />;
}
