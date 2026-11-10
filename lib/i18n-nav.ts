import { Lang } from "@/lib/i18n";

// Words of the top menu bar, the phone menu and the visitor notice, in every
// language of the language switch (lib/i18n.ts).
export type NavWords = {
  home: string;
  about: string;
  divisions: string;
  workVisa: string;
  fertilizer: string;
  shop: string;
  rentals: string;
  gallery: string;
  reviews: string;
  team: string;
  contact: string;
  signIn: string;
  createAccount: string;
  myAccount: string;
  staffPortal: string;
  bookAppointment: string;
  help: string;
  language: string;
  notSure: string;
  sendEnquiry: string;
  allJobs: string;
  jobsMenuText: string;
  jobsComingSoon: string;
  apply: string;
  more: string;
  visitorNotice: string;
  or: string;
  register: string;
  first: string;
  openMenu: string;
  closeMenu: string;
};

export const NAV_WORDS: Record<Lang, NavWords> = {
  en: {
    home: "Home",
    about: "About Us",
    divisions: "Divisions",
    workVisa: "Work visa",
    fertilizer: "Fertilizer",
    shop: "Shop",
    rentals: "Rentals",
    gallery: "Gallery",
    reviews: "Reviews",
    team: "Our team",
    contact: "Contact",
    signIn: "Sign in",
    createAccount: "Create account",
    myAccount: "My account",
    staffPortal: "Staff portal",
    bookAppointment: "Book appointment",
    help: "Help",
    language: "Language",
    notSure: "Not sure where to start? Talk to a specialist.",
    sendEnquiry: "Send enquiry",
    allJobs: "All jobs",
    jobsMenuText: "Jobs with work visas - Middle East and worldwide.",
    jobsComingSoon: "New overseas jobs are coming soon. Send us an enquiry to hear first.",
    apply: "Apply",
    more: "more",
    visitorNotice: "Browse freely. To book an appointment, send an enquiry or register for an event, please",
    or: "or",
    register: "register",
    first: "first.",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  si: {
    home: "මුල් පිටුව",
    about: "අප ගැන",
    divisions: "අංශ",
    workVisa: "රැකියා වීසා",
    fertilizer: "පොහොර",
    shop: "සාප්පුව",
    rentals: "කුලියට",
    gallery: "ගැලරිය",
    reviews: "සමාලෝචන",
    team: "අපගේ කණ්ඩායම",
    contact: "සම්බන්ධ වන්න",
    signIn: "ඇතුල් වන්න",
    createAccount: "ගිණුමක් සාදන්න",
    myAccount: "මගේ ගිණුම",
    staffPortal: "කාර්ය මණ්ඩල ද්වාරය",
    bookAppointment: "හමුවීමක් වෙන් කරන්න",
    help: "උදව්",
    language: "භාෂාව",
    notSure: "කොතැනින් පටන් ගන්නද දන්නේ නැද්ද? විශේෂඥයෙකු සමඟ කතා කරන්න.",
    sendEnquiry: "විමසීමක් එවන්න",
    allJobs: "සියලු රැකියා",
    jobsMenuText: "රැකියා වීසා සහිත රැකියා - මැද පෙරදිග සහ ලොව පුරා.",
    jobsComingSoon: "නව විදේශ රැකියා ඉක්මනින් එයි. මුලින්ම දැනගැනීමට විමසීමක් එවන්න.",
    apply: "අයදුම් කරන්න",
    more: "තවත්",
    visitorNotice: "නිදහසේ බලන්න. හමුවීමක් වෙන් කිරීමට, විමසීමක් යැවීමට හෝ උත්සවයකට ලියාපදිංචි වීමට, කරුණාකර මුලින්ම",
    or: "හෝ",
    register: "ලියාපදිංචි වන්න",
    first: "",
    openMenu: "මෙනුව විවෘත කරන්න",
    closeMenu: "මෙනුව වසන්න",
  },
  ta: {
    home: "முகப்பு",
    about: "எங்களைப் பற்றி",
    divisions: "பிரிவுகள்",
    workVisa: "வேலை விசா",
    fertilizer: "உரம்",
    shop: "கடை",
    rentals: "வாடகை",
    gallery: "படத்தொகுப்பு",
    reviews: "மதிப்புரைகள்",
    team: "எங்கள் குழு",
    contact: "தொடர்பு",
    signIn: "உள்நுழைக",
    createAccount: "கணக்கை உருவாக்கவும்",
    myAccount: "எனது கணக்கு",
    staffPortal: "ஊழியர் தளம்",
    bookAppointment: "சந்திப்பை முன்பதிவு செய்யவும்",
    help: "உதவி",
    language: "மொழி",
    notSure: "எங்கே தொடங்குவது என்று தெரியவில்லையா? ஒரு நிபுணரிடம் பேசுங்கள்.",
    sendEnquiry: "விசாரணையை அனுப்பவும்",
    allJobs: "அனைத்து வேலைகளும்",
    jobsMenuText: "வேலை விசாவுடன் கூடிய வேலைகள் - மத்திய கிழக்கு மற்றும் உலகெங்கும்.",
    jobsComingSoon: "புதிய வெளிநாட்டு வேலைகள் விரைவில் வரும். முதலில் தெரிந்துகொள்ள விசாரணையை அனுப்புங்கள்.",
    apply: "விண்ணப்பிக்கவும்",
    more: "மேலும்",
    visitorNotice: "சுதந்திரமாகப் பாருங்கள். சந்திப்பை முன்பதிவு செய்ய, விசாரணையை அனுப்ப அல்லது நிகழ்வுக்குப் பதிவு செய்ய, முதலில்",
    or: "அல்லது",
    register: "பதிவு செய்யவும்",
    first: "",
    openMenu: "மெனுவைத் திறக்கவும்",
    closeMenu: "மெனுவை மூடவும்",
  },
  es: {
    home: "Inicio",
    about: "Nosotros",
    divisions: "Divisiones",
    workVisa: "Visa de trabajo",
    fertilizer: "Fertilizantes",
    shop: "Tienda",
    rentals: "Alquiler",
    gallery: "Galería",
    reviews: "Opiniones",
    team: "Nuestro equipo",
    contact: "Contacto",
    signIn: "Iniciar sesión",
    createAccount: "Crear cuenta",
    myAccount: "Mi cuenta",
    staffPortal: "Portal del personal",
    bookAppointment: "Reservar cita",
    help: "Ayuda",
    language: "Idioma",
    notSure: "¿No sabes por dónde empezar? Habla con un especialista.",
    sendEnquiry: "Enviar consulta",
    allJobs: "Todos los empleos",
    jobsMenuText: "Empleos con visa de trabajo: Oriente Medio y todo el mundo.",
    jobsComingSoon: "Pronto habrá nuevos empleos en el extranjero. Envíanos una consulta para enterarte primero.",
    apply: "Postular",
    more: "más",
    visitorNotice: "Navega libremente. Para reservar una cita, enviar una consulta o inscribirte en un evento, primero",
    or: "o",
    register: "regístrate",
    first: "",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
};
