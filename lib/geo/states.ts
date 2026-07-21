// Kingsway — country → subdivisions (states/regions/counties/…) for the location dropdown.
// Countries not listed here fall back to a free-text "state or city" field. Keys MUST match the
// country `name` in ./countries.ts exactly. Adding a country is a one-line edit (STATES + LABELS).

export const STATES: Record<string, string[]> = {
  // ---------------- Africa ----------------
  Nigeria: [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe",
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
    "Taraba", "Yobe", "Zamfara",
  ],
  Ghana: [
    "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra",
    "North East", "Northern", "Oti", "Savannah", "Upper East", "Upper West", "Volta",
    "Western", "Western North",
  ],
  Kenya: [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
    "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
    "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni",
    "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru",
    "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta",
    "Tana River", "Tharaka-Nithi", "Trans-Nzoia", "Turkana", "Uasin Gishu", "Vihiga",
    "Wajir", "West Pokot",
  ],
  "South Africa": [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga",
    "North West", "Northern Cape", "Western Cape",
  ],
  Cameroon: [
    "Adamawa", "Centre", "East", "Far North", "Littoral", "North", "North-West", "South",
    "South-West", "West",
  ],
  Egypt: [
    "Alexandria", "Aswan", "Asyut", "Beheira", "Beni Suef", "Cairo", "Dakahlia", "Damietta",
    "Faiyum", "Gharbia", "Giza", "Ismailia", "Kafr El Sheikh", "Luxor", "Matrouh", "Minya",
    "Monufia", "New Valley", "North Sinai", "Port Said", "Qalyubia", "Qena", "Red Sea",
    "Sharqia", "Sohag", "South Sinai", "Suez",
  ],
  Ethiopia: [
    "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa", "Gambela", "Harari",
    "Oromia", "Sidama", "Somali", "South West Ethiopia Peoples'", "Southern Nations, Nationalities and Peoples", "Tigray",
  ],
  Tanzania: [
    "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", "Katavi", "Kigoma",
    "Kilimanjaro", "Lindi", "Manyara", "Mara", "Mbeya", "Morogoro", "Mtwara", "Mwanza",
    "Njombe", "Pemba North", "Pemba South", "Pwani", "Rukwa", "Ruvuma", "Shinyanga",
    "Simiyu", "Singida", "Songwe", "Tabora", "Tanga", "Zanzibar Central/South",
    "Zanzibar North", "Zanzibar Urban/West",
  ],
  Uganda: ["Central", "Eastern", "Northern", "Western"],
  Rwanda: ["Kigali", "Eastern", "Northern", "Southern", "Western"],
  Zimbabwe: [
    "Bulawayo", "Harare", "Manicaland", "Mashonaland Central", "Mashonaland East",
    "Mashonaland West", "Masvingo", "Matabeleland North", "Matabeleland South", "Midlands",
  ],
  Zambia: [
    "Central", "Copperbelt", "Eastern", "Luapula", "Lusaka", "Muchinga", "Northern",
    "North-Western", "Southern", "Western",
  ],
  Botswana: [
    "Central", "Chobe", "Ghanzi", "Kgalagadi", "Kgatleng", "Kweneng", "North-East",
    "North-West", "South-East", "Southern",
  ],
  Namibia: [
    "Erongo", "Hardap", "Karas", "Kavango East", "Kavango West", "Khomas", "Kunene",
    "Ohangwena", "Omaheke", "Omusati", "Oshana", "Oshikoto", "Otjozondjupa", "Zambezi",
  ],
  Malawi: ["Northern", "Central", "Southern"],
  Senegal: [
    "Dakar", "Diourbel", "Fatick", "Kaffrine", "Kaolack", "Kédougou", "Kolda", "Louga",
    "Matam", "Saint-Louis", "Sédhiou", "Tambacounda", "Thiès", "Ziguinchor",
  ],
  "Côte d'Ivoire": [
    "Abidjan", "Bas-Sassandra", "Comoé", "Denguélé", "Gôh-Djiboua", "Lacs", "Lagunes",
    "Montagnes", "Sassandra-Marahoué", "Savanes", "Vallée du Bandama", "Woroba",
    "Yamoussoukro", "Zanzan",
  ],
  Angola: [
    "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango", "Cuanza Norte", "Cuanza Sul",
    "Cunene", "Huambo", "Huíla", "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico",
    "Namibe", "Uíge", "Zaire",
  ],
  Mozambique: [
    "Cabo Delgado", "Gaza", "Inhambane", "Manica", "Maputo", "Maputo City", "Nampula",
    "Niassa", "Sofala", "Tete", "Zambézia",
  ],
  Morocco: [
    "Tanger-Tétouan-Al Hoceïma", "Oriental", "Fès-Meknès", "Rabat-Salé-Kénitra",
    "Béni Mellal-Khénifra", "Casablanca-Settat", "Marrakech-Safi", "Drâa-Tafilalet",
    "Souss-Massa", "Guelmim-Oued Noun", "Laâyoune-Sakia El Hamra", "Dakhla-Oued Ed-Dahab",
  ],
  Tunisia: [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", "Kairouan",
    "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Medenine", "Monastir", "Nabeul",
    "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan",
  ],
  Niger: ["Agadez", "Diffa", "Dosso", "Maradi", "Niamey", "Tahoua", "Tillabéri", "Zinder"],
  Mali: [
    "Bamako", "Gao", "Kayes", "Kidal", "Koulikoro", "Mopti", "Ségou", "Sikasso", "Tombouctou",
  ],
  "Burkina Faso": [
    "Boucle du Mouhoun", "Cascades", "Centre", "Centre-Est", "Centre-Nord", "Centre-Ouest",
    "Centre-Sud", "Est", "Hauts-Bassins", "Nord", "Plateau-Central", "Sahel", "Sud-Ouest",
  ],
  "Congo (Kinshasa)": [
    "Bas-Uélé", "Équateur", "Haut-Katanga", "Haut-Lomami", "Haut-Uélé", "Ituri", "Kasaï",
    "Kasaï-Central", "Kasaï-Oriental", "Kinshasa", "Kongo Central", "Kwango", "Kwilu",
    "Lomami", "Lualaba", "Mai-Ndombe", "Maniema", "Mongala", "Nord-Kivu", "Nord-Ubangi",
    "Sankuru", "Sud-Kivu", "Sud-Ubangi", "Tanganyika", "Tshopo", "Tshuapa",
  ],

  // ---------------- Rest of the world ----------------
  "United States": [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois",
    "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
    "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
    "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming",
  ],
  Canada: [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
    "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
    "Quebec", "Saskatchewan", "Yukon",
  ],
  India: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
    "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal",
  ],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  Australia: [
    "Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland",
    "South Australia", "Tasmania", "Victoria", "Western Australia",
  ],
  Germany: [
    "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse",
    "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate",
    "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia",
  ],
  France: [
    "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", "Centre-Val de Loire",
    "Corsica", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandy", "Nouvelle-Aquitaine",
    "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur", "Guadeloupe", "Martinique",
    "French Guiana", "Réunion", "Mayotte",
  ],
  Brazil: [
    "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
    "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais",
    "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte",
    "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe",
    "Tocantins",
  ],
  Mexico: [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
    "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo",
    "Jalisco", "Mexico City", "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León",
    "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora",
    "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas",
  ],
  "United Arab Emirates": [
    "Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain",
  ],
  Pakistan: [
    "Azad Kashmir", "Balochistan", "Gilgit-Baltistan", "Islamabad Capital Territory",
    "Khyber Pakhtunkhwa", "Punjab", "Sindh",
  ],
  "Saudi Arabia": [
    "Riyadh", "Makkah", "Madinah", "Eastern Province", "Asir", "Tabuk", "Hail",
    "Northern Borders", "Jazan", "Najran", "Al Bahah", "Al Jawf", "Qassim",
  ],
  Philippines: [
    "National Capital Region", "Cordillera Administrative Region", "Ilocos Region",
    "Cagayan Valley", "Central Luzon", "CALABARZON", "MIMAROPA", "Bicol Region",
    "Western Visayas", "Central Visayas", "Eastern Visayas", "Zamboanga Peninsula",
    "Northern Mindanao", "Davao Region", "SOCCSKSARGEN", "Caraga", "Bangsamoro",
  ],
};

/** What to call the subdivision for a country (drives the label + placeholder). */
const LABELS: Record<string, string> = {
  Nigeria: "state",
  Ghana: "region",
  Kenya: "county",
  "South Africa": "province",
  Cameroon: "region",
  Egypt: "governorate",
  Ethiopia: "region",
  Tanzania: "region",
  Uganda: "region",
  Rwanda: "province",
  Zimbabwe: "province",
  Zambia: "province",
  Botswana: "district",
  Namibia: "region",
  Malawi: "region",
  Senegal: "region",
  "Côte d'Ivoire": "district",
  Angola: "province",
  Mozambique: "province",
  Morocco: "region",
  Tunisia: "governorate",
  Niger: "region",
  Mali: "region",
  "Burkina Faso": "region",
  "Congo (Kinshasa)": "province",
  "United States": "state",
  Canada: "province or territory",
  India: "state",
  "United Kingdom": "nation",
  Australia: "state or territory",
  Germany: "state",
  France: "region",
  Brazil: "state",
  Mexico: "state",
  "United Arab Emirates": "emirate",
  Pakistan: "province",
  "Saudi Arabia": "region",
  Philippines: "region",
};

export function statesFor(country?: string): string[] {
  if (!country) return [];
  return STATES[country] ?? [];
}

export function subdivisionLabel(country?: string): string {
  if (!country) return "state or city";
  return LABELS[country] ?? "state or city";
}
