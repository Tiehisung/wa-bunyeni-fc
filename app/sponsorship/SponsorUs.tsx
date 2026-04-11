import { Mail, Phone, HandshakeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEAM } from "@/data/team";
 

export default function SponsorUs() {
  return (
    <section className="w-full py-16 px-6 bg-card rounded-2xl ">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-semibold mb-4">
          Partner & Sponsor {TEAM.name}
        </h2>
        <p className="text-lg opacity-90 mb-8">
          We are committed to developing young football talent in the community
          of {"Bunye ni"}. By sponsoring our club, you help provide training,
          equipment, welfare and future opportunities for rising players.
        </p>

        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          <div className="p-6 bg-background/20 rounded-xl backdrop-blur-md border border-border/20">
            <HandshakeIcon className="w-10 h-10 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Brand Exposure</h3>
            <p className="_p">
              Get your logo on jerseys, banners, social media, and matchday
              events.
            </p>
          </div>

          <div className="p-6 bg-background/20 rounded-xl backdrop-blur-md border border-border/20">
            <Phone className="w-10 h-10 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Community Impact</h3>
            <p className="_p">
              Sponsoring {TEAM.name} empowers youth and supports local
              development.
            </p>
          </div>

          <div className="p-6 bg-background/20 rounded-xl backdrop-blur-md border border-border/20">
            <Mail className="w-10 h-10 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Flexible Packages</h3>
            <p className="_p">
              Choose sponsorship tiers: jerseys, transport, kits, welfare, and
              more.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="_primaryBtn h-12 text-lg rounded-xl"
          >
            <a
              href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}?subject=Sponsorship%20Inquiry`}
            >
              Become a Sponsor
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 _secondaryBtn text-lg rounded-xl"
          >
            <a href={`tel:${TEAM.contact || "+232XXXXXXXXX"}`}>Call Us</a>
          </Button>
        </div>

        <p className="mt-6 text-sm opacity-70">
          We welcome individuals, companies, NGOs and community groups to
          support our mission.
        </p>
      </div>
    </section>
  );
}
