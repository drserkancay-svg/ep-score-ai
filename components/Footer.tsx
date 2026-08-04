import Image from "next/image";
import Link from "next/link";

function FooterLink({
  href,
  text,
}: {
  href: string;
  text: string;
}) {
  const external = href.startsWith("http");

  const className =
    "font-medium text-slate-500 transition duration-200 hover:text-cyan-700";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {text}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {text}
    </Link>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div className="max-w-md">
          <Link
            href="/"
            aria-label="EP-SCORE AI home"
            className="inline-flex items-center"
          >
            <Image
              src="/images/ep-score-ai-logo.svg"
              alt="EP-SCORE AI — Electrophysiology Calculators"
              width={340}
              height={72}
              className="h-[62px] w-auto object-contain sm:h-[68px]"
              priority
            />
          </Link>

          <p className="mt-5 text-sm leading-7 text-slate-600">
            Evidence-based clinical decision-support calculators for cardiac
            electrophysiology, designed with current guideline recommendations
            and validated clinical risk models.
          </p>
        </div>

        <div className="sm:text-right">
          <h3 className="text-lg font-bold text-slate-900">
            Developed by Serkan Cay
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Cardiac Electrophysiology Specialist
            <br />
            Web Developer & AI Researcher
          </p>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm sm:justify-end">
            <FooterLink href="/scores" text="Calculators" />
            <FooterLink href="/references" text="References" />
            <FooterLink
              href="https://jaejournal.com/index.php/jaejournal"
              text="Journal"
            />
            <FooterLink
              href="https://x.com/prof_serkan_cay"
              text="X Profile"
            />
            <FooterLink
              href="https://profdrserkancay.com.bilkentaritmi.com.tr/"
              text="Website"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {currentYear} EP-SCORE AI. All rights reserved.</p>

          <p>Clinical Decision Support Platform · Version 1.0</p>
        </div>
      </div>
    </footer>
  );
}