/**
 * AQUARIA – Premium Fashion Bags & Handmade Footwear
 * Product Catalog & Brand Data
 * Edit this file to add or modify bags, footwear, sizes, prices, and categories.
 */

const AQUARIA_DATA = {
  brand: {
    name: "AQUARIA",
    tagline: "Style in Every Step. Elegance in Every Carry.",
    category: "Premium Fashion Accessories",
    positioning: "Affordable Luxury",
    announcement: "STYLE IN EVERY STEP · ELEGANCE IN EVERY CARRY · COMPLIMENTARY EXPRESS DELIVERY OVER ₹1,999",
    currency: "₹",
    currencyCode: "INR",
    freeShippingThreshold: 1999
  },

  contactDetails: {
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "concierge@aquariabrand.com",
    address: "AQUARIA Atelier, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
    hours: "Monday – Saturday: 10:00 AM – 7:30 PM IST",
    supportNote: "Our personal stylists and client advisors respond within 2 to 4 business hours."
  },

  policies: {
    sizeGuide: {
      title: "AQUARIA Size & Fitting Atelier",
      subtitle: "Handmade Footwear & Handbag Proportions Guide",
      intro: "AQUARIA fancy footwear is lasted to standard Indian/European sizing with generous double-layer memory foam padding for extraordinary festive and everyday comfort.",
      fittingTip: "If you are between sizes or have broader feet, we recommend choosing one size up for slip-ons and ethnic juttis.",
      bagGuide: "• Petite / Crossbody: Fits phones up to 6.7\", keys, cardholder, lip balm\n• Shoulder / Satchel: Fits mini iPad, small diary, sunglasses case, cosmetics\n• Tote / Brief: Accommodates laptops up to 15.6\", planner, water bottle"
    },
    shipping: {
      title: "Complimentary Insured Shipping",
      subtitle: "Delivering Luxury to Every Pin Code Across India",
      content: "• FREE Shipping on orders above \u20B91,999 | Orders below \u20B91,999 attract \u20B9149 flat fee\n• Dispatch within 24\u201348 business hours of payment confirmation\n• Metro cities: 2\u20134 business days | Tier 2/3 cities: 3\u20135 days | Remote areas: 5\u20138 days\n• Live tracking via SMS and WhatsApp immediately after dispatch\n• All parcels 100% insured against loss or transit damage\n• Arrives in signature AQUARIA dust covers and rigid branded presentation box\n• For queries: concierge@aquariabrand.com | Mon\u2013Sat 10 AM\u20137:30 PM"
    },
    returns: {
      title: "7-Day Returns & Exchanges",
      subtitle: "Your Complete Peace of Mind, Guaranteed",
      content: "• Free doorstep reverse pickup for all eligible returns and size exchanges\n• 7-day return window from date of delivery\n• Items must be unworn, tags intact, with original dust bag and presentation box\n• Footwear must only have been tried on soft carpeted surfaces\n• Non-returnable: Final Sale items, customised / monogrammed products\n• Refunds: UPI/Bank 1\u20132 days | Credit/Debit Card 3\u20135 days | Store Credit instant\n• To initiate: email concierge@aquariabrand.com with Order ID | Mon\u2013Sat 10 AM\u20137:30 PM"
    },
    privacy: {
      title: "Privacy & Data Protection Policy",
      subtitle: "Strict Confidentiality & 256-Bit Encrypted Security",
      content: "• We collect only: name, address, phone, email, payment reference \u2014 for order fulfillment only\n• We NEVER store credit/debit card numbers, CVV or UPI PINs on our servers\n• All transactions secured via RBI-approved gateways (Razorpay/Cashfree) with 256-bit SSL\n• We NEVER sell, rent or share your data with any third-party marketing company\n• Data shared only with logistics partners (Blue Dart/Delhivery) for delivery\n• Your rights: Access, Correct, Delete your data \u2014 email concierge@aquariabrand.com\n• Newsletter opt-in only; unsubscribe anytime | Policy last updated: November 2026"
    }
  },

  // Two Main Shopping Departments
  departments: {
    bags: {
      id: "bags",
      title: "Elegance You Can Carry",
      subtitle: "The Handbag Department",
      description: "Designed for your daily motion and evening poise. Discover architectural silhouettes, premium vegan and grain leathers, and bespoke champagne gold hardware.",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
      categories: [
        {
          id: "handbags",
          name: "Handbags",
          image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
          desc: "Architectural structured silhouettes with artisanal top handles."
        },
        {
          id: "tote-bags",
          name: "Tote Bags",
          image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
          desc: "Spacious everyday luxury carrying laptops, notebooks, and essentials."
        },
        {
          id: "shoulder-bags",
          name: "Shoulder Bags",
          image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80",
          desc: "Sensual 90s curves tailored to rest effortlessly under the arm."
        },
        {
          id: "crossbody-bags",
          name: "Crossbody Bags",
          image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80",
          desc: "Hands-free movement with customizable slider chains and straps."
        },
        {
          id: "office-bags",
          name: "Office Bags",
          image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
          desc: "Poised professionalism with padded partitions and clean lines."
        },
        {
          id: "travel-bags",
          name: "Travel Bags",
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
          desc: "Refined weekender duffels and spacious carry-alls for getaways."
        }
      ]
    },

    footwear: {
      id: "footwear",
      title: "Beauty in Every Step",
      subtitle: "Handmade Footwear Atelier",
      description: "Artisanally crafted fancy footwear balancing intricate embroidery, plush memory foam cushioning, and featherlight soles for all-day glamour.",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85",
      categories: [
        {
          id: "fancy-sandals",
          name: "Handmade Fancy Sandals",
          image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
          desc: "Strappy silhouettes with champagne gold hardware & sculpted block heels."
        },
        {
          id: "embellished-footwear",
          name: "Embellished Footwear",
          image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80",
          desc: "Hand-set crystals, beadwork, and artisanal metallic accents."
        },
        {
          id: "handmade-flats",
          name: "Handmade Flats",
          image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80",
          desc: "Ultra-cushioned slide flats built for endless walking and everyday ease."
        },
        {
          id: "party-wear",
          name: "Party Wear Footwear",
          image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=800&q=80",
          desc: "High-shine metallic mules, flare heels, and evening statement pieces."
        },
        {
          id: "ethnic-footwear",
          name: "Ethnic Footwear",
          image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80",
          desc: "Handcrafted juttis and Kolhapuris reimagined with contemporary comfort."
        },
        {
          id: "occasion-wear",
          name: "Occasion Wear",
          image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
          desc: "Wedding and gala festive silhouettes made to dance without fatigue."
        }
      ]
    }
  },

  // Standard Shoe Sizes for Footwear
  standardShoeSizes: [
    { label: "IND 3 / EU 36", value: "36" },
    { label: "IND 4 / EU 37", value: "37" },
    { label: "IND 5 / EU 38", value: "38" },
    { label: "IND 6 / EU 39", value: "39" },
    { label: "IND 7 / EU 40", value: "40" },
    { label: "IND 8 / EU 41", value: "41" }
  ],

  // Full Unified Product Catalog
  products: [
    // ==================== BAGS ====================
    {
      id: "bag-1",
      department: "bags",
      category: "handbags",
      categoryName: "Handbags",
      name: "The Royal Burgundy Satchel",
      price: 3499,
      originalPrice: 4299,
      isNew: true,
      isBestseller: true,
      badge: "Bestseller",
      rating: 4.9,
      reviewCount: 42,
      description: "A refined architectural handbag crafted in our signature Royal Burgundy hue. Built with structured box gussets, brushed champagne gold turnlock hardware, and an ergonomic top handle.",
      dimensions: "28 cm (W) × 21 cm (H) × 11 cm (D)",
      strapDrop: "52 cm adjustable & detachable leather strap",
      material: "Premium textured vegan grain leather with brushed champagne brass hardware",
      careInstructions: "Wipe clean with a soft dry cloth. Store in the complimentary AQUARIA dust bag.",
      colors: [
        { name: "Royal Burgundy", hex: "#642D40" },
        { name: "Blush Pink", hex: "#F2DDE0" },
        { name: "Warm Porcelain", hex: "#FAF5EF" },
        { name: "Espresso", hex: "#35272A" }
      ],
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85"
      ]
    },
    {
      id: "bag-2",
      department: "bags",
      category: "tote-bags",
      categoryName: "Tote Bags",
      name: "Palermo Reversible Canvas & Leather Tote",
      price: 2899,
      originalPrice: 3499,
      isNew: true,
      isBestseller: false,
      badge: "New Arrival",
      rating: 4.8,
      reviewCount: 29,
      description: "Generously proportioned for busy mornings, market strolls, and weekend flights. Features heavy 24oz organic cotton canvas framed in Royal Burgundy saddle leather trim.",
      dimensions: "40 cm (W) × 32 cm (H) × 16 cm (D)",
      strapDrop: "26 cm reinforced padded shoulder drop",
      material: "24oz Water-repellent organic cotton canvas with Royal Burgundy vegan leather base",
      careInstructions: "Spot clean canvas with gentle soap. Avoid soaking leather handles.",
      colors: [
        { name: "Porcelain & Burgundy", hex: "#642D40" },
        { name: "Porcelain & Espresso", hex: "#35272A" },
        { name: "Warm Sand", hex: "#FAF5EF" }
      ],
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=85"
      ]
    },
    {
      id: "bag-3",
      department: "bags",
      category: "shoulder-bags",
      categoryName: "Shoulder Bags",
      name: "The Verona Crescent Shoulder Bag",
      price: 2499,
      originalPrice: 2999,
      isNew: false,
      isBestseller: true,
      badge: "Trending",
      rating: 4.9,
      reviewCount: 56,
      description: "An understated crescent contour that rests seamlessly underarm. Finished with an invisible magnetic closure and foil-embossed AQUARIA insignia in champagne gold.",
      dimensions: "26 cm (W) × 16 cm (H) × 7.5 cm (D)",
      strapDrop: "24 cm fixed contour drop",
      material: "Silky matte vegan box leather with velvet microsuede lining",
      careInstructions: "Keep away from direct heat and sharp objects.",
      colors: [
        { name: "Blush Pink", hex: "#F2DDE0" },
        { name: "Royal Burgundy", hex: "#642D40" },
        { name: "Espresso", hex: "#35272A" },
        { name: "Warm Porcelain", hex: "#FAF5EF" }
      ],
      image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85"
      ]
    },
    {
      id: "bag-4",
      department: "bags",
      category: "crossbody-bags",
      categoryName: "Crossbody Bags",
      name: "Florence Accordion Crossbody",
      price: 2299,
      originalPrice: null,
      isNew: true,
      isBestseller: false,
      badge: "New Arrival",
      rating: 4.7,
      reviewCount: 18,
      description: "Compact yet surprisingly spacious with a triple-compartment accordion interior. Fitted with a detachable chain-and-leather strap for quick conversion into a clutch.",
      dimensions: "22 cm (W) × 15 cm (H) × 8 cm (D)",
      strapDrop: "54 cm detachable sliding strap",
      material: "Pebbled grain leatherette with champagne satin gold accents",
      careInstructions: "Store in dust cover with chain strap tucked inside.",
      colors: [
        { name: "Champagne Gold", hex: "#C4A477" },
        { name: "Royal Burgundy", hex: "#642D40" },
        { name: "Espresso", hex: "#35272A" }
      ],
      image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=900&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=900&q=85"
      ]
    },
    {
      id: "bag-5",
      department: "bags",
      category: "office-bags",
      categoryName: "Office Bags",
      name: "The Milano Executive Structured Brief",
      price: 3899,
      originalPrice: 4699,
      isNew: false,
      isBestseller: true,
      badge: "Office Edit",
      rating: 4.9,
      reviewCount: 37,
      description: "Tailored for the modern professional. Dedicated padded 14-inch laptop sleeve, pen organizers, key leash, and a discreet luggage trolley strap on the reverse.",
      dimensions: "38 cm (W) × 28 cm (H) × 12 cm (D)",
      strapDrop: "16 cm handle drop + 55 cm shoulder strap",
      material: "Structured scratch-resistant cross-grain vegan leather",
      careInstructions: "Wipe with damp cloth and mild cleanser.",
      colors: [
        { name: "Espresso", hex: "#35272A" },
        { name: "Royal Burgundy", hex: "#642D40" },
        { name: "Warm Porcelain", hex: "#FAF5EF" }
      ],
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85"
      ]
    },
    {
      id: "bag-6",
      department: "bags",
      category: "travel-bags",
      categoryName: "Travel Bags",
      name: "Riviera Weekend Weekender Duffle",
      price: 4199,
      originalPrice: 4999,
      isNew: true,
      isBestseller: false,
      badge: "Vacation Edit",
      rating: 4.8,
      reviewCount: 22,
      description: "Crafted for spontaneous escapes and resort getaways. Features a ventilated separate bottom shoe compartment and reinforced handles.",
      dimensions: "48 cm (W) × 30 cm (H) × 22 cm (D)",
      strapDrop: "Comfortable dual handles with padded shoulder strap",
      material: "High-density nylon body with Royal Burgundy leather trims",
      careInstructions: "Hand wash nylon panels with warm water and soft brush.",
      colors: [
        { name: "Royal Burgundy", hex: "#642D40" },
        { name: "Espresso", hex: "#35272A" }
      ],
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85"
      ]
    },

    // ==================== FOOTWEAR ====================
    {
      id: "shoe-1",
      department: "footwear",
      category: "fancy-sandals",
      categoryName: "Handmade Fancy Sandals",
      name: "Aura Champagne Strappy Block Heels",
      price: 2699,
      originalPrice: 3299,
      isNew: true,
      isBestseller: true,
      badge: "Handcrafted",
      rating: 4.9,
      reviewCount: 64,
      sizes: ["36", "37", "38", "39", "40", "41"],
      heelHeight: "2.5 inches comfortable flared block heel",
      description: "Individually handcrafted by our skilled footwear artisans. Fine metallic tubular straps gracefully frame the foot, anchored by a sculpted block heel and 6mm double-layer memory foam padding for all-night comfort.",
      handmadeNote: "Each pair is lasted and stitched by hand in limited batches, ensuring refined edge finishing.",
      material: "Metallic vegan leather upper with breathable micro-perforated lining & non-slip resin sole",
      careInstructions: "Store wrapped in tissue paper inside shoe box. Avoid water submersion.",
      colors: [
        { name: "Champagne Gold", hex: "#C4A477" },
        { name: "Blush Pink", hex: "#F2DDE0" },
        { name: "Royal Burgundy", hex: "#642D40" }
      ],
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=900&q=85"
      ]
    },
    {
      id: "shoe-2",
      department: "footwear",
      category: "embellished-footwear",
      categoryName: "Embellished Footwear",
      name: "Zari Pearl & Crystal Gilded Mules",
      price: 2999,
      originalPrice: 3599,
      isNew: true,
      isBestseller: true,
      badge: "Occasion Edit",
      rating: 5.0,
      reviewCount: 38,
      sizes: ["36", "37", "38", "39", "40"],
      heelHeight: "1.8 inches kitten block heel",
      description: "An opulent statement for cocktail soirees and weddings. Features hand-placed baroque faux pearls, faceted glass crystals, and fine champagne metallic zardozi embroidery over soft velvet.",
      handmadeNote: "Hand-embroidered by heritage zardozi craftsmen with reinforced backing.",
      material: "Silk velvet upper, hand-sewn pearl clusters, cushioned arch support bed",
      careInstructions: "Spot clean gently with dry microfibre cloth. Do not apply chemical cleaners on stones.",
      colors: [
        { name: "Royal Burgundy", hex: "#642D40" },
        { name: "Blush Pink", hex: "#F2DDE0" },
        { name: "Champagne Gold", hex: "#C4A477" }
      ],
      image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=900&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85"
      ]
    },
    {
      id: "shoe-3",
      department: "footwear",
      category: "handmade-flats",
      categoryName: "Handmade Flats",
      name: "Sienna Braided Leather Slide Flats",
      price: 1899,
      originalPrice: 2299,
      isNew: false,
      isBestseller: true,
      badge: "Everyday Chic",
      rating: 4.8,
      reviewCount: 71,
      sizes: ["36", "37", "38", "39", "40", "41"],
      heelHeight: "0.5 inch flat with anti-skid rubber tap",
      description: "Effortless casual luxury. Hand-interwoven tubular straps curve over the instep, paired with our proprietary triple-cushion ergonomic footbed for effortless all-day walking.",
      handmadeNote: "Individual straps hand-plaited and lasted to prevent friction or blisters.",
      material: "Supple nappa-feel vegan leather with anti-slip grooved rubber sole",
      careInstructions: "Wipe with soft clean cloth. Keep away from excessive moisture.",
      colors: [
        { name: "Blush Pink", hex: "#F2DDE0" },
        { name: "Warm Porcelain", hex: "#FAF5EF" },
        { name: "Espresso", hex: "#35272A" },
        { name: "Royal Burgundy", hex: "#642D40" }
      ],
      image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=900&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85"
      ]
    },
    {
      id: "shoe-4",
      department: "footwear",
      category: "party-wear",
      categoryName: "Party Wear Footwear",
      name: "Lucia Metallic Mirror-Finish Flare Sandals",
      price: 2799,
      originalPrice: null,
      isNew: true,
      isBestseller: false,
      badge: "Party Favourite",
      rating: 4.9,
      reviewCount: 33,
      sizes: ["36", "37", "38", "39", "40"],
      heelHeight: "3.0 inches sculptural metallic flare heel",
      description: "Turn heads at every party. Featuring high-gloss champagne gold mirrored straps, square-toe modernist styling, and an ankle strap with an adjustable buckle.",
      handmadeNote: "Meticulously lasted by hand for stability and weight distribution across the foot.",
      material: "High-spec metallic patent finish with cushioned leatherette insole",
      careInstructions: "Buff gently with a microfiber cloth to maintain mirror shine.",
      colors: [
        { name: "Champagne Gold", hex: "#C4A477" },
        { name: "Royal Burgundy", hex: "#642D40" }
      ],
      image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=900&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85"
      ]
    },
    {
      id: "shoe-5",
      department: "footwear",
      category: "ethnic-footwear",
      categoryName: "Ethnic Footwear",
      name: "Noor Handcrafted Royal Embroidered Jutti",
      price: 2199,
      originalPrice: 2699,
      isNew: false,
      isBestseller: true,
      badge: "Artisanal Craft",
      rating: 4.9,
      reviewCount: 84,
      sizes: ["36", "37", "38", "39", "40", "41"],
      heelHeight: "Flat traditional silhouette with cushioned heel collar",
      description: "A celebration of regal heritage. Elaborately embellished with champagne beads, dabka work, and sequins over Royal Burgundy raw silk, engineered with bite-free padded collars.",
      handmadeNote: "Purely hand-embroidered and hand-stitched by traditional jutti master karigars.",
      material: "Raw silk fabric upper, genuine soft leather sole, memory foam insole",
      careInstructions: "Dry clean only. Store with silica gel in shoe bag.",
      colors: [
        { name: "Royal Burgundy", hex: "#642D40" },
        { name: "Blush Pink", hex: "#F2DDE0" },
        { name: "Champagne Gold", hex: "#C4A477" }
      ],
      image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=900&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=900&q=85"
      ]
    },
    {
      id: "shoe-6",
      department: "footwear",
      category: "occasion-wear",
      categoryName: "Occasion Wear",
      name: "Celeste Ankle-Tie Gilded Evening Sandal",
      price: 2899,
      originalPrice: 3499,
      isNew: true,
      isBestseller: false,
      badge: "Wedding Edit",
      rating: 4.8,
      reviewCount: 26,
      sizes: ["36", "37", "38", "39", "40"],
      heelHeight: "2.2 inches kitten flared heel",
      description: "Designed for grand celebrations and twilight weddings. Features delicate blush satin straps, fine crystal aglets on the ankle ties, and responsive cushioning.",
      handmadeNote: "Assembled by hand with reinforced heel pins for steady festive dancing.",
      material: "Blush pink silk-satin blend with champagne crystal tips & skid-proof sole",
      careInstructions: "Keep ties rolled neatly to avoid creasing.",
      colors: [
        { name: "Blush Pink", hex: "#F2DDE0" },
        { name: "Champagne Gold", hex: "#C4A477" },
        { name: "Royal Burgundy", hex: "#642D40" }
      ],
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85"
      ]
    }
  ],

  // Why AQUARIA 4 Pillars
  whyAquaria: [
    {
      title: "Affordable Luxury",
      icon: "diamond",
      description: "Direct-to-consumer fine accessories combining runway-inspired aesthetics with accessible pricing."
    },
    {
      title: "Handmade Footwear",
      icon: "hammer",
      description: "Skillfully lasted fancy footwear featuring memory foam padding, hand-embroidery, and bite-free collars."
    },
    {
      title: "Versatile Fashion",
      icon: "sparkles",
      description: "Silhouettes thoughtfully engineered to transition effortlessly from morning office desks to evening galas."
    },
    {
      title: "Style for Every Occasion",
      icon: "calendar",
      description: "Complete pairings of curated bags and fancy footwear created for all generations and celebrations."
    }
  ],

  // Instagram Style Diary
  styleDiary: [
    {
      id: "diary-1",
      tag: "Bag Styling",
      handle: "@aquaria.official",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
      caption: "The Royal Burgundy Satchel caught in warm sunset glow."
    },
    {
      id: "diary-2",
      tag: "Handmade Footwear",
      handle: "@aquaria.official",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
      caption: "Champagne strappy block heels made for dancing through the night."
    },
    {
      id: "diary-3",
      tag: "Complete Look",
      handle: "@aquaria.official",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
      caption: "Style in every step. Elegance in every carry."
    },
    {
      id: "diary-4",
      tag: "Footwear Detail",
      handle: "@aquaria.official",
      image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=600&q=80",
      caption: "Baroque faux pearls and zardozi crystals hand-set one by one."
    },
    {
      id: "diary-5",
      tag: "Everyday Carry",
      handle: "@aquaria.official",
      image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80",
      caption: "The Verona Crescent in Blush Pink. Understated luxury."
    },
    {
      id: "diary-6",
      tag: "Festive Occasion",
      handle: "@aquaria.official",
      image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80",
      caption: "Regal raw silk juttis with bite-free cushioning."
    }
  ],

  // Sample Customer Reviews (Clearly Marked Placeholders)
  sampleReviews: [
    {
      id: "rev-1",
      author: "Pooja Varma",
      city: "Mumbai",
      productName: "The Royal Burgundy Satchel & Aura Heels",
      type: "Bags & Footwear",
      rating: 5,
      title: "The matching set is stunning!",
      content: "I wore the Burgundy satchel with the champagne heels for my sister's reception. The heels have extraordinary cushioning—no sore feet after 6 hours on the dance floor!"
    },
    {
      id: "rev-2",
      author: "Rhea Sen",
      city: "Kolkata",
      productName: "Noor Embroidered Jutti",
      type: "Footwear",
      rating: 5,
      title: "Zero shoe bites, pure luxury.",
      content: "Usually traditional footwear gives me blisters within an hour. AQUARIA's padded collar is a game changer. The craftsmanship and beadwork look like high-end designer pieces."
    },
    {
      id: "rev-3",
      author: "Ananya Deshmukh",
      city: "Pune",
      productName: "Milano Executive Structured Brief",
      type: "Bags",
      rating: 5,
      title: "Exceeded all expectations for work.",
      content: "Fits my laptop, charger, and daily makeup kit with structured poise. The champagne gold hardware against the deep burgundy finish feels truly luxurious."
    }
  ]
};
