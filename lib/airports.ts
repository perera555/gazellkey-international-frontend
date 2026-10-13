export type Airport = {
  code: string;
  city: string;
  name: string;
  country: string;
};

// Airports offered in the flight search. Sri Lanka and the routes our
// customers fly most often come first so they show before the rest.
export const AIRPORTS: Airport[] = [
  // Sri Lanka
  { code: "CMB", city: "Colombo", name: "Bandaranaike International", country: "Sri Lanka" },
  { code: "HRI", city: "Hambantota", name: "Mattala Rajapaksa International", country: "Sri Lanka" },
  { code: "JAF", city: "Jaffna", name: "Jaffna International", country: "Sri Lanka" },
  { code: "RML", city: "Colombo", name: "Ratmalana International", country: "Sri Lanka" },

  // Middle East
  { code: "DXB", city: "Dubai", name: "Dubai International", country: "United Arab Emirates" },
  { code: "DWC", city: "Dubai", name: "Al Maktoum International", country: "United Arab Emirates" },
  { code: "AUH", city: "Abu Dhabi", name: "Zayed International", country: "United Arab Emirates" },
  { code: "SHJ", city: "Sharjah", name: "Sharjah International", country: "United Arab Emirates" },
  { code: "DOH", city: "Doha", name: "Hamad International", country: "Qatar" },
  { code: "MCT", city: "Muscat", name: "Muscat International", country: "Oman" },
  { code: "BAH", city: "Manama", name: "Bahrain International", country: "Bahrain" },
  { code: "KWI", city: "Kuwait City", name: "Kuwait International", country: "Kuwait" },
  { code: "RUH", city: "Riyadh", name: "King Khalid International", country: "Saudi Arabia" },
  { code: "JED", city: "Jeddah", name: "King Abdulaziz International", country: "Saudi Arabia" },
  { code: "DMM", city: "Dammam", name: "King Fahd International", country: "Saudi Arabia" },
  { code: "MED", city: "Madinah", name: "Prince Mohammad bin Abdulaziz", country: "Saudi Arabia" },
  { code: "AMM", city: "Amman", name: "Queen Alia International", country: "Jordan" },
  { code: "BEY", city: "Beirut", name: "Rafic Hariri International", country: "Lebanon" },
  { code: "TLV", city: "Tel Aviv", name: "Ben Gurion", country: "Israel" },
  { code: "IKA", city: "Tehran", name: "Imam Khomeini International", country: "Iran" },
  { code: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey" },
  { code: "SAW", city: "Istanbul", name: "Sabiha Gökçen International", country: "Turkey" },
  { code: "AYT", city: "Antalya", name: "Antalya Airport", country: "Turkey" },
  { code: "CAI", city: "Cairo", name: "Cairo International", country: "Egypt" },

  // South Asia
  { code: "MLE", city: "Malé", name: "Velana International", country: "Maldives" },
  { code: "GAN", city: "Addu City", name: "Gan International", country: "Maldives" },
  { code: "MAA", city: "Chennai", name: "Chennai International", country: "India" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International", country: "India" },
  { code: "DEL", city: "Delhi", name: "Indira Gandhi International", country: "India" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda International", country: "India" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International", country: "India" },
  { code: "COK", city: "Kochi", name: "Cochin International", country: "India" },
  { code: "TRV", city: "Thiruvananthapuram", name: "Trivandrum International", country: "India" },
  { code: "TRZ", city: "Tiruchirappalli", name: "Tiruchirappalli International", country: "India" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose International", country: "India" },
  { code: "GOI", city: "Goa", name: "Dabolim", country: "India" },
  { code: "AMD", city: "Ahmedabad", name: "Sardar Vallabhbhai Patel International", country: "India" },
  { code: "VNS", city: "Varanasi", name: "Lal Bahadur Shastri International", country: "India" },
  { code: "KTM", city: "Kathmandu", name: "Tribhuvan International", country: "Nepal" },
  { code: "DAC", city: "Dhaka", name: "Hazrat Shahjalal International", country: "Bangladesh" },
  { code: "PBH", city: "Paro", name: "Paro International", country: "Bhutan" },
  { code: "KHI", city: "Karachi", name: "Jinnah International", country: "Pakistan" },
  { code: "LHE", city: "Lahore", name: "Allama Iqbal International", country: "Pakistan" },
  { code: "ISB", city: "Islamabad", name: "Islamabad International", country: "Pakistan" },

  // South-east Asia
  { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore" },
  { code: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur International", country: "Malaysia" },
  { code: "PEN", city: "Penang", name: "Penang International", country: "Malaysia" },
  { code: "BKI", city: "Kota Kinabalu", name: "Kota Kinabalu International", country: "Malaysia" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi", country: "Thailand" },
  { code: "DMK", city: "Bangkok", name: "Don Mueang International", country: "Thailand" },
  { code: "HKT", city: "Phuket", name: "Phuket International", country: "Thailand" },
  { code: "CNX", city: "Chiang Mai", name: "Chiang Mai International", country: "Thailand" },
  { code: "USM", city: "Koh Samui", name: "Samui International", country: "Thailand" },
  { code: "CGK", city: "Jakarta", name: "Soekarno-Hatta International", country: "Indonesia" },
  { code: "DPS", city: "Bali (Denpasar)", name: "Ngurah Rai International", country: "Indonesia" },
  { code: "MNL", city: "Manila", name: "Ninoy Aquino International", country: "Philippines" },
  { code: "CEB", city: "Cebu", name: "Mactan-Cebu International", country: "Philippines" },
  { code: "SGN", city: "Ho Chi Minh City", name: "Tan Son Nhat International", country: "Vietnam" },
  { code: "HAN", city: "Hanoi", name: "Noi Bai International", country: "Vietnam" },
  { code: "DAD", city: "Da Nang", name: "Da Nang International", country: "Vietnam" },
  { code: "PNH", city: "Phnom Penh", name: "Techo International", country: "Cambodia" },
  { code: "REP", city: "Siem Reap", name: "Siem Reap-Angkor International", country: "Cambodia" },
  { code: "RGN", city: "Yangon", name: "Yangon International", country: "Myanmar" },
  { code: "VTE", city: "Vientiane", name: "Wattay International", country: "Laos" },
  { code: "BWN", city: "Bandar Seri Begawan", name: "Brunei International", country: "Brunei" },

  // East Asia
  { code: "HKG", city: "Hong Kong", name: "Hong Kong International", country: "Hong Kong" },
  { code: "MFM", city: "Macau", name: "Macau International", country: "Macau" },
  { code: "PEK", city: "Beijing", name: "Beijing Capital International", country: "China" },
  { code: "PKX", city: "Beijing", name: "Beijing Daxing International", country: "China" },
  { code: "PVG", city: "Shanghai", name: "Shanghai Pudong International", country: "China" },
  { code: "CAN", city: "Guangzhou", name: "Guangzhou Baiyun International", country: "China" },
  { code: "SZX", city: "Shenzhen", name: "Shenzhen Bao'an International", country: "China" },
  { code: "CTU", city: "Chengdu", name: "Chengdu Shuangliu International", country: "China" },
  { code: "KMG", city: "Kunming", name: "Kunming Changshui International", country: "China" },
  { code: "TPE", city: "Taipei", name: "Taoyuan International", country: "Taiwan" },
  { code: "ICN", city: "Seoul", name: "Incheon International", country: "South Korea" },
  { code: "NRT", city: "Tokyo", name: "Narita International", country: "Japan" },
  { code: "HND", city: "Tokyo", name: "Haneda", country: "Japan" },
  { code: "KIX", city: "Osaka", name: "Kansai International", country: "Japan" },

  // Europe
  { code: "LHR", city: "London", name: "Heathrow", country: "United Kingdom" },
  { code: "LGW", city: "London", name: "Gatwick", country: "United Kingdom" },
  { code: "STN", city: "London", name: "Stansted", country: "United Kingdom" },
  { code: "MAN", city: "Manchester", name: "Manchester Airport", country: "United Kingdom" },
  { code: "BHX", city: "Birmingham", name: "Birmingham Airport", country: "United Kingdom" },
  { code: "EDI", city: "Edinburgh", name: "Edinburgh Airport", country: "United Kingdom" },
  { code: "DUB", city: "Dublin", name: "Dublin Airport", country: "Ireland" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
  { code: "ORY", city: "Paris", name: "Orly", country: "France" },
  { code: "NCE", city: "Nice", name: "Nice Côte d'Azur", country: "France" },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany" },
  { code: "MUC", city: "Munich", name: "Munich Airport", country: "Germany" },
  { code: "BER", city: "Berlin", name: "Berlin Brandenburg", country: "Germany" },
  { code: "DUS", city: "Düsseldorf", name: "Düsseldorf Airport", country: "Germany" },
  { code: "AMS", city: "Amsterdam", name: "Schiphol", country: "Netherlands" },
  { code: "BRU", city: "Brussels", name: "Brussels Airport", country: "Belgium" },
  { code: "ZRH", city: "Zurich", name: "Zurich Airport", country: "Switzerland" },
  { code: "GVA", city: "Geneva", name: "Geneva Airport", country: "Switzerland" },
  { code: "VIE", city: "Vienna", name: "Vienna International", country: "Austria" },
  { code: "FCO", city: "Rome", name: "Leonardo da Vinci–Fiumicino", country: "Italy" },
  { code: "MXP", city: "Milan", name: "Malpensa", country: "Italy" },
  { code: "VCE", city: "Venice", name: "Marco Polo", country: "Italy" },
  { code: "MAD", city: "Madrid", name: "Adolfo Suárez Madrid–Barajas", country: "Spain" },
  { code: "BCN", city: "Barcelona", name: "Josep Tarradellas Barcelona–El Prat", country: "Spain" },
  { code: "LIS", city: "Lisbon", name: "Humberto Delgado", country: "Portugal" },
  { code: "ATH", city: "Athens", name: "Athens International", country: "Greece" },
  { code: "CPH", city: "Copenhagen", name: "Copenhagen Airport", country: "Denmark" },
  { code: "ARN", city: "Stockholm", name: "Arlanda", country: "Sweden" },
  { code: "OSL", city: "Oslo", name: "Oslo Gardermoen", country: "Norway" },
  { code: "HEL", city: "Helsinki", name: "Helsinki-Vantaa", country: "Finland" },
  { code: "WAW", city: "Warsaw", name: "Warsaw Chopin", country: "Poland" },
  { code: "PRG", city: "Prague", name: "Václav Havel Airport", country: "Czech Republic" },
  { code: "BUD", city: "Budapest", name: "Budapest Ferenc Liszt International", country: "Hungary" },
  { code: "OTP", city: "Bucharest", name: "Henri Coandă International", country: "Romania" },
  { code: "SVO", city: "Moscow", name: "Sheremetyevo International", country: "Russia" },
  { code: "LED", city: "Saint Petersburg", name: "Pulkovo", country: "Russia" },

  // Africa
  { code: "JNB", city: "Johannesburg", name: "O. R. Tambo International", country: "South Africa" },
  { code: "CPT", city: "Cape Town", name: "Cape Town International", country: "South Africa" },
  { code: "NBO", city: "Nairobi", name: "Jomo Kenyatta International", country: "Kenya" },
  { code: "ADD", city: "Addis Ababa", name: "Bole International", country: "Ethiopia" },
  { code: "DAR", city: "Dar es Salaam", name: "Julius Nyerere International", country: "Tanzania" },
  { code: "ZNZ", city: "Zanzibar", name: "Abeid Amani Karume International", country: "Tanzania" },
  { code: "MRU", city: "Mauritius", name: "Sir Seewoosagur Ramgoolam International", country: "Mauritius" },
  { code: "SEZ", city: "Mahé", name: "Seychelles International", country: "Seychelles" },
  { code: "LOS", city: "Lagos", name: "Murtala Muhammed International", country: "Nigeria" },
  { code: "CMN", city: "Casablanca", name: "Mohammed V International", country: "Morocco" },

  // Oceania
  { code: "SYD", city: "Sydney", name: "Kingsford Smith", country: "Australia" },
  { code: "MEL", city: "Melbourne", name: "Melbourne Airport", country: "Australia" },
  { code: "BNE", city: "Brisbane", name: "Brisbane Airport", country: "Australia" },
  { code: "PER", city: "Perth", name: "Perth Airport", country: "Australia" },
  { code: "ADL", city: "Adelaide", name: "Adelaide Airport", country: "Australia" },
  { code: "AKL", city: "Auckland", name: "Auckland Airport", country: "New Zealand" },
  { code: "CHC", city: "Christchurch", name: "Christchurch International", country: "New Zealand" },

  // Americas
  { code: "JFK", city: "New York", name: "John F. Kennedy International", country: "United States" },
  { code: "EWR", city: "Newark", name: "Newark Liberty International", country: "United States" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "United States" },
  { code: "SFO", city: "San Francisco", name: "San Francisco International", country: "United States" },
  { code: "ORD", city: "Chicago", name: "O'Hare International", country: "United States" },
  { code: "IAD", city: "Washington", name: "Washington Dulles International", country: "United States" },
  { code: "BOS", city: "Boston", name: "Logan International", country: "United States" },
  { code: "MIA", city: "Miami", name: "Miami International", country: "United States" },
  { code: "ATL", city: "Atlanta", name: "Hartsfield–Jackson Atlanta International", country: "United States" },
  { code: "DFW", city: "Dallas", name: "Dallas Fort Worth International", country: "United States" },
  { code: "IAH", city: "Houston", name: "George Bush Intercontinental", country: "United States" },
  { code: "SEA", city: "Seattle", name: "Seattle–Tacoma International", country: "United States" },
  { code: "YYZ", city: "Toronto", name: "Toronto Pearson International", country: "Canada" },
  { code: "YVR", city: "Vancouver", name: "Vancouver International", country: "Canada" },
  { code: "YUL", city: "Montreal", name: "Montréal–Trudeau International", country: "Canada" },
  { code: "MEX", city: "Mexico City", name: "Benito Juárez International", country: "Mexico" },
  { code: "GRU", city: "São Paulo", name: "Guarulhos International", country: "Brazil" },
  { code: "EZE", city: "Buenos Aires", name: "Ministro Pistarini International", country: "Argentina" },
];

export function airportLabel(airport: Airport) {
  return `${airport.city} (${airport.code})`;
}

// Ignore accents so "male" finds Malé and "sao" finds São Paulo
function fold(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Exact code matches rank first, then city/name/country prefixes, then anywhere
export function searchAirports(query: string, limit = 8): Airport[] {
  const q = fold(query.trim());
  if (!q) {
    return AIRPORTS.slice(0, limit);
  }
  const scored: { airport: Airport; score: number }[] = [];
  for (const airport of AIRPORTS) {
    const code = airport.code.toLowerCase();
    const city = fold(airport.city);
    const name = fold(airport.name);
    const country = fold(airport.country);
    let score = -1;
    if (code == q) score = 0;
    else if (city.startsWith(q)) score = 1;
    else if (code.startsWith(q)) score = 2;
    else if (name.startsWith(q) || country.startsWith(q)) score = 3;
    else if (`${city} ${name} ${country} ${fold(airportLabel(airport))}`.includes(q)) score = 4;
    if (score >= 0) {
      scored.push({ airport, score });
    }
  }
  return scored
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((item) => item.airport);
}
