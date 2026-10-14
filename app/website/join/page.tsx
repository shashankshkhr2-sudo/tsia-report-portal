'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  Compass,
  HeartHandshake,
  Users,
} from 'lucide-react'

const benefits = [
  {
    icon: Users,
    title: 'Understand the person behind the chart and numbers',
    description:
      'A client is more than a birth date. Jeevan Sutra is being built to bring together their background, questions, reports and consultation history—helping you prepare better and offer more personal, meaningful guidance.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Create more opportunities to earn',
    description:
      'Approved practitioners can be considered for paid consultations matched to their expertise, languages and availability. Put your knowledge to work through consultations, reports and thoughtful follow-ups.',
  },
  {
    icon: HeartHandshake,
    title: 'Build stronger client relationships',
    description:
      'Give clients a more connected guidance experience. Organized information and consultation history can help you understand their changing needs and bring continuity to your work.',
  },
]

const guidanceAreas = [
  'Personal & Life Guidance',
  'Career & Professional Guidance',
  'Relationships & Family',
  'Marriage Guidance',
  'Business & Financial Direction',
  'Names & Numerology',
  'Remedies & Yantras',
  'Other',
]

const fieldClass =
  'mt-2 w-full rounded-xl border border-[#ded4cb] bg-white px-4 py-3 text-base outline-none transition focus:border-[#81243f] focus:ring-2 focus:ring-[#81243f]/15'

const labelClass =
  'block text-sm font-medium text-[#392c30]'

function TextField({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  maxLength = 150,
}: {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'url'
  required?: boolean
  placeholder?: string
  maxLength?: number
}) {
  return (
    <label className={labelClass}>
      {label}
      {required && ' *'}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className={fieldClass}
      />
    </label>
  )
}

export default function JoinPage() {
  const [expertise, setExpertise] = useState('')
  const [qualificationType, setQualificationType] = useState('')
  const [introduction, setIntroduction] = useState('')

  return (
    <main className="min-h-screen bg-[#faf6ef] text-[#392c30]">


      <section className="bg-[#81243f] px-5 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f1c780]">
            The Complete Guidance Experience
          </p>

          <h1 className="mt-6 font-serif text-4xl font-semibold sm:text-6xl">
            Join Jeevan Sutra
          </h1>

          <p className="mx-auto mt-6 max-w-3xl font-serif text-2xl leading-relaxed text-[#f8e6e8] sm:text-3xl">
            Bring your knowledge.
            <br />
            Build your practice. Reach more people.
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/85">
            Whether you have guided clients for years or are beginning
            your professional journey, Jeevan Sutra invites you to
            take the next step.
          </p>

          <a
            href="#application"
            className="mt-9 inline-flex items-center justify-center gap-3 rounded-xl bg-[#f1c780] px-7 py-4 font-semibold text-[#492e25] transition hover:bg-[#f6d69f]"
          >
            Apply to Join — Free
            <ArrowRight className="size-5" aria-hidden="true" />
          </a>

          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-white/85">
            {[
              'For astrologers & numerologists',
              'No practitioner subscription fee',
              'Continue your independent practice',
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check
                  className="size-4 shrink-0 text-[#f1c780]"
                  aria-hidden="true"
                />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a57a40]">
            A More Complete Way to Guide
          </p>

          <h2 className="mt-4 font-serif text-3xl font-semibold text-[#81243f] sm:text-4xl">
            Your expertise, supported by a fuller client picture.
          </h2>

          <p className="mt-5 text-base leading-8 text-[#766b67]">
            Meaningful guidance begins with understanding. Our vision
            is to help practitioners study each client more thoroughly,
            explain their findings clearly and deliver a more
            thoughtful experience.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-3xl border border-[#e8dbce] bg-white p-7 shadow-sm"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-[#f7e9d5] text-[#81243f]">
                <Icon className="size-6" aria-hidden="true" />
              </div>

              <h3 className="mt-5 font-serif text-xl font-semibold leading-7 text-[#81243f]">
                {title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#766b67]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#e9ddcf] bg-white px-5 py-14">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <article className="rounded-3xl bg-[#faf6ef] p-7 sm:p-9">
            <BookOpen
              className="size-8 text-[#a57a40]"
              aria-hidden="true"
            />

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#a57a40]">
              Established Practitioners
            </p>

            <h2 className="mt-3 font-serif text-2xl font-semibold text-[#81243f]">
              Bring your experience to a wider audience.
            </h2>

            <p className="mt-4 text-sm leading-8 text-[#766b67]">
              You have invested years in learning, interpretation and
              client relationships. Explore opportunities to bring that
              depth to new clients, with tools designed to support
              preparation, reports and continuity of guidance.
            </p>

            <p className="mt-4 font-medium leading-7 text-[#81243f]">
              Let your expertise reach further.
            </p>
          </article>

          <article className="rounded-3xl bg-[#faf6ef] p-7 sm:p-9">
            <Compass
              className="size-8 text-[#a57a40]"
              aria-hidden="true"
            />

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#a57a40]">
              Emerging Practitioners
            </p>

            <h2 className="mt-3 font-serif text-2xl font-semibold text-[#81243f]">
              Give your knowledge a professional beginning.
            </h2>

            <p className="mt-4 text-sm leading-8 text-[#766b67]">
              If you are beginning your practice, we welcome your
              application. Tell us what you have studied and how you
              approach guidance. Demonstrate your knowledge through
              our selection process and be considered for opportunities
              suited to your readiness and strengths.
            </p>

            <p className="mt-4 font-medium leading-7 text-[#81243f]">
              Let your ability speak for itself.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 text-center">
        <h2 className="font-serif text-3xl font-semibold text-[#81243f]">
          Grow with Jeevan Sutra. Keep your independence.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#766b67]">
          There is no registration or practitioner subscription fee.
          You can continue your own practice while honouring the
          consultations you accept through Jeevan Sutra.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#766b67]">
          Human consultation opportunities are for paying customers.
          Assignment suitability, availability and payment terms
          will be discussed before you accept work.
        </p>
      </section>

      <section className="bg-[#f1e8dc] px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-serif text-3xl font-semibold text-[#81243f]">
            A Clear Path to Joining
          </h2>

          <div className="mt-9 grid gap-5 sm:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Tell us about yourself',
                text:
                  'Share your expertise, experience, learning background and availability.',
              },
              {
                number: '02',
                title: 'Let us understand your strengths',
                text:
                  'We review applications and invite suitable applicants to the next stage of assessment.',
              },
              {
                number: '03',
                title: 'Begin after approval',
                text:
                  'Selected practitioners complete onboarding before being considered for paid assignments.',
              },
            ].map(({ number, title, text }) => (
              <article key={number} className="rounded-2xl bg-white p-6">
                <p className="font-serif text-3xl text-[#a57a40]">
                  {number}
                </p>

                <h3 className="mt-4 text-lg font-semibold text-[#81243f]">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#766b67]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="application"
        className="mx-auto max-w-3xl scroll-mt-8 px-5 py-14"
      >
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a57a40]">
            Your Next Chapter
          </p>

          <h2 className="mt-4 font-serif text-3xl font-semibold text-[#81243f]">
            Apply to Join Jeevan Sutra
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#766b67]">
            Established expertise or a promising beginning—we would
            like to understand what you can bring.
          </p>
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="mt-8 rounded-3xl border border-[#e8dbce] bg-white p-6 shadow-sm sm:p-8"
        >
          <p className="text-xs leading-6 text-[#817875]">
            Fields marked * are required. Please do not include client
            names, personal client records or identity documents.
          </p>

          <h3 className="mt-7 font-serif text-xl font-semibold text-[#81243f]">
            About You
          </h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <TextField
                label="Full Name"
                name="fullName"
                required
                placeholder="Your full name"
              />
            </div>

            <TextField
              label="Mobile Number"
              name="mobile"
              type="tel"
              required
              maxLength={25}
              placeholder="Include country code"
            />

            <TextField
              label="Email Address"
              name="email"
              type="email"
              required
              maxLength={254}
              placeholder="Your email address"
            />

            <TextField label="City" name="city" required />
            <TextField label="State / Region" name="state" required />

            <div className="sm:col-span-2">
              <TextField
                label="Country"
                name="country"
                required
                placeholder="India"
              />
            </div>
          </div>

          <h3 className="mt-9 font-serif text-xl font-semibold text-[#81243f]">
            Your Practice
          </h3>

          <div className="mt-5 space-y-5">
            <label className={labelClass}>
              Your Expertise *
              <select
                name="expertise"
                required
                value={expertise}
                onChange={(event) => setExpertise(event.target.value)}
                className={fieldClass}
              >
                <option value="">Select your expertise</option>
                <option value="numerologist">Numerologist</option>
                <option value="astrologer">Astrologer</option>
                <option value="both">Both</option>
              </select>
            </label>

            <TextField
              label="Methods / Traditions You Practise"
              name="methods"
              required
              maxLength={300}
              placeholder="For example: Chaldean numerology, Vedic astrology"
            />

            <label className={labelClass}>
              Professional Experience *
              <select name="experience" required className={fieldClass}>
                <option value="">Select your experience</option>
                <option value="starting">Beginning my practice</option>
                <option value="under_1">Less than 1 year</option>
                <option value="1_3">1–3 years</option>
                <option value="4_7">4–7 years</option>
                <option value="8_15">8–15 years</option>
                <option value="over_15">More than 15 years</option>
              </select>
            </label>

            <TextField
              label="Consultation Languages"
              name="languages"
              required
              maxLength={300}
              placeholder="For example: Hindi, English, Marathi"
            />

            <fieldset>
              <legend className="text-sm font-medium">
                Areas of Guidance
              </legend>

              <p className="mt-1 text-xs text-[#817875]">
                Select the areas you are comfortable offering.
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {guidanceAreas.map((area) => (
                  <label
                    key={area}
                    className="flex items-start gap-3 rounded-xl border border-[#e8dbce] p-3 text-sm leading-6"
                  >
                    <input
                      type="checkbox"
                      name="guidanceAreas"
                      value={area}
                      className="mt-1 accent-[#81243f]"
                    />
                    {area}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <h3 className="mt-9 font-serif text-xl font-semibold text-[#81243f]">
            Your Learning Background
          </h3>

          <div className="mt-5 space-y-5">
            <label className={labelClass}>
              Main Learning Background *
              <select
                name="qualificationType"
                required
                value={qualificationType}
                onChange={(event) =>
                  setQualificationType(event.target.value)
                }
                className={fieldClass}
              >
                <option value="">Select your background</option>
                <option value="formal">Formal course / Certification</option>
                <option value="teacher">Learning under a teacher / Mentor</option>
                <option value="traditional">Traditional / Family learning</option>
                <option value="self_taught">Self-taught</option>
                <option value="combined">Combination of these</option>
              </select>
            </label>

            <label className={labelClass}>
              Courses, Teachers & Qualifications *
              <textarea
                name="qualificationDetails"
                required
                rows={4}
                maxLength={1500}
                className={fieldClass}
                placeholder="Tell us what you studied, where or with whom, and any relevant qualifications. Self-taught applicants may describe their study and practice."
              />
            </label>
          </div>

          <h3 className="mt-9 font-serif text-xl font-semibold text-[#81243f]">
            Working With Jeevan Sutra
          </h3>

          <div className="mt-5 space-y-5">
            <label className={labelClass}>
              Preferred Consultation Mode *
              <select name="consultationMode" required className={fieldClass}>
                <option value="">Select a mode</option>
                <option value="online">Online</option>
                <option value="in_person">In person</option>
                <option value="both">Online and in person</option>
              </select>
            </label>

            <label className={labelClass}>
              Approximate Weekly Availability *
              <select name="availability" required className={fieldClass}>
                <option value="">Select availability</option>
                <option value="under_5">Less than 5 hours</option>
                <option value="5_10">5–10 hours</option>
                <option value="11_20">11–20 hours</option>
                <option value="over_20">More than 20 hours</option>
                <option value="flexible">Flexible / To be discussed</option>
              </select>
            </label>

            <label className={labelClass}>
              Tell Us About Your Approach *
              <textarea
                name="introduction"
                required
                rows={5}
                maxLength={1500}
                value={introduction}
                onChange={(event) =>
                  setIntroduction(event.target.value)
                }
                className={fieldClass}
                placeholder="How do you understand a client’s concerns and explain your guidance? What would you like to bring to Jeevan Sutra?"
              />

              <span className="mt-1 block text-right text-xs text-[#817875]">
                {introduction.length}/1500
              </span>
            </label>

            <TextField
              label="Website / Professional Portfolio"
              name="portfolioUrl"
              type="url"
              maxLength={500}
              placeholder="https://..."
            />
          </div>

          <label className="mt-7 flex items-start gap-3 text-sm leading-7">
            <input
              type="checkbox"
              name="accuracyConsent"
              required
              className="mt-2 accent-[#81243f]"
            />
            I confirm that the information I have provided is accurate.
            I understand that registration is an application, and
            approval is required before practitioner access or assignments.
          </label>

          <label className="mt-4 flex items-start gap-3 text-sm leading-7">
            <input
              type="checkbox"
              name="contactConsent"
              required
              className="mt-2 accent-[#81243f]"
            />
            I consent to Jeevan Sutra reviewing this information and
            contacting me about my application and onboarding.
          </label>

          <button
            type="submit"
            disabled
            className="mt-8 w-full cursor-not-allowed rounded-xl bg-[#81243f] px-5 py-4 font-semibold text-white opacity-50"
          >
            Applications Opening Soon
          </button>

          <p className="mt-4 text-center text-xs leading-6 text-[#817875]">
            Application submission is not available yet. Details
            entered on this page are not saved.
          </p>
        </form>
      </section>

      <section className="border-t border-[#e9ddcf] bg-white px-5 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-3xl font-semibold text-[#81243f]">
            Before You Apply
          </h2>

          <div className="mt-7 space-y-3">
            {[
              {
                question: 'Is joining free?',
                answer:
                  'Yes. There is no registration or practitioner subscription fee. Payment arrangements for accepted work will be explained during onboarding.',
              },
              {
                question: 'Can I continue my own practice?',
                answer:
                  'Yes. Practitioners can maintain their independent practice while meeting the commitments they accept through Jeevan Sutra.',
              },
              {
                question: 'Can a beginner apply?',
                answer:
                  'Yes. Emerging practitioners are welcome to apply. Selection considers demonstrated knowledge, communication and readiness to serve clients.',
              },
              {
                question: 'Does registration guarantee paid work?',
                answer:
                  'No. Applications are reviewed before approval. Assignments depend on customer demand, suitability, languages and availability.',
              },
              {
                question: 'What happens after I apply?',
                answer:
                  'Your application will be reviewed. Suitable applicants may be invited to an assessment and onboarding before receiving practitioner access.',
              },
            ].map(({ question, answer }) => (
              <details
                key={question}
                className="rounded-2xl border border-[#e8dbce] bg-[#faf6ef] p-5"
              >
                <summary className="cursor-pointer font-medium text-[#81243f]">
                  {question}
                </summary>

                <p className="mt-3 text-sm leading-7 text-[#766b67]">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e9ddcf] px-5 py-7 text-center text-xs leading-6 text-[#817875]">
        © Jeevan Sutra · The Complete Guidance Experience
      </footer>
    </main>
  )
}
