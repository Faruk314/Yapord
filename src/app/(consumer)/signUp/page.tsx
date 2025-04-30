import SignUpForm from "@/features/auth/components/SignUpForm";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>;
}) {
  const { oauthError } = await searchParams;

  return (
    <section className="flex flex-col items-center justify-center h-[100vh]">
      <SignUpForm />
      {oauthError && <p className="text-red-600 mt-4">{oauthError}</p>}
    </section>
  );
}
