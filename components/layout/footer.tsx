import Link from "next/link";
import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line-canvas bg-canvas text-ink/70">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-lg text-ink">
              <Compass className="h-4 w-4 text-brass" />
              GearUp
            </div>
            <p className="mt-3 max-w-xs text-sm">
              Outdoor gear, catalogued and ready — rent what you need, list what
              you don&apos;t.
            </p>
          </div>

          <FooterColumn
            title="Explore"
            links={[
              ["Browse gear", "/gear"],
              ["List your gear", "/dashboard/provider/gear/new"],
            ]}
          />
          <FooterColumn
            title="Account"
            links={[
              ["Log in", "/auth/login"],
              ["Sign up", "/auth/register"],
            ]}
          />
          <FooterColumn
            title="Categories"
            links={[
              ["Camping", "/gear?category=camping"],
              ["Climbing", "/gear?category=climbing"],
              ["Water sports", "/gear?category=water-sports"],
            ]}
          />
        </div>

        <div className="mt-10 border-t border-line-canvas pt-6 text-xs">
          © {new Date().getFullYear()} GearUp. Field-tested, not corporate.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-tag text-xs uppercase tracking-wider text-brass">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="hover:text-ink">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
