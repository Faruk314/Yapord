import SignInForm from "@/features/auth/components/SignInForm";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>;
}) {
  const { oauthError } = await searchParams;

  return (
    <section className="flex flex-col justify-center items-center h-[100vh]">
      <SignInForm />
      {oauthError && <p className="text-red-600 mt-4">{oauthError}</p>}
    </section>
  );
}
