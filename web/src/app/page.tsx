import { redirect } from "next/navigation";
export default function MainPage() {
  redirect("/home");

  return <section className="">HELLO</section>;
}
