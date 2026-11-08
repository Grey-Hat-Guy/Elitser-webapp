import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://hgytwrnkuoafdobstryl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_Hh2Af5hag8Yqo6e2iq_Qyg_fj5kvgSV";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
