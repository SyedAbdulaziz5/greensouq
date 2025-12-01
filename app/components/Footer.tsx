"use client";

import { useState, useCallback, memo } from "react";
import {
  Mail,
  Instagram,
  MessageCircle,
  Youtube,
  ChevronUp,
  HelpCircle,
  Facebook,
  Linkedin,
  Send,
  Phone,
} from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Email",
    href: "mailto:info@greensouq.ae",
    icon: <Mail className="w-5 h-5" />,
    ariaLabel: "Email us",
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: <Facebook className="w-5 h-5" />,
    ariaLabel: "Follow us on Facebook",
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: <Instagram className="w-5 h-5" />,
    ariaLabel: "Follow us on Instagram",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: <Linkedin className="w-5 h-5" />,
    ariaLabel: "Connect on LinkedIn",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/971585121105",
    icon: <MessageCircle className="w-5 h-5" />,
    ariaLabel: "Message us on WhatsApp",
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: <Youtube className="w-5 h-5" />,
    ariaLabel: "Subscribe on YouTube",
  },
];

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Find It Fast",
    links: [
      { label: "Latest Blogs", href: "/blogs" },
      { label: "FAQ's", href: "/faq" },
    ],
  },
  {
    title: "Important Links",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact us", href: "/contact" },
      { label: "Shipping charges", href: "/shipping" },
      { label: "Terms and Conditions", href: "/terms" },
    ],
  },
  {
    title: "Hot Links",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Checkout", href: "/checkout" },
      { label: "Your Cart", href: "/cart" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const Newsletter = memo(() => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email || !email.includes("@")) {
        setMessage("Please enter a valid email address");
        return;
      }

      setIsSubmitting(true);
      setMessage("");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage("Thanks for subscribing!");
      setEmail("");
      setIsSubmitting(false);

      setTimeout(() => setMessage(""), 3000);
    },
    [email]
  );

  return (
    <div className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            Newsletter
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
            Invite customers to join your mailing list.{" "}
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 border-2 border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all"
                disabled={isSubmitting}
                required
              />
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-black text-white px-8 py-3.5 rounded-sm font-semibold cursor-pointer"
              >
                Sign Up
              </button>
            </div>
            {message && (
              <p
                className={`mt-3 text-sm ${
                  message.includes("Thanks") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

Newsletter.displayName = "Newsletter";

const SocialLinks = memo(() => (
  <div>
    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-5">Follow Us</h3>
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.name}
          href={social.href}
          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-900 hover:bg-lime-600 hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg"
          aria-label={social.ariaLabel}
          target="_blank"
          rel="noopener noreferrer"
        >
          {social.icon}
        </a>
      ))}
    </div>
  </div>
));

SocialLinks.displayName = "SocialLinks";

const FooterSectionComponent = memo(({ title, links }: FooterSection) => (
  <div>
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-5">{title}</h3>
    <ul className="space-y-2 sm:space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            className="text-gray-600 hover:text-lime-600 transition-colors inline-flex items-center group"
          >
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              {link.label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  </div>
));

FooterSectionComponent.displayName = "FooterSection";

const ContactInfo = memo(() => (
  <div>
    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-5">Contact Info</h3>
    <ul className="space-y-2 sm:space-y-3">
      <li>
        <a
          href="tel:+971585121105"
          className="text-gray-600 hover:text-lime-600 transition-colors flex items-center gap-2 group"
        >
          <span className="group-hover:translate-x-1 transition-transform duration-200">
            +971 58 512 1105
          </span>
        </a>
      </li>
      <li>
        <a
          href="mailto:info@greensouq.ae"
          className="text-gray-600 hover:text-lime-600 transition-colors flex items-center gap-2 group"
        >
          <span className="group-hover:translate-x-1 transition-transform duration-200">
            info@greensouq.ae
          </span>
        </a>
      </li>
    </ul>
  </div>
));

ContactInfo.displayName = "ContactInfo";

const ScrollToTopButton = memo(() => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className="w-11 h-11 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center hover:bg-lime-600 hover:border-lime-600 hover:text-white transition-all hover:scale-110 shadow-md group"
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
    </button>
  );
});

ScrollToTopButton.displayName = "ScrollToTopButton";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto" role="contentinfo">
      <Newsletter />

      <div className="bg-gray-50 py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
            <SocialLinks />
            {FOOTER_SECTIONS.map((section) => (
              <FooterSectionComponent key={section.title} {...section} />
            ))}
            <ContactInfo />
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="text-gray-600 text-xs sm:text-sm text-center md:text-left">
                <p className="font-medium">
                  Copyright © 2025 Greensouq. <br />
                  Powered by Shopify
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/help"
                  className="w-11 h-11 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:scale-110 transition-all shadow-md hover:shadow-lg"
                  aria-label="Get help"
                >
                  <Phone className="w-6 h-6 text-white" />
                </a>

                <ScrollToTopButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
