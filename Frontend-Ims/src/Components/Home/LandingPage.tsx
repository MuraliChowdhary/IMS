import { LandingPage2 } from "./Nav";
import HeroSectionOne from "../hero-section-demo-1";
import { BenefitsSection, FAQSection, IntegrationSecuritySection, KeyFeaturesSection, UseCasesSection } from "../HomeFeatures";

export const LandingPage = () => {
  return (
    <div className="relative">
      <div className="bg-black min-h-screen flex flex-col">
      <header className="w-full">
        <LandingPage2 />
      </header>
      <main className="absolute flex flex-col items-center justify-center w-full h-screen bg-black  mt-20">
        <HeroSectionOne />
      </main>
    </div>
        <KeyFeaturesSection/>
        <BenefitsSection/>
        <UseCasesSection/>
        <IntegrationSecuritySection/>

        <FAQSection/>
    </div>
  );
};