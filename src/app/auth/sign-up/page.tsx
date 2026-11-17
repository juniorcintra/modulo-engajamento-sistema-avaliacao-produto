import { LatestReview } from "@/components/auth/latest-review";
import { SignUpScreen } from "@/components/sign-up-screen";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return <SignUpScreen panelExtra={<LatestReview />} />;
}
