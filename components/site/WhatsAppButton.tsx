import SocialIcon from "@/components/site/SocialIcon";
import { WHATSAPP_NUMBER, whatsappUrl } from "@/lib/social";

// Green "chat with us" button in the bottom corner of every page
// (hidden until WHATSAPP_NUMBER is set in lib/social.ts)
export default function WhatsAppButton() {
  if (WHATSAPP_NUMBER == "") {
    return null;
  }
  return (
    <a
      href={whatsappUrl("Hello Gazellekey, I would like to know more about")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed print:hiddenright-5 bottom-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_16px_32px_-12px_rgba(37,211,102,0.9)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5a] sm:right-6 sm:bottom-6"
    >
      <SocialIcon network="whatsapp" className="h-7 w-7" />
      <span className="hidden max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-all duration-300 group-hover:max-w-40 group-hover:pr-1 sm:block">
        Chat with us
      </span>
    </a>
  );
}
