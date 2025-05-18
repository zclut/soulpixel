import { useEffect, useState, useSyncExternalStore } from "react";
import { $userStore } from "@clerk/astro/client";

export default function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const you = useSyncExternalStore(
    $userStore.listen,
    $userStore.get,
    $userStore.get
  );

  useEffect(() => {
    if (you?.publicMetadata?.admin) {
      setIsAdmin(true);
    }
  }, [you]);

  return isAdmin;
}
