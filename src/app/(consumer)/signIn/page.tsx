import SignInForm from "@/features/auth/components/SignInForm";

export default async function SignInPage() {
  return (
    <section className="flex justify-center items-center h-[100vh]">
      <SignInForm />
    </section>
  );
}
