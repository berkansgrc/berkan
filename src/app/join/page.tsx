import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

export const metadata = {
  title: "Sınava Katıl | Berkan Matematik",
};

async function joinExam(formData: FormData) {
  "use server";

  const shareCode = formData.get("shareCode") as string;

  if (!shareCode || shareCode.trim().length < 4) {
    redirect("/join?error=" + encodeURIComponent("Geçerli bir kod girin."));
  }

  const supabase = await createClient();

  const { data: exam } = await supabase
    .from("exams")
    .select("id")
    .eq("share_code", shareCode.trim())
    .eq("is_published", true)
    .single();

  if (!exam) {
    redirect("/join?error=" + encodeURIComponent("Bu koda ait sınav bulunamadı."));
  }

  redirect(`/exams/${exam.id}/take`);
}

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-3">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
            <KeyRound className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Sınava Katıl</CardTitle>
          <CardDescription>
            Öğretmeninizden aldığınız paylaşım kodunu girin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {params.error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {params.error}
            </div>
          )}
          <form action={joinExam} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shareCode">Paylaşım Kodu</Label>
              <Input
                id="shareCode"
                name="shareCode"
                placeholder="Örn: a1b2c3d4"
                className="text-center text-lg tracking-widest font-mono h-12"
                maxLength={12}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Sınava Gir
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
