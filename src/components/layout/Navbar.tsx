import { NavbarClient } from "./NavbarClient";
import { MobileTabBar } from "./MobileTabBar";
import { getCachedUser, getCachedProfile } from "@/utils/supabase/queries";

export async function Navbar() {
  const user = await getCachedUser();

  let role: string | null = null;
  if (user) {
    const profile = await getCachedProfile(user.id);
    role = profile?.role ?? null;
  }

  return (
    <>
      <NavbarClient user={user} role={role} />
      <MobileTabBar user={user} />
    </>
  );
}
