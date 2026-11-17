import bcrypt from "bcryptjs";
import type { SignInInput } from "@/lib/schemas/sign-in";
import { getSupabase } from "@/server/db/supabase";

const DUMMY_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8.4m3kC1kQ0Z3T1b8nQJ3a1m1y1v8e";

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Email ou senha inválidos");
  }
}

export async function signIn(input: SignInInput) {
  const { data, error } = await getSupabase()
    .from("accounts")
    .select("id, first_name, last_name, email, password, active")
    .eq("email", input.email)
    .maybeSingle();

  if (error) throw error;

  const valid = await bcrypt.compare(
    input.password,
    data?.password ?? DUMMY_HASH,
  );
  if (!data || !data.active || !valid) throw new InvalidCredentialsError();

  return {
    accountId: data.id as string,
    firstName: data.first_name as string,
    lastName: data.last_name as string,
    email: data.email as string,
  };
}
