import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bhkdfzybeyvkbbykvkcr.supabase.co";
const SUPABASE_KEY = "YOUR_SUPABASE_KEY_HERE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
