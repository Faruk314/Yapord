import { redirect } from "next/navigation";
export default function MainPage() {
  redirect("/server");

  return <section className="">HELLO</section>;
}
