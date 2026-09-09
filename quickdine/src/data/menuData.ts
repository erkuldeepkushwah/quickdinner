export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    cuisine: string;
    flag: string;
    restaurantName: string;
    restaurantSlug: string;
    image: string;
    tags: string[];
    prepTime: string;
    calories: string;
    rating: number;
    spicy?: boolean;
    vegetarian?: boolean;
    glutenFree?: boolean;
    chefSpecial?: boolean;
}

export const menuCategories = [
    "All",
    "French",
    "Italian",
    "Japanese",
    "American",
    "Mexican",
    "Thai",
    "Indian",
    "Spanish",
    "Greek",
    "Korean",
    "Turkish",
    "Chinese",
] as const;

export const categoryMetadata: Record<
    string,
    { flag: string; label: string; origin: string }
> = {
    All: { flag: "🌐", label: "All", origin: "Global Gastronomy" },
    French: { flag: "🇫🇷", label: "French", origin: "France" },
    Italian: { flag: "🇮🇹", label: "Italian", origin: "Italy" },
    Japanese: { flag: "🇯🇵", label: "Japanese", origin: "Japan" },
    American: { flag: "🇺🇸", label: "American", origin: "United States" },
    Mexican: { flag: "🇲🇽", label: "Mexican", origin: "Mexico" },
    Thai: { flag: "🇹🇭", label: "Thai", origin: "Thailand" },
    Indian: { flag: "🇮🇳", label: "Indian", origin: "India" },
    Spanish: { flag: "🇪🇸", label: "Spanish", origin: "Spain" },
    Greek: { flag: "🇬🇷", label: "Greek", origin: "Greece" },
    Korean: { flag: "🇰🇷", label: "Korean", origin: "South Korea" },
    Turkish: { flag: "🇹🇷", label: "Turkish", origin: "Turkey" },
    Chinese: { flag: "🇨🇳", label: "Chinese", origin: "China" },
    Chines: { flag: "🇨🇳", label: "Chinese", origin: "China" },
};

export const menuItems: MenuItem[] = [
    {
        id: "french-beef-bourguignon",
        name: "Beef Bourguignon",
        description:
            "Prime beef braised for eight hours in Burgundy Pinot Noir with pearl onions, cremini mushrooms, heirloom baby carrots, bouquet garni, and buttered pomme purée.",
        price: 32,
        category: "French",
        cuisine: "French",
        flag: "🇫🇷",
        restaurantName: "L'Essence",
        restaurantSlug: "l-essence",
        image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
        tags: ["Classic French", "Slow-Braised", "Chef's Special"],
        prepTime: "25 min",
        calories: "680 kcal",
        rating: 4.9,
        chefSpecial: true,
        glutenFree: false,
        vegetarian: false,
    },
    {
        id: "italian-truffle-tagliatelle",
        name: "Truffle Tagliatelle",
        description:
            "Hand-rolled ribbons of fresh egg tagliatelle pasta tossed in aged Normandy butter, 24-month Parmigiano-Reggiano, and crowned with generous shavings of black winter Norcia truffle.",
        price: 28,
        category: "Italian",
        cuisine: "Italian",
        flag: "🇮🇹",
        restaurantName: "Terraza Cielo",
        restaurantSlug: "terraza-cielo",
        image: "https://images.unsplash.com/photo-1621996346565-e3d5d62811b3?auto=format&fit=crop&w=800&q=80",
        tags: ["Handmade Pasta", "Black Truffle", "Vegetarian"],
        prepTime: "18 min",
        calories: "540 kcal",
        rating: 4.9,
        vegetarian: true,
        chefSpecial: true,
    },
    {
        id: "japanese-salmon-sushi-omakase",
        name: "Salmon Sushi Omakase",
        description:
            "Curated flight of New Zealand Ora King salmon nigiri, flame-seared belly with nikiri reduction, ikura salmon roe gunkan, and seasonal sashimi with freshly grated Shizuoka wasabi.",
        price: 36,
        category: "Japanese",
        cuisine: "Japanese",
        flag: "🇯🇵",
        restaurantName: "Kuro Omakase",
        restaurantSlug: "kuro-omakase",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
        tags: ["Ora King Salmon", "Gluten-Free", "Chef's Special"],
        prepTime: "15 min",
        calories: "420 kcal",
        rating: 5.0,
        glutenFree: true,
        chefSpecial: true,
    },
    {
        id: "american-prime-wagyu-cheeseburger",
        name: "Prime Wagyu Cheeseburger",
        description:
            "Half-pound Snake River Farms Wagyu patty flame-grilled, melted 3-year Vermont white cheddar, caramelized Vidalia onion jam, black garlic dijonnaise on a toasted brioche bun with hand-cut truffle fries.",
        price: 30,
        category: "American",
        cuisine: "American",
        flag: "🇺🇸",
        restaurantName: "Ember Grille",
        restaurantSlug: "ember-grille",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        tags: ["Snake River Wagyu", "Truffle Fries", "House Favorite"],
        prepTime: "15 min",
        calories: "780 kcal",
        rating: 4.8,
    },
    {
        id: "mexican-chicken-mole-tacos",
        name: "Chicken Mole Tacos",
        description:
            "Slow-braised organic chicken bathed in a velvety 28-ingredient Oaxacan Mole Poblano with dark cacao and chilies, served on heirloom blue corn tortillas with crumbled queso fresco and pickled habanero onions.",
        price: 22,
        category: "Mexican",
        cuisine: "Mexican",
        flag: "🇲🇽",
        restaurantName: "Terraza Cielo",
        restaurantSlug: "terraza-cielo",
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80",
        tags: ["Artisanal Mole", "Gluten-Free", "Heritage Recipe"],
        prepTime: "14 min",
        calories: "490 kcal",
        rating: 4.8,
        glutenFree: true,
    },
    {
        id: "thai-green-curry-with-jasmine-rice",
        name: "Green Curry with Jasmine Rice",
        description:
            "Creamy coconut milk simmered with stone-ground green bird's eye chilies, Thai pea eggplants, bamboo shoots, kaffir lime zest, and sweet Thai holy basil, served alongside fragrant Royal Jasmine rice.",
        price: 24,
        category: "Thai",
        cuisine: "Thai",
        flag: "🇹🇭",
        restaurantName: "Flora Garden",
        restaurantSlug: "flora-garden",
        image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80",
        tags: ["Spicy Green Chili", "Gluten-Free", "Aromatic"],
        prepTime: "16 min",
        calories: "510 kcal",
        rating: 4.9,
        spicy: true,
        glutenFree: true,
    },
    {
        id: "indian-butter-chicken-garlic-naan",
        name: "Butter Chicken & Garlic Naan",
        description:
            "Clay oven tandoor-charred chicken simmered in an indulgent tomato and cashew makhani gravy enriched with churned butter and kasoori methi, paired with blistered hot garlic-herb naan.",
        price: 24,
        category: "Indian",
        cuisine: "Indian",
        flag: "🇮🇳",
        restaurantName: "L'Artiste",
        restaurantSlug: "l-artiste",
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
        tags: ["Tandoori Oven", "Velvety Makhani", "Guest Favorite"],
        prepTime: "20 min",
        calories: "650 kcal",
        rating: 4.9,
    },
    {
        id: "spanish-seafood-paella",
        name: "Seafood Paella",
        description:
            "Traditional saffron-infused Calasparra Bomba rice simmered in rich shellfish broth, generously crowned with wild jumbo tiger prawns, Mediterranean blue mussels, tender baby squid, and crisp caramelized socarrat crust.",
        price: 38,
        category: "Spanish",
        cuisine: "Spanish",
        flag: "🇪🇸",
        restaurantName: "Terraza Cielo",
        restaurantSlug: "terraza-cielo",
        image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80",
        tags: ["Bomba Rice", "Gluten-Free", "Chef's Special"],
        prepTime: "25 min",
        calories: "580 kcal",
        rating: 5.0,
        glutenFree: true,
        chefSpecial: true,
    },
    {
        id: "greek-grilled-lamb-souvlaki",
        name: "Grilled Lamb Souvlaki",
        description:
            "Pasture-raised Colorado lamb skewers marinated in wild oregano, garlic, and Kalamata olive oil, flame-kissed over hickory embers, served with warm pita, cucumber-dill tzatziki, and Greek village salad.",
        price: 29,
        category: "Greek",
        cuisine: "Greek",
        flag: "🇬🇷",
        restaurantName: "Ember Grille",
        restaurantSlug: "ember-grille",
        image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80",
        tags: ["Wood-Grilled", "Mediterranean", "Protein-Packed"],
        prepTime: "18 min",
        calories: "520 kcal",
        rating: 4.8,
    },
    {
        id: "korean-korean-bbq-short-ribs",
        name: "Korean BBQ Short Ribs",
        description:
            "Flanken-cut prime beef short ribs (Galbi) marinated for 48 hours in artisanal soy, Asian pear, toasted sesame oil, and garlic, seared over charcoal and served with dressed scallion salad, kimchi, and ssamjang.",
        price: 34,
        category: "Korean",
        cuisine: "Korean",
        flag: "🇰🇷",
        restaurantName: "Ember Grille",
        restaurantSlug: "ember-grille",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        tags: ["Galbi Marinade", "Charcoal-Fired", "Chef's Special"],
        prepTime: "18 min",
        calories: "690 kcal",
        rating: 4.9,
        chefSpecial: true,
    },
    {
        id: "turkish-lamb-adana-kebab",
        name: "Lamb Adana Kebab",
        description:
            "Hand-chopped lamb seasoned with roasted red peppers, Maras chili flakes, and cumin, hand-pressed onto flat iron skewers and charbroiled, served with sumac onion salad, grilled tomatoes, warm lavash, and garlic labneh.",
        price: 26,
        category: "Turkish",
        cuisine: "Turkish",
        flag: "🇹🇷",
        restaurantName: "Ember Grille",
        restaurantSlug: "ember-grille",
        image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80",
        tags: ["Charcoal Skewers", "Spicy", "Authentic"],
        prepTime: "16 min",
        calories: "560 kcal",
        rating: 4.8,
        spicy: true,
    },
    {
        id: "chinese-peking-duck",
        name: "Peking Duck",
        description:
            "Masterpiece Imperial roasted duck with lacquer-crisp amber skin and succulent meat, served with warm handmade steamed lotus pancakes, scallion slivers, English cucumber batons, and sweet fermented tianmian bean sauce.",
        price: 42,
        category: "Chinese",
        cuisine: "Chinese",
        flag: "🇨🇳",
        restaurantName: "Kuro Omakase",
        restaurantSlug: "kuro-omakase",
        image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=800&q=80",
        tags: ["Imperial Feast", "Crispy Amber Skin", "Chef's Special"],
        prepTime: "25 min",
        calories: "620 kcal",
        rating: 5.0,
        chefSpecial: true,
    },
];
