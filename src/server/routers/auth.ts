import { TRPCError } from "@trpc/server";
import { signUpSchema } from "@/lib/schemas/sign-up";
import { EmailAlreadyRegisteredError, signUp } from "@/server/services/sign-up";
import { publicProcedure, router } from "@/server/trpc";

export const authRouter = router({
  signUp: publicProcedure.input(signUpSchema).mutation(async ({ input }) => {
    try {
      return await signUp(input);
    } catch (error) {
      if (error instanceof EmailAlreadyRegisteredError) {
        throw new TRPCError({ code: "CONFLICT", message: error.message });
      }
      throw error;
    }
  }),
});
