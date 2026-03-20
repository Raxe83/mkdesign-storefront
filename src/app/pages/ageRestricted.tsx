'use client'
import Link from "next/link";
import Button from "../components/ui/Button";

export default function AgeRestrictedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Altersverifikation</h1>
      <p className="mb-6 max-w-md">Bist du 18 Jahre oder älter?</p>
      <Link href="/">
        <Button
          color={"primary"}
          onClick={() => {}}
        >Zurück zur Startseite</Button>
      </Link>
    </div>
  );
}
