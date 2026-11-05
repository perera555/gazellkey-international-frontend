import { Lang } from "@/lib/i18n";
import { Division } from "@/lib/types";

// Words of the footer, home, About us and Contact pages (round 1 of the
// website translation). Text staff type in the admin is shown as typed.

type Words = {
  divisionNames: Record<Division, string>;
  footer: {
    about: string;
    sendEnquiry: string;
    followUs: string;
    divisions: string;
    company: string;
    aboutUs: string;
    contact: string;
    bookAppointment: string;
    gallery: string;
    reviews: string;
    guide: string;
    myAccount: string;
    signIn: string;
    createAccount: string;
    rights: string;
    staffPortal: string;
  };
  home: {
    heroTitle: string;
    heroText: string;
    quick: { title: string; text: string }[]; // flights, tours, gems, events, vehicles, trade
    popularTours: string;
    popularDestinations: string;
    toursText: string;
    days: string;
    gemsEyebrow: string;
    gemsTitle: string;
    gemsText: string;
    viewCollection: string;
    gemstones: string;
    gemstonesText: string;
    jewellery: string;
    jewelleryText: string;
    tradeTitle: string;
    tradeText: string;
    trade: { title: string; text: string }[]; // tea, spices, coffee, fruits, electronics, machinery
    upcomingEvents: string;
    processTitle: string;
    process: [string, string][];
    reviewsHeading: string;
    trackTitle: string;
    trackText: string;
    createAccount: string;
    viewAll: string;
  };
  about: {
    eyebrow: string;
    title: string;
    text: string;
    paragraphs: string[];
    talkToUs: string;
    divisions: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    text: string;
    whatNext: string;
    steps: string[];
    customer: string;
    customerText: string;
    signIn: string;
    talk: string;
    talkText: string;
    bookAppointment: string;
    gateTitle: string;
    gateText: string;
  };
  leadership: {
    eyebrowAbout: string;
    eyebrowContact: string;
    titleAbout: string;
    titleContact: string;
    textAbout: string;
    textContact: string;
    managers: string;
    board: string;
    emailOnly: string;
    roles: Record<string, string>;
  };
};

const en: Words = {
  divisionNames: {
    TRAVEL: "Travel Services",
    EVENTS: "Event Management",
    GEMS: "Gems & Jewellery",
    VEHICLES: "Vehicles & Machinery",
    IMPORT: "Import",
    EXPORT: "Export",
  },
  footer: {
    about: "Your trusted travel, gems and trade partner. Global services, local care. One platform, six business divisions - Gazellekey International (Pvt) Ltd, Sri Lanka.",
    sendEnquiry: "Send an enquiry",
    followUs: "Follow us",
    divisions: "Divisions",
    company: "Company",
    aboutUs: "About us",
    contact: "Contact / Enquiry",
    bookAppointment: "Book an appointment",
    gallery: "Travel gallery",
    reviews: "Customer reviews",
    guide: "User guide",
    myAccount: "My account",
    signIn: "Sign in",
    createAccount: "Create an account",
    rights: "All rights reserved.",
    staffPortal: "Staff portal",
  },
  home: {
    heroTitle: "Explore the World With Gazellekey",
    heroText: "Your trusted travel, gems and trade partner. Global services, local care.",
    quick: [
      { title: "Flight Tickets", text: "Best fares worldwide" },
      { title: "Tour Packages", text: "Amazing destinations" },
      { title: "Gems & Jewellery", text: "Certified natural gems" },
      { title: "Events", text: "Shows, expos & festivals" },
      { title: "Vehicles", text: "Cars, parts & machinery" },
      { title: "Import & Export", text: "Global trade solutions" },
    ],
    popularTours: "Popular Tour Packages",
    popularDestinations: "Popular Destinations",
    toursText: "Holidays abroad and across Sri Lanka, planned end to end by our travel team.",
    days: "{count} days",
    gemsEyebrow: "Gems & Jewellery",
    gemsTitle: "Gemstone Collection",
    gemsText: "Certified natural Ceylon sapphires, rubies and fine jewellery - with certificates where available, and custom pieces made to order.",
    viewCollection: "View the collection",
    gemstones: "Gemstones",
    gemstonesText: "Sapphire, ruby and more",
    jewellery: "Jewellery",
    jewelleryText: "Rings, pendants, custom pieces",
    tradeTitle: "Our Trade Products",
    tradeText: "Ceylon produce to the world, and quality goods sourced worldwide for Sri Lanka.",
    trade: [
      { title: "Ceylon Tea", text: "Export product" },
      { title: "Spices & Cinnamon", text: "Export product" },
      { title: "Coffee", text: "Export product" },
      { title: "Fruits & Vegetables", text: "Export product" },
      { title: "Electronics", text: "Import product" },
      { title: "Machinery", text: "Import product" },
    ],
    upcomingEvents: "Upcoming Events",
    processTitle: "One team, one simple process",
    process: [
      ["Send one enquiry", "Tell us what you need - a ticket, a tour, a gem or a shipment."],
      ["Get a clear quotation", "The right specialist replies with options and a quote you can accept online."],
      ["Track it in your account", "Follow bookings, orders, payments and documents in one place."],
    ],
    reviewsHeading: "Loved by our travellers",
    trackTitle: "Track everything in one place",
    trackText: "Create a free account to follow your enquiries, accept quotations and download your documents.",
    createAccount: "Create an account",
    viewAll: "View All",
  },
  about: {
    eyebrow: "About us",
    title: "About Gazellekey",
    text: "One platform. Six business divisions. Global opportunities.",
    paragraphs: [
      "Gazellekey International (Pvt) Ltd is a Sri Lankan company that brings six businesses together under one trusted name: travel services, event management, gems and jewellery, vehicles and machinery, import and export.",
      "Whatever you need, you deal with one team. Send us an enquiry and the right specialist will reply with options, a clear quotation and support until the job is done.",
    ],
    talkToUs: "Talk to us",
    divisions: "Our divisions",
  },
  contact: {
    eyebrow: "Contact us",
    title: "How can we help?",
    text: "One form for every division. We reply to every enquiry, usually within one working day.",
    whatNext: "What happens next?",
    steps: [
      "You get an email with your enquiry reference.",
      "A specialist from the right division contacts you.",
      "We send a quotation you can accept online.",
    ],
    customer: "Already a customer?",
    customerText: "Sign in to see your enquiries, quotations, orders and documents in your account.",
    signIn: "Sign in",
    talk: "Would rather talk?",
    talkText: "Book a time to visit our office, or let us call you by phone or video.",
    bookAppointment: "Book an appointment",
    gateTitle: "Create your free account to enquire",
    gateText: "Your enquiries and quotations are kept in your account, so you can follow every reply.",
  },
  leadership: {
    eyebrowAbout: "Leadership",
    eyebrowContact: "Management",
    titleAbout: "Our leadership",
    titleContact: "Need to reach our management?",
    textAbout: "The directors, shareholders and managers behind Gazellekey International.",
    textContact: "If something did not go as expected with our team, please contact the manager of that division first, or write to our directors. We reply to every message.",
    managers: "Managers",
    board: "Directors & shareholders",
    emailOnly: "Directors are contacted by email only.",
    roles: { DIRECTOR: "Director", SHAREHOLDER: "Shareholder", MANAGER: "Manager" },
  },
};

const si: Words = {
  divisionNames: {
    TRAVEL: "සංචාරක සේවා",
    EVENTS: "උත්සව කළමනාකරණය",
    GEMS: "මැණික් සහ ස්වර්ණාභරණ",
    VEHICLES: "වාහන සහ යන්ත්‍රෝපකරණ",
    IMPORT: "ආනයන",
    EXPORT: "අපනයන",
  },
  footer: {
    about: "ඔබේ විශ්වාසවන්ත සංචාරක, මැණික් සහ වෙළඳ හවුල්කරු. ගෝලීය සේවා, දේශීය සැලකිල්ල. එක් වේදිකාවක්, ව්‍යාපාරික අංශ හයක් - Gazellekey International (Pvt) Ltd, ශ්‍රී ලංකාව.",
    sendEnquiry: "විමසීමක් එවන්න",
    followUs: "අප අනුගමනය කරන්න",
    divisions: "අංශ",
    company: "සමාගම",
    aboutUs: "අප ගැන",
    contact: "සම්බන්ධ වන්න / විමසීම",
    bookAppointment: "හමුවීමක් වෙන් කරන්න",
    gallery: "සංචාරක ගැලරිය",
    reviews: "පාරිභෝගික සමාලෝචන",
    guide: "පරිශීලක මාර්ගෝපදේශය",
    myAccount: "මගේ ගිණුම",
    signIn: "ඇතුල් වන්න",
    createAccount: "ගිණුමක් සාදන්න",
    rights: "සියලු හිමිකම් ඇවිරිණි.",
    staffPortal: "කාර්ය මණ්ඩල ද්වාරය",
  },
  home: {
    heroTitle: "Gazellekey සමඟ ලෝකය ගවේෂණය කරන්න",
    heroText: "ඔබේ විශ්වාසවන්ත සංචාරක, මැණික් සහ වෙළඳ හවුල්කරු. ගෝලීය සේවා, දේශීය සැලකිල්ල.",
    quick: [
      { title: "ගුවන් ටිකට්", text: "ලොව පුරා හොඳම ගාස්තු" },
      { title: "සංචාරක පැකේජ", text: "විස්මිත ගමනාන්ත" },
      { title: "මැණික් සහ ස්වර්ණාභරණ", text: "සහතික කළ ස්වාභාවික මැණික්" },
      { title: "උත්සව", text: "ප්‍රදර්ශන සහ උත්සව" },
      { title: "වාහන", text: "මෝටර් රථ, අමතර කොටස් සහ යන්ත්‍ර" },
      { title: "ආනයන සහ අපනයන", text: "ගෝලීය වෙළඳ විසඳුම්" },
    ],
    popularTours: "ජනප්‍රිය සංචාරක පැකේජ",
    popularDestinations: "ජනප්‍රිය ගමනාන්ත",
    toursText: "විදේශයන්හි සහ ශ්‍රී ලංකාව පුරා නිවාඩු, අපේ සංචාරක කණ්ඩායම මුල සිට අග දක්වා සැලසුම් කරයි.",
    days: "දින {count}",
    gemsEyebrow: "මැණික් සහ ස්වර්ණාභරණ",
    gemsTitle: "මැණික් එකතුව",
    gemsText: "සහතික කළ ස්වාභාවික ලංකා නිල්, රතු මැණික් සහ ස්වර්ණාභරණ - හැකි තැන් සහතික සමඟ, සහ ඇණවුම් අනුව සාදන ආභරණ.",
    viewCollection: "එකතුව බලන්න",
    gemstones: "මැණික්",
    gemstonesText: "නිල්, රතු මැණික් සහ තවත්",
    jewellery: "ස්වර්ණාභරණ",
    jewelleryText: "මුදු, පදක්කම්, විශේෂ නිර්මාණ",
    tradeTitle: "අපේ වෙළඳ නිෂ්පාදන",
    tradeText: "ලෝකයට ලංකා නිෂ්පාදන, සහ ලොව පුරා සිට ශ්‍රී ලංකාවට ගුණාත්මක භාණ්ඩ.",
    trade: [
      { title: "ලංකා තේ", text: "අපනයන නිෂ්පාදනය" },
      { title: "කුළුබඩු සහ කුරුඳු", text: "අපනයන නිෂ්පාදනය" },
      { title: "කෝපි", text: "අපනයන නිෂ්පාදනය" },
      { title: "පලතුරු සහ එළවළු", text: "අපනයන නිෂ්පාදනය" },
      { title: "ඉලෙක්ට්‍රොනික", text: "ආනයන නිෂ්පාදනය" },
      { title: "යන්ත්‍රෝපකරණ", text: "ආනයන නිෂ්පාදනය" },
    ],
    upcomingEvents: "ඉදිරි උත්සව",
    processTitle: "එක් කණ්ඩායමක්, එක් සරල ක්‍රමයක්",
    process: [
      ["එක් විමසීමක් එවන්න", "ඔබට අවශ්‍ය දේ කියන්න - ටිකට්පතක්, සංචාරයක්, මැණිකක් හෝ තොගයක්."],
      ["පැහැදිලි මිල ගණනක් ලබාගන්න", "නිවැරදි විශේෂඥයා විකල්ප සහ අන්තර්ජාලයෙන් පිළිගත හැකි මිල ගණනක් සමඟ පිළිතුරු දෙයි."],
      ["ඔබේ ගිණුමේ පසුවිපරම් කරන්න", "වෙන්කිරීම්, ඇණවුම්, ගෙවීම් සහ ලේඛන එක තැනක බලන්න."],
    ],
    reviewsHeading: "අපේ සංචාරකයින්ගේ ප්‍රසාදය",
    trackTitle: "සියල්ල එක තැනක පසුවිපරම් කරන්න",
    trackText: "ඔබේ විමසීම් පසුවිපරම් කිරීමට, මිල ගණන් පිළිගැනීමට සහ ලේඛන බාගැනීමට නොමිලේ ගිණුමක් සාදන්න.",
    createAccount: "ගිණුමක් සාදන්න",
    viewAll: "සියල්ල බලන්න",
  },
  about: {
    eyebrow: "අප ගැන",
    title: "Gazellekey ගැන",
    text: "එක් වේදිකාවක්. ව්‍යාපාරික අංශ හයක්. ගෝලීය අවස්ථා.",
    paragraphs: [
      "Gazellekey International (Pvt) Ltd යනු සංචාරක සේවා, උත්සව කළමනාකරණය, මැණික් සහ ස්වර්ණාභරණ, වාහන සහ යන්ත්‍රෝපකරණ, ආනයන සහ අපනයන යන ව්‍යාපාර හය එක් විශ්වාසවන්ත නාමයක් යටතේ එක් කරන ශ්‍රී ලාංකේය සමාගමකි.",
      "ඔබට කුමක් අවශ්‍ය වුවත්, ඔබ ගනුදෙනු කරන්නේ එක් කණ්ඩායමක් සමඟයි. විමසීමක් එවන්න, නිවැරදි විශේෂඥයා විකල්ප, පැහැදිලි මිල ගණනක් සහ කාර්යය අවසන් වන තුරු සහාය සමඟ පිළිතුරු දෙයි.",
    ],
    talkToUs: "අප සමඟ කතා කරන්න",
    divisions: "අපේ අංශ",
  },
  contact: {
    eyebrow: "අප අමතන්න",
    title: "අපට ඔබට උදව් කළ හැක්කේ කෙසේද?",
    text: "සියලු අංශ සඳහා එක් පෝරමයක්. අපි සෑම විමසීමකටම, සාමාන්‍යයෙන් එක් වැඩ කරන දිනයක් තුළ පිළිතුරු දෙමු.",
    whatNext: "ඊළඟට සිදුවන්නේ කුමක්ද?",
    steps: [
      "ඔබේ විමසීමේ යොමු අංකය සමඟ ඔබට ඊමේල් එකක් ලැබේ.",
      "නිවැරදි අංශයේ විශේෂඥයෙක් ඔබව සම්බන්ධ කරගනී.",
      "අන්තර්ජාලයෙන් පිළිගත හැකි මිල ගණනක් අපි එවන්නෙමු.",
    ],
    customer: "දැනටමත් පාරිභෝගිකයෙක්ද?",
    customerText: "ඔබේ විමසීම්, මිල ගණන්, ඇණවුම් සහ ලේඛන ඔබේ ගිණුමේ බැලීමට ඇතුල් වන්න.",
    signIn: "ඇතුල් වන්න",
    talk: "කතා කිරීමට කැමතිද?",
    talkText: "අපේ කාර්යාලයට පැමිණීමට වේලාවක් වෙන් කරන්න, නැතහොත් දුරකථනයෙන් හෝ වීඩියෝවෙන් අපි ඔබට කතා කරන්නෙමු.",
    bookAppointment: "හමුවීමක් වෙන් කරන්න",
    gateTitle: "විමසීමට නොමිලේ ගිණුමක් සාදන්න",
    gateText: "ඔබේ විමසීම් සහ මිල ගණන් ඔබේ ගිණුමේ තබා ඇත, එබැවින් සෑම පිළිතුරක්ම පසුවිපරම් කළ හැක.",
  },
  leadership: {
    eyebrowAbout: "නායකත්වය",
    eyebrowContact: "කළමනාකරණය",
    titleAbout: "අපේ නායකත්වය",
    titleContact: "අපේ කළමනාකරණය සම්බන්ධ කරගැනීමට අවශ්‍යද?",
    textAbout: "Gazellekey International පිටුපස සිටින අධ්‍යක්ෂවරුන්, කොටස්කරුවන් සහ කළමනාකරුවන්.",
    textContact: "අපේ කණ්ඩායම සමඟ යමක් බලාපොරොත්තු වූ පරිදි සිදු නොවූයේ නම්, කරුණාකර මුලින්ම එම අංශයේ කළමනාකරු අමතන්න, නැතහොත් අපේ අධ්‍යක්ෂවරුන්ට ලියන්න. අපි සෑම පණිවිඩයකටම පිළිතුරු දෙමු.",
    managers: "කළමනාකරුවන්",
    board: "අධ්‍යක්ෂවරුන් සහ කොටස්කරුවන්",
    emailOnly: "අධ්‍යක්ෂවරුන් සම්බන්ධ කරගත හැක්කේ ඊමේල් මගින් පමණි.",
    roles: { DIRECTOR: "අධ්‍යක්ෂ", SHAREHOLDER: "කොටස්කරු", MANAGER: "කළමනාකරු" },
  },
};

const ta: Words = {
  divisionNames: {
    TRAVEL: "பயண சேவைகள்",
    EVENTS: "நிகழ்வு மேலாண்மை",
    GEMS: "இரத்தினங்கள் & நகைகள்",
    VEHICLES: "வாகனங்கள் & இயந்திரங்கள்",
    IMPORT: "இறக்குமதி",
    EXPORT: "ஏற்றுமதி",
  },
  footer: {
    about: "உங்கள் நம்பகமான பயண, இரத்தின மற்றும் வர்த்தகப் பங்காளர். உலகளாவிய சேவைகள், உள்ளூர் அக்கறை. ஒரே தளம், ஆறு வணிகப் பிரிவுகள் - Gazellekey International (Pvt) Ltd, இலங்கை.",
    sendEnquiry: "விசாரணையை அனுப்பவும்",
    followUs: "எங்களைப் பின்தொடருங்கள்",
    divisions: "பிரிவுகள்",
    company: "நிறுவனம்",
    aboutUs: "எங்களைப் பற்றி",
    contact: "தொடர்பு / விசாரணை",
    bookAppointment: "சந்திப்பை முன்பதிவு செய்யவும்",
    gallery: "பயணப் படத்தொகுப்பு",
    reviews: "வாடிக்கையாளர் மதிப்புரைகள்",
    guide: "பயனர் வழிகாட்டி",
    myAccount: "எனது கணக்கு",
    signIn: "உள்நுழைக",
    createAccount: "கணக்கை உருவாக்கவும்",
    rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    staffPortal: "ஊழியர் தளம்",
  },
  home: {
    heroTitle: "Gazellekey உடன் உலகை ஆராயுங்கள்",
    heroText: "உங்கள் நம்பகமான பயண, இரத்தின மற்றும் வர்த்தகப் பங்காளர். உலகளாவிய சேவைகள், உள்ளூர் அக்கறை.",
    quick: [
      { title: "விமான டிக்கெட்டுகள்", text: "உலகெங்கும் சிறந்த கட்டணங்கள்" },
      { title: "சுற்றுலாத் தொகுப்புகள்", text: "அற்புதமான இடங்கள்" },
      { title: "இரத்தினங்கள் & நகைகள்", text: "சான்றளிக்கப்பட்ட இயற்கை இரத்தினங்கள்" },
      { title: "நிகழ்வுகள்", text: "கண்காட்சிகள் & விழாக்கள்" },
      { title: "வாகனங்கள்", text: "கார்கள், உதிரிப்பாகங்கள் & இயந்திரங்கள்" },
      { title: "இறக்குமதி & ஏற்றுமதி", text: "உலகளாவிய வர்த்தகத் தீர்வுகள்" },
    ],
    popularTours: "பிரபலமான சுற்றுலாத் தொகுப்புகள்",
    popularDestinations: "பிரபலமான இடங்கள்",
    toursText: "வெளிநாடுகளிலும் இலங்கை முழுவதும் விடுமுறைகள், எங்கள் பயணக் குழுவால் முழுமையாகத் திட்டமிடப்படுகின்றன.",
    days: "{count} நாட்கள்",
    gemsEyebrow: "இரத்தினங்கள் & நகைகள்",
    gemsTitle: "இரத்தினத் தொகுப்பு",
    gemsText: "சான்றளிக்கப்பட்ட இயற்கை இலங்கை நீலக்கல், மாணிக்கம் மற்றும் நுண்ணிய நகைகள் - கிடைக்கும் இடங்களில் சான்றிதழ்களுடன், ஆர்டருக்கேற்ப செய்யப்படும் நகைகளும்.",
    viewCollection: "தொகுப்பைப் பாருங்கள்",
    gemstones: "இரத்தினங்கள்",
    gemstonesText: "நீலக்கல், மாணிக்கம் மற்றும் பல",
    jewellery: "நகைகள்",
    jewelleryText: "மோதிரங்கள், பதக்கங்கள், சிறப்பு வடிவமைப்புகள்",
    tradeTitle: "எங்கள் வர்த்தகப் பொருட்கள்",
    tradeText: "உலகிற்கு இலங்கைப் பொருட்கள், உலகெங்கிலுமிருந்து இலங்கைக்குத் தரமான பொருட்கள்.",
    trade: [
      { title: "இலங்கைத் தேநீர்", text: "ஏற்றுமதிப் பொருள்" },
      { title: "மசாலா & கறுவா", text: "ஏற்றுமதிப் பொருள்" },
      { title: "காபி", text: "ஏற்றுமதிப் பொருள்" },
      { title: "பழங்கள் & காய்கறிகள்", text: "ஏற்றுமதிப் பொருள்" },
      { title: "மின்னணுப் பொருட்கள்", text: "இறக்குமதிப் பொருள்" },
      { title: "இயந்திரங்கள்", text: "இறக்குமதிப் பொருள்" },
    ],
    upcomingEvents: "வரவிருக்கும் நிகழ்வுகள்",
    processTitle: "ஒரே குழு, ஒரே எளிய செயல்முறை",
    process: [
      ["ஒரு விசாரணையை அனுப்புங்கள்", "உங்களுக்கு என்ன தேவை என்று சொல்லுங்கள் - டிக்கெட், சுற்றுலா, இரத்தினம் அல்லது சரக்கு."],
      ["தெளிவான விலைக்குறிப்பைப் பெறுங்கள்", "சரியான நிபுணர் தெரிவுகளுடனும் இணையத்தில் ஏற்கக்கூடிய விலைக்குறிப்புடனும் பதிலளிப்பார்."],
      ["உங்கள் கணக்கில் பின்தொடருங்கள்", "முன்பதிவுகள், ஆர்டர்கள், கொடுப்பனவுகள் மற்றும் ஆவணங்களை ஒரே இடத்தில் பாருங்கள்."],
    ],
    reviewsHeading: "எங்கள் பயணிகளின் விருப்பம்",
    trackTitle: "அனைத்தையும் ஒரே இடத்தில் பின்தொடருங்கள்",
    trackText: "உங்கள் விசாரணைகளைப் பின்தொடர, விலைக்குறிப்புகளை ஏற்க மற்றும் ஆவணங்களைப் பதிவிறக்க இலவசக் கணக்கை உருவாக்குங்கள்.",
    createAccount: "கணக்கை உருவாக்கவும்",
    viewAll: "அனைத்தையும் பாருங்கள்",
  },
  about: {
    eyebrow: "எங்களைப் பற்றி",
    title: "Gazellekey பற்றி",
    text: "ஒரே தளம். ஆறு வணிகப் பிரிவுகள். உலகளாவிய வாய்ப்புகள்.",
    paragraphs: [
      "Gazellekey International (Pvt) Ltd என்பது பயண சேவைகள், நிகழ்வு மேலாண்மை, இரத்தினங்கள் மற்றும் நகைகள், வாகனங்கள் மற்றும் இயந்திரங்கள், இறக்குமதி மற்றும் ஏற்றுமதி ஆகிய ஆறு வணிகங்களை ஒரே நம்பகமான பெயரில் இணைக்கும் இலங்கை நிறுவனம்.",
      "உங்களுக்கு எது தேவைப்பட்டாலும், நீங்கள் ஒரே குழுவுடன் தொடர்பு கொள்கிறீர்கள். விசாரணையை அனுப்புங்கள், சரியான நிபுணர் தெரிவுகள், தெளிவான விலைக்குறிப்பு மற்றும் வேலை முடியும் வரை ஆதரவுடன் பதிலளிப்பார்.",
    ],
    talkToUs: "எங்களுடன் பேசுங்கள்",
    divisions: "எங்கள் பிரிவுகள்",
  },
  contact: {
    eyebrow: "எங்களைத் தொடர்பு கொள்ளவும்",
    title: "நாங்கள் எப்படி உதவலாம்?",
    text: "அனைத்துப் பிரிவுகளுக்கும் ஒரே படிவம். ஒவ்வொரு விசாரணைக்கும், பொதுவாக ஒரு வேலை நாளுக்குள் பதிலளிக்கிறோம்.",
    whatNext: "அடுத்து என்ன நடக்கும்?",
    steps: [
      "உங்கள் விசாரணைக் குறிப்பு எண்ணுடன் மின்னஞ்சல் கிடைக்கும்.",
      "சரியான பிரிவின் நிபுணர் உங்களைத் தொடர்பு கொள்வார்.",
      "இணையத்தில் ஏற்கக்கூடிய விலைக்குறிப்பை அனுப்புவோம்.",
    ],
    customer: "ஏற்கனவே வாடிக்கையாளரா?",
    customerText: "உங்கள் விசாரணைகள், விலைக்குறிப்புகள், ஆர்டர்கள் மற்றும் ஆவணங்களை உங்கள் கணக்கில் பார்க்க உள்நுழையுங்கள்.",
    signIn: "உள்நுழைக",
    talk: "பேச விரும்புகிறீர்களா?",
    talkText: "எங்கள் அலுவலகத்திற்கு வர நேரத்தை முன்பதிவு செய்யுங்கள், அல்லது தொலைபேசி அல்லது வீடியோவில் உங்களை அழைக்கிறோம்.",
    bookAppointment: "சந்திப்பை முன்பதிவு செய்யவும்",
    gateTitle: "விசாரிக்க இலவசக் கணக்கை உருவாக்குங்கள்",
    gateText: "உங்கள் விசாரணைகளும் விலைக்குறிப்புகளும் உங்கள் கணக்கில் வைக்கப்படும், எனவே ஒவ்வொரு பதிலையும் பின்தொடரலாம்.",
  },
  leadership: {
    eyebrowAbout: "தலைமை",
    eyebrowContact: "நிர்வாகம்",
    titleAbout: "எங்கள் தலைமை",
    titleContact: "எங்கள் நிர்வாகத்தைத் தொடர்பு கொள்ள வேண்டுமா?",
    textAbout: "Gazellekey International இன் பின்னால் உள்ள இயக்குநர்கள், பங்குதாரர்கள் மற்றும் மேலாளர்கள்.",
    textContact: "எங்கள் குழுவுடன் ஏதாவது எதிர்பார்த்தபடி நடக்கவில்லை என்றால், முதலில் அந்தப் பிரிவின் மேலாளரைத் தொடர்பு கொள்ளுங்கள், அல்லது எங்கள் இயக்குநர்களுக்கு எழுதுங்கள். ஒவ்வொரு செய்திக்கும் பதிலளிக்கிறோம்.",
    managers: "மேலாளர்கள்",
    board: "இயக்குநர்கள் & பங்குதாரர்கள்",
    emailOnly: "இயக்குநர்களை மின்னஞ்சல் மூலம் மட்டுமே தொடர்பு கொள்ளலாம்.",
    roles: { DIRECTOR: "இயக்குநர்", SHAREHOLDER: "பங்குதாரர்", MANAGER: "மேலாளர்" },
  },
};

const es: Words = {
  divisionNames: {
    TRAVEL: "Servicios de viaje",
    EVENTS: "Gestión de eventos",
    GEMS: "Gemas y joyería",
    VEHICLES: "Vehículos y maquinaria",
    IMPORT: "Importación",
    EXPORT: "Exportación",
  },
  footer: {
    about: "Tu socio de confianza en viajes, gemas y comercio. Servicios globales, atención local. Una plataforma, seis divisiones de negocio - Gazellekey International (Pvt) Ltd, Sri Lanka.",
    sendEnquiry: "Enviar una consulta",
    followUs: "Síguenos",
    divisions: "Divisiones",
    company: "Empresa",
    aboutUs: "Nosotros",
    contact: "Contacto / Consulta",
    bookAppointment: "Reservar una cita",
    gallery: "Galería de viajes",
    reviews: "Opiniones de clientes",
    guide: "Guía de uso",
    myAccount: "Mi cuenta",
    signIn: "Iniciar sesión",
    createAccount: "Crear una cuenta",
    rights: "Todos los derechos reservados.",
    staffPortal: "Portal del personal",
  },
  home: {
    heroTitle: "Explora el mundo con Gazellekey",
    heroText: "Tu socio de confianza en viajes, gemas y comercio. Servicios globales, atención local.",
    quick: [
      { title: "Billetes de avión", text: "Las mejores tarifas del mundo" },
      { title: "Paquetes turísticos", text: "Destinos increíbles" },
      { title: "Gemas y joyería", text: "Gemas naturales certificadas" },
      { title: "Eventos", text: "Ferias, exposiciones y festivales" },
      { title: "Vehículos", text: "Coches, repuestos y maquinaria" },
      { title: "Importación y exportación", text: "Soluciones de comercio global" },
    ],
    popularTours: "Paquetes turísticos populares",
    popularDestinations: "Destinos populares",
    toursText: "Vacaciones en el extranjero y por todo Sri Lanka, planificadas de principio a fin por nuestro equipo de viajes.",
    days: "{count} días",
    gemsEyebrow: "Gemas y joyería",
    gemsTitle: "Colección de piedras preciosas",
    gemsText: "Zafiros y rubíes naturales de Ceilán certificados y joyería fina, con certificados cuando están disponibles, y piezas hechas a medida.",
    viewCollection: "Ver la colección",
    gemstones: "Piedras preciosas",
    gemstonesText: "Zafiro, rubí y más",
    jewellery: "Joyería",
    jewelleryText: "Anillos, colgantes, piezas a medida",
    tradeTitle: "Nuestros productos comerciales",
    tradeText: "Productos de Ceilán para el mundo, y artículos de calidad de todo el mundo para Sri Lanka.",
    trade: [
      { title: "Té de Ceilán", text: "Producto de exportación" },
      { title: "Especias y canela", text: "Producto de exportación" },
      { title: "Café", text: "Producto de exportación" },
      { title: "Frutas y verduras", text: "Producto de exportación" },
      { title: "Electrónica", text: "Producto de importación" },
      { title: "Maquinaria", text: "Producto de importación" },
    ],
    upcomingEvents: "Próximos eventos",
    processTitle: "Un equipo, un proceso sencillo",
    process: [
      ["Envía una consulta", "Dinos lo que necesitas: un billete, un viaje, una gema o un envío."],
      ["Recibe un presupuesto claro", "El especialista adecuado responde con opciones y un presupuesto que puedes aceptar en línea."],
      ["Síguelo en tu cuenta", "Consulta reservas, pedidos, pagos y documentos en un solo lugar."],
    ],
    reviewsHeading: "Lo que dicen nuestros viajeros",
    trackTitle: "Todo en un solo lugar",
    trackText: "Crea una cuenta gratuita para seguir tus consultas, aceptar presupuestos y descargar tus documentos.",
    createAccount: "Crear una cuenta",
    viewAll: "Ver todo",
  },
  about: {
    eyebrow: "Nosotros",
    title: "Sobre Gazellekey",
    text: "Una plataforma. Seis divisiones de negocio. Oportunidades globales.",
    paragraphs: [
      "Gazellekey International (Pvt) Ltd es una empresa de Sri Lanka que reúne seis negocios bajo un mismo nombre de confianza: servicios de viaje, gestión de eventos, gemas y joyería, vehículos y maquinaria, importación y exportación.",
      "Necesites lo que necesites, tratas con un solo equipo. Envíanos una consulta y el especialista adecuado te responderá con opciones, un presupuesto claro y apoyo hasta terminar el trabajo.",
    ],
    talkToUs: "Habla con nosotros",
    divisions: "Nuestras divisiones",
  },
  contact: {
    eyebrow: "Contáctanos",
    title: "¿Cómo podemos ayudarte?",
    text: "Un formulario para todas las divisiones. Respondemos a cada consulta, normalmente en un día laborable.",
    whatNext: "¿Qué sigue?",
    steps: [
      "Recibes un correo con la referencia de tu consulta.",
      "Un especialista de la división adecuada se pone en contacto contigo.",
      "Te enviamos un presupuesto que puedes aceptar en línea.",
    ],
    customer: "¿Ya eres cliente?",
    customerText: "Inicia sesión para ver tus consultas, presupuestos, pedidos y documentos en tu cuenta.",
    signIn: "Iniciar sesión",
    talk: "¿Prefieres hablar?",
    talkText: "Reserva una visita a nuestra oficina, o te llamamos por teléfono o video.",
    bookAppointment: "Reservar una cita",
    gateTitle: "Crea tu cuenta gratuita para consultar",
    gateText: "Tus consultas y presupuestos se guardan en tu cuenta, para que sigas cada respuesta.",
  },
  leadership: {
    eyebrowAbout: "Dirección",
    eyebrowContact: "Gerencia",
    titleAbout: "Nuestra dirección",
    titleContact: "¿Necesitas contactar con la gerencia?",
    textAbout: "Los directores, accionistas y gerentes detrás de Gazellekey International.",
    textContact: "Si algo no salió como esperabas con nuestro equipo, contacta primero con el gerente de esa división, o escribe a nuestros directores. Respondemos a cada mensaje.",
    managers: "Gerentes",
    board: "Directores y accionistas",
    emailOnly: "A los directores se les contacta solo por correo electrónico.",
    roles: { DIRECTOR: "Director", SHAREHOLDER: "Accionista", MANAGER: "Gerente" },
  },
};

export const PAGE_WORDS: Record<Lang, Words> = { en, si, ta, es };
