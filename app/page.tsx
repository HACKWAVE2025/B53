import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HeroSection from "@/components/hero-section";
import FAQsThree from "@/components/faqs-3";
import Faq3 from "@/components/mvpblocks/faq-3";
import ContentSection1 from "@/components/content-1";
import ContentSection2 from "@/components/content-2";
export default async function Home() {
  const session = await getServerSession();

  // Redirect to dashboard if user is authenticated
  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <HeroSection />
      <ContentSection1 />
      <ContentSection2 />
      <Faq3 />
    </>
  );
}
