import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import type { SignUpInput } from "@/lib/schemas/sign-up";
import { getSupabase } from "@/server/db/supabase";

const SALT_ROUNDS = 10;
const UNIQUE_VIOLATION = "23505";

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("Email já cadastrado");
  }
}

export async function signUp(input: SignUpInput) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const password = await bcrypt.hash(input.password, salt);
  const id = nanoid();

  const { error } = await getSupabase().from("accounts").insert({
    id,
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    password,
    salt,
    active: true,
  });

  if (error) {
    if (error.code === UNIQUE_VIOLATION)
      throw new EmailAlreadyRegisteredError();
    throw error;
  }

  return { id };
}
