import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUpSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="justify-items-center">
          <CheckCircle2 className="size-12 text-green-600" />
          <CardTitle>Conta criada com sucesso</CardTitle>
          <CardDescription>
            Sua conta foi criada. Em breve você poderá acessar a plataforma.
          </CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}
