export const metadata = { title: "Terms of Use | Jeevan Sutra", robots: { index: false, follow: false } };
const sections = [
  [
    "About Jeevan Sutra",
    "Jeevan Sutra is operated by Shekhar Sales Corporation, represented by Shashank Shekhar. These terms describe the use of our website, account features and personal guidance readings."
  ],
  [
    "Purpose of the readings",
    "Our numerology and compatibility readings use traditional interpretations for personal reflection. They are not scientific assessments, guarantees or predictions of a particular outcome. A compatibility reading cannot establish another person’s feelings, intentions or future behaviour."
  ],
  [
    "Your decisions",
    "Use the readings as one source of reflection alongside your own experience and judgement. They do not replace advice from a qualified medical, mental-health, legal or financial professional. Do not use a reading alone to make an important health, financial or relationship decision."
  ],
  [
    "Your account and information",
    "Provide accurate information and keep access to your account secure. Do not use another person’s account without permission. If you enter another person’s details for a comparison, obtain their permission. Do not submit information that you are not authorised to use."
  ],
  [
    "Respectful use",
    "Do not use the service to harass others, impersonate someone, access private records without permission or interfere with the website. A reading should not be used to label, threaten or discriminate against another person."
  ],
  [
    "Saved and shared readings",
    "You may save readings using the features available in your account. Before sharing a reading, check the personal details it contains and obtain permission from any other person whose information is included. People who receive a shared link may be able to view or pass on its contents."
  ],
  [
    "Free and paid services",
    "Any free-reading allowance and its conditions will be shown in the relevant feature. Before purchasing a paid service, review its description, price, cancellation and refund terms. These general terms do not establish a blanket no-refund policy or remove rights available under applicable law."
  ],
  [
    "Availability and corrections",
    "The website and readings may be updated as we improve the service. Errors or interruptions may occur. Please report incorrect account details or technical problems so that we can investigate. Changes to features or terms will be explained where relevant."
  ],
  [
    "Privacy",
    "Our Privacy Policy explains how account information, comparison details and website usage information are handled. Please read it alongside these terms."
  ],
  [
    "Contact",
    "For support or questions about these terms, contact shashankshkhr2@gmail.com."
  ]
];
export default function TermsPage() { return <main className="min-h-screen bg-[#FAF7F0] px-5 py-10 text-[#463B3B]"><article className="mx-auto max-w-3xl"><p className="mb-6 rounded-lg border border-[#D2B577] p-4">Draft for review before publication.</p><h1 className="mb-8 font-serif text-4xl text-[#64263B]">Terms of Use</h1>{sections.map(([title,text]) => <section key={title} className="mb-8"><h2 className="mb-3 text-xl font-semibold text-[#64263B]">{title}</h2><p className="text-base leading-8">{text}</p></section>)}<a className="underline text-[#64263B]" href="/website/privacy">Read our Privacy Policy</a></article></main> }
