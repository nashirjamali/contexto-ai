import Link from "next/link";
import {
  FileText,
  Link2,
  MessageSquare,
  Shield,
  Upload,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Cited answers",
    description:
      "Ask questions in plain English and get responses grounded in your documents, with source citations you can verify.",
  },
  {
    icon: Users,
    title: "Team workspaces",
    description:
      "Organize documents by project or team. Invite members with roles — owner, admin, member, or viewer.",
  },
  {
    icon: Link2,
    title: "Public share links",
    description:
      "Publish a read-only chat link for any document. Enable, disable, or set an expiry — no login required for visitors.",
  },
  {
    icon: Shield,
    title: "Tenant isolation",
    description:
      "Each organization's data stays separate. Workspaces, documents, and chat history are scoped to your team.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create a workspace",
    description: "Sign up, name your organization, and invite teammates to a shared workspace.",
  },
  {
    step: "02",
    title: "Upload documents",
    description: "Drop PDFs or text files. Contexto parses, chunks, and indexes them automatically.",
  },
  {
    step: "03",
    title: "Chat with your files",
    description: "Ask anything about the content. The AI retrieves relevant passages and cites the source.",
  },
  {
    step: "04",
    title: "Share when ready",
    description: "Generate a public link for clients or stakeholders who need read-only access to one document.",
  },
];

const useCases = [
  {
    title: "Legal & compliance",
    description: "Query contracts, policies, and filings without scrolling through hundreds of pages.",
  },
  {
    title: "Research teams",
    description: "Turn reports and papers into a searchable knowledge base the whole team can interrogate.",
  },
  {
    title: "Customer success",
    description: "Share product docs via public links so customers get instant answers without a support ticket.",
  },
];

export default function Home() {
  return (
    <div className="mesh-bg min-h-screen">
      <header className="animate-fade-up flex items-center justify-between px-8 py-6 md:px-16">
        <span className="font-display text-2xl font-medium tracking-tight text-paper">
          Contexto
        </span>
        <nav className="flex items-center gap-6 text-sm text-paper-muted">
          <Link href="/login" className="transition-colors hover:text-paper">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-sm bg-bronze px-4 py-2 font-medium text-ink transition-colors hover:bg-bronze-dim"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-7xl gap-16 px-8 pb-20 pt-12 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-16 md:pt-20">
          <div>
            <p className="animate-fade-up-delay-1 mb-4 text-sm uppercase tracking-[0.2em] text-bronze">
              Document Intelligence
            </p>
            <h1 className="animate-fade-up-delay-1 font-display text-5xl leading-[1.1] tracking-tight text-paper md:text-6xl lg:text-7xl">
              Your files,
              <br />
              <span className="italic text-bronze">conversational.</span>
            </h1>
            <p className="animate-fade-up-delay-2 mt-6 max-w-lg text-lg leading-relaxed text-paper-muted">
              Contexto turns PDFs and documents into a team knowledge base you
              can chat with. Upload once, ask questions in natural language, and
              get cited answers grounded in your source material.
            </p>
            <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-sm bg-bronze px-6 py-3 font-medium text-ink transition-all hover:bg-bronze-dim hover:shadow-[0_0_32px_rgba(212,165,116,0.25)]"
              >
                Start for free
              </Link>
              <Link
                href="/login"
                className="rounded-sm border border-surface-raised px-6 py-3 text-paper transition-all hover:border-bronze hover:text-bronze"
              >
                Sign in
              </Link>
            </div>
            <dl className="animate-fade-up-delay-3 mt-12 grid grid-cols-3 gap-6 border-t border-surface-raised pt-8">
              <div>
                <dt className="font-display text-2xl text-paper">RAG</dt>
                <dd className="mt-1 text-sm text-paper-muted">Retrieval-augmented chat</dd>
              </div>
              <div>
                <dt className="font-display text-2xl text-paper">Teams</dt>
                <dd className="mt-1 text-sm text-paper-muted">Multi-tenant workspaces</dd>
              </div>
              <div>
                <dt className="font-display text-2xl text-paper">Share</dt>
                <dd className="mt-1 text-sm text-paper-muted">Public document links</dd>
              </div>
            </dl>
          </div>

          <div className="animate-fade-up-delay-2 relative hidden h-[420px] md:block">
            <div className="animate-float absolute -right-4 top-8 z-10 w-64 rounded-sm border border-surface-raised bg-surface p-5 shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
              <div className="mb-3 h-1.5 w-12 rounded-full bg-bronze" />
              <p className="font-display text-lg text-paper">
                Q4 Revenue Report.pdf
              </p>
              <p className="mt-1 text-xs text-paper-muted">Ready · 42 pages</p>
            </div>
            <div className="absolute right-16 top-32 w-64 -rotate-3 rounded-sm border border-surface-raised bg-surface-raised p-5 opacity-80 shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
              <div className="mb-3 h-1.5 w-12 rounded-full bg-sage" />
              <p className="font-display text-lg text-paper">
                Product Roadmap.docx
              </p>
              <p className="mt-1 text-xs text-paper-muted">Processing…</p>
            </div>
            <div className="absolute right-0 top-56 w-72 rotate-1 rounded-sm border border-bronze/30 bg-surface p-5 shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
              <p className="mb-2 text-xs uppercase tracking-wider text-bronze">
                Citation
              </p>
              <p className="text-sm leading-relaxed text-paper-muted">
                &ldquo;Revenue grew 23% quarter-over-quarter, driven primarily by
                enterprise adoption…&rdquo;
              </p>
              <p className="mt-2 font-mono text-xs text-paper-muted/60">
                Q4 Revenue Report · p. 12
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-surface-raised bg-surface/40 px-8 py-20 md:px-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm uppercase tracking-[0.2em] text-bronze">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">
              From upload to answer in minutes
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-sm border border-surface-raised bg-surface p-6"
                >
                  <span className="font-mono text-sm text-bronze">{item.step}</span>
                  <h3 className="mt-3 font-display text-xl text-paper">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-8 py-20 md:px-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm uppercase tracking-[0.2em] text-bronze">
              Features
            </p>
            <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">
              Built for teams that live in documents
            </h2>
            <p className="mt-4 max-w-2xl text-paper-muted">
              Everything you need to ingest files, collaborate in workspaces,
              meter usage, and share knowledge outside your organization.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-4 rounded-sm border border-surface-raised bg-surface p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-bronze/10 text-bronze">
                    <feature.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-paper">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-paper-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="rounded-sm border border-surface-raised bg-surface-raised/50 p-5">
                <Upload size={18} className="text-bronze" />
                <p className="mt-3 font-display text-lg text-paper">
                  Automatic ingestion
                </p>
                <p className="mt-1 text-sm text-paper-muted">
                  PDF parsing, chunking, and vector indexing run in the background after upload.
                </p>
              </div>
              <div className="rounded-sm border border-surface-raised bg-surface-raised/50 p-5">
                <FileText size={18} className="text-bronze" />
                <p className="mt-3 font-display text-lg text-paper">
                  Document status
                </p>
                <p className="mt-1 text-sm text-paper-muted">
                  Track uploading, processing, ready, or failed states per file with page counts.
                </p>
              </div>
              <div className="rounded-sm border border-surface-raised bg-surface-raised/50 p-5">
                <Zap size={18} className="text-bronze" />
                <p className="mt-3 font-display text-lg text-paper">
                  Usage billing
                </p>
                <p className="mt-1 text-sm text-paper-muted">
                  Stripe-powered plans with metered usage for documents processed and queries run.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-surface-raised px-8 py-20 md:px-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm uppercase tracking-[0.2em] text-bronze">
              Use cases
            </p>
            <h2 className="mt-3 font-display text-3xl text-paper md:text-4xl">
              Where teams use Contexto
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {useCases.map((item) => (
                <div
                  key={item.title}
                  className="border-l-2 border-bronze/50 pl-6"
                >
                  <h3 className="font-display text-xl text-paper">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-8 pb-24 md:px-16">
          <div className="mx-auto max-w-7xl rounded-sm border border-bronze/20 bg-surface px-8 py-14 text-center md:px-16">
            <h2 className="font-display text-3xl text-paper md:text-4xl">
              Ready to chat with your documents?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-paper-muted">
              Create a free workspace, upload your first file, and start asking
              questions in under five minutes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="rounded-sm bg-bronze px-6 py-3 font-medium text-ink transition-all hover:bg-bronze-dim"
              >
                Create your workspace
              </Link>
              <Link
                href="/login"
                className="rounded-sm border border-surface-raised px-6 py-3 text-paper transition-all hover:border-bronze hover:text-bronze"
              >
                Sign in to existing account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-surface-raised px-8 py-10 md:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-paper-muted md:flex-row">
          <span className="font-display text-lg text-paper">Contexto</span>
          <p>Document intelligence for teams · RAG · Workspaces · Public links · Billing</p>
          <div className="flex gap-6">
            <Link href="/login" className="transition-colors hover:text-paper">
              Sign in
            </Link>
            <Link href="/register" className="transition-colors hover:text-paper">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
