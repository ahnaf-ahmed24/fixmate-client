import Hero from "@/components/home/Hero";
import FeaturedServices from "@/components/home/FeaturedServices";
import HowItWorks from "@/components/home/HowItWorks";
import PopularCategories from "@/components/home/PopularCategories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CtaBanner from "@/components/home/CtaBanner";

export const metadata = { title: "FixMate — Smart device & appliance repair" };

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <HowItWorks />
      <PopularCategories />
      <WhyChooseUs />
      <CtaBanner />
    </>
  );
}
