import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="grid justify-items-center gap-4 py-20 text-center">
      <h1 className="font-display text-4xl font-bold tracking-tight">
        Produto não encontrado
      </h1>
      <p className="text-muted-foreground">
        Ele pode ter sido removido ou o endereço está incorreto.
      </p>
      <Link href="/" className={buttonVariants({ size: "lg" })}>
        Voltar para a home
      </Link>
    </div>
  );
}
