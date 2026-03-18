import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function ensureGuestUser() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing required environment variables");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const guestEmail = process.env.NEXT_PUBLIC_GUEST_EMAIL || "guest@giapha.com";
  const guestPassword = process.env.NEXT_PUBLIC_GUEST_PASS || "giapha@123";

  console.log("Checking if guest user exists:", guestEmail);

  try {
    // Check if user already exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("Error listing users:", listError);
      return;
    }

    const existingUser = users?.find(user => user.email === guestEmail);
    
    if (existingUser) {
      console.log("Guest user already exists:", existingUser.id);
      return;
    }

    console.log("Creating guest user...");
    
    // Create the guest user
    const { data, error } = await supabase.auth.admin.createUser({
      email: guestEmail,
      password: guestPassword,
      email_confirm: true,
      user_metadata: {
        role: 'member',
        is_guest: true
      }
    });

    if (error) {
      console.error("Error creating guest user:", error);
    } else if (data.user) {
      console.log("Guest user created successfully:", data.user.id);
      
      // Create profile entry
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          role: 'member',
          is_active: true
        });
        
      if (profileError) {
        console.error("Error creating guest profile:", profileError);
      } else {
        console.log("Guest profile created successfully");
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

ensureGuestUser();
