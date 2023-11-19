export async function useLogout() {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();

  if (user) {
    supabase.auth.signOut();
    await navigateTo("/login");
  }
}