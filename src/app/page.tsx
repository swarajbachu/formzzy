import Image from "next/image";
import MyForm from "./form-components/form";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="flex flex-col items-center justify-center space-y-8 p-12">
        <h1 className="text-xl font-bold">Event registration</h1>
        <MyForm />
      </Card>
    </main>
  );
}
