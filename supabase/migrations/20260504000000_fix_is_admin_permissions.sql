-- Grant execute on is_admin() to anon so the RLS policy on vehicles works
-- for unauthenticated visitors. auth.uid() returns null for anon, so is_admin()
-- returns false and the policy resolves to: is_available = true.
grant execute on function public.is_admin() to anon;
