export const metadata = { title: "Privacy Policy | Jeevan Sutra", robots: { index: false, follow: false } };
const sections = [
  [
    "Who operates Jeevan Sutra",
    "Jeevan Sutra is operated by Shekhar Sales Corporation, represented by Shashank Shekhar. Our website is https://www.jeevansutra.co.in. Our designated support and privacy contact is shashankshkhr2@gmail.com."
  ],
  [
    "Information used by the service",
    "We process information you provide when creating or using your account, including your name, email address, date of birth and profile photo where provided. Compatibility readings also use the comparison details you enter, such as another person’s name, date of birth and your selected relationship. Please obtain permission before providing another person’s personal information."
  ],
  [
    "Google sign-in",
    "When you choose Google sign-in, Google and our authentication provider help verify your identity. Basic account information, such as your name, email address, account identifier and available profile picture, may be provided to establish your account. Google handles your Google password; it is not provided to Jeevan Sutra."
  ],
  [
    "Why we use information",
    "We use account information to provide sign-in, prepare personalised readings, save insights for later access, respond to support requests and protect the service from misuse. Information entered for a comparison is used to prepare and save that comparison. Numerology readings are interpretations for reflection, not verified facts about a person."
  ],
  [
    "Service providers and sharing",
    "Our service uses Supabase for authentication and data storage, Vercel for website hosting and web analytics, and Resend for sending service emails. These providers process information needed for their functions. Google processes information when you use Google sign-in. If you choose a report-sharing feature, the intended recipient or a person with access to the shared link may be able to view the information included in that report."
  ],
  [
    "Website usage and browser storage",
    "The website includes Vercel Web Analytics to help us understand visits and improve the service. Vercel describes this analytics service as cookie-free. Sign-in may separately use cookies or browser storage to maintain your session. Hosting and authentication services may also process technical information needed for security and reliable operation."
  ],
  [
    "Keeping and deleting information",
    "Account details and saved insights are retained to provide your account and reading history. You may request access, correction or deletion by contacting our support address. We may need to verify that a request belongs to the account holder. Any necessary retention for security or legal obligations, and the handling of backup copies, will be explained when responding to your request."
  ],
  [
    "Your choices",
    "You can choose whether to use Google sign-in, whether to provide an optional photo and whether to create or share a comparison. You can remove Google account access through your Google Account settings. Removing Google access does not automatically delete information already saved in Jeevan Sutra; contact support to request deletion."
  ],
  [
    "Contact and updates",
    "For privacy questions or account-data requests, contact shashankshkhr2@gmail.com. Updates to this notice will be published on this page."
  ]
];
export default function PrivacyPage() { return <main className="min-h-screen bg-[#FAF7F0] px-5 py-10 text-[#463B3B]"><article className="mx-auto max-w-3xl"><p className="mb-6 rounded-lg border border-[#D2B577] p-4">Draft for review. The support inbox and data-handling details must be confirmed before publication.</p><h1 className="mb-8 font-serif text-4xl text-[#64263B]">Privacy Policy</h1>{sections.map(([title,text]) => <section key={title} className="mb-8"><h2 className="mb-3 text-xl font-semibold text-[#64263B]">{title}</h2><p className="text-base leading-8">{text}</p></section>)}</article></main> }
