import type { Metadata } from "next";

import LegalPage from "../../../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Illustrative privacy information for the Aurelle portfolio storefront.",
};

const sections = [
  {
    title: "Information in this preview",
    copy: "Checkout, promotion and newsletter controls currently demonstrate frontend interaction only. No payment is processed, and those preview details are not stored by Aurelle.",
  },
  {
    title: "Accounts and future services",
    copy: "Account screens are prepared for a later backend phase. Before production, authentication, storage, retention and consent practices must be documented against the services actually connected.",
  },
  {
    title: "Analytics and cookies",
    copy: "This concept does not intentionally install marketing trackers. Any future analytics or personalisation tooling should be disclosed with appropriate controls before deployment.",
  },
  {
    title: "Your choices",
    copy: "A production policy should explain how customers can access, correct or remove personal information and how privacy questions are handled under applicable Australian law.",
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy overview"
      title="Handled with discretion."
      introduction="A clear preview of how privacy will be approached when the Aurelle storefront moves from concept to production."
      sections={sections}
    />
  );
}
