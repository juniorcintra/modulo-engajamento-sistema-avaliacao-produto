// STUB-PROVISORIO: substituído pela implementação da feature sign-in no merge.
export type Session = {
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
};

export async function getSession(): Promise<Session | null> {
  return null;
}
