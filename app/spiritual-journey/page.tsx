import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ISKCONSpiritualPage from "@/components/iskcon-voice-assistant"

export default async function SpiritualJourneyPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return <ISKCONSpiritualPage />
}
