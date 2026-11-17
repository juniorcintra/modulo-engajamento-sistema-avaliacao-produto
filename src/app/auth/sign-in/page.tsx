import { LatestReview } from "@/components/auth/latest-review";
import { SignInScreen } from "@/components/sign-in-screen";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return <SignInScreen panelExtra={<LatestReview />} />;
}
