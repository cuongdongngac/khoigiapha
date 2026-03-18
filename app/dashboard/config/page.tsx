import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Cấu hình trang web",
};

export default async function ConfigPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Import the client component
  const ConfigEditor = await import("@/components/ConfigEditor").then(
    (mod) => mod.default,
  );

  return <ConfigEditor />;
}
