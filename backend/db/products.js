/* ===================================
   JEMENA TRADING LIMITED
   SQLite Products Database
   =================================== */

'use strict';

const Database = require('better-sqlite3');
const path = require('path');
const Fuse = require('fuse.js');

const DB_PATH = path.join(__dirname, 'jemena.db');

// =====================
// Seed Data
// (Migrated from PRODUCT_DATA dictionary)
// =====================
const SEED_PRODUCTS = [
    // --- Soaps & Detergents ---
    { name: "Sodium Hydroxide", category: "Soaps and Detergents", uses: "Essential for soap making and neutralization processes in chemical manufacturing.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "SLES 70%", category: "Soaps and Detergents", uses: "Foaming agent used in detergents, shampoos, and cleaning products.", packaging: ["5kg", "20kg", "170kg Drum"], available: 1 },
    { name: "Sulphonic Acid LABSA 90% & 96%", category: "Soaps and Detergents", uses: "Main ingredient in detergents and cleaning products.", packaging: ["5kg", "20kg", "250kg Drum"], available: 1 },
    { name: "Sodium Tripolyphosphate (STPP)", category: "Soaps and Detergents", uses: "Water softener and detergent builder.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Benzalkonium Chloride 50%", category: "Soaps and Detergents", uses: "Versatile disinfectant for healthcare and industrial uses.", packaging: ["200kg Drum", "Custom Packaging Available"], available: 1 },
    { name: "Benzalkonium Chloride 80%", category: "Soaps and Detergents", uses: "High-concentration disinfectant for industrial applications.", packaging: ["200kg Drum", "Custom Packaging Available"], available: 1 },
    { name: "CMC (Sodium Carboxymethyl Cellulose)", category: "Soaps and Detergents", uses: "Thickening agent used in food and pharmaceutical industries.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Cocodiethanol Amide 85% (CDE)", category: "Soaps and Detergents", uses: "Enhances foaming in shampoos and personal care products.", packaging: ["210kg Drum", "Custom Packaging Available"], available: 1 },
    { name: "Deionized Water", category: "Soaps and Detergents", uses: "Used in laboratories, cosmetics, and industrial processes.", packaging: ["1,000L", "Custom Packaging Available"], available: 1 },
    { name: "EDTA 99% Disodium (2NA)", category: "Soaps and Detergents", uses: "Chelating agent for cleaning and stabilizing solutions.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "EDTA 99% Tetra Sodium (4NA)", category: "Soaps and Detergents", uses: "Water softener for detergents and industrial processes.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Fabric Softener Stepantex VL 90A", category: "Soaps and Detergents", uses: "Enhances softness and fragrance in laundry.", packaging: ["5kg", "10kg", "20kg", "200kg Drum"], available: 1 },
    { name: "Fine Salt", category: "Soaps and Detergents", uses: "Refined salt for industrial and food-grade applications.", packaging: ["Custom Packaging Available", "50kg"], available: 1 },
    { name: "Formalin (Formaldehyde 37%)", category: "Soaps and Detergents", uses: "Preservative and disinfectant for industrial use.", packaging: ["Custom Packaging Available", "35kg"], available: 1 },
    { name: "Hydrofluoric Acid 50-55%", category: "Soaps and Detergents", uses: "Specialized acid for etching and cleaning applications.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Industrial Salt", category: "Soaps and Detergents", uses: "Salt for chemical processes and de-icing.", packaging: ["Custom Packaging Available", "50kg"], available: 1 },
    { name: "Kaolin", category: "Soaps and Detergents", uses: "Fine clay for ceramics, paints, and filler applications.", packaging: ["50kg"], available: 1 },
    { name: "Magnesium Sulphate Crystal (Epsom Salt)", category: "Soaps and Detergents", uses: "Therapeutic and agricultural applications.", packaging: ["25kg", "50kg"], available: 1 },
    { name: "Nansa H85", category: "Soaps and Detergents", uses: "Surfactant for detergents and cleaning agents.", packaging: ["Custom Packaging Available", "20kg"], available: 1 },
    { name: "Nonylphenol Ethoxylate (NPE9)", category: "Soaps and Detergents", uses: "Non-ionic surfactant for emulsifying and cleaning.", packaging: ["5kg", "20kg", "200kg Drum"], available: 1 },
    { name: "Oleic Acid 75%", category: "Soaps and Detergents", uses: "Used in soaps, cosmetics, and lubricants.", packaging: ["5kg", "20kg", "190kg Drum"], available: 1 },
    { name: "Optical Brightener", category: "Soaps and Detergents", uses: "Enhances brightness in textiles and papers.", packaging: ["1kg", "5kg", "10kg", "24kg"], available: 1 },
    { name: "Para-dichlorobenzene (PDCB)", category: "Soaps and Detergents", uses: "Deodorizer and solvent for industrial applications.", packaging: ["25kg"], available: 1 },
    { name: "Pearlizer/Ufablend", category: "Soaps and Detergents", uses: "Provides pearlescent finish to cosmetics and detergents.", packaging: ["5kg", "20kg", "Custom Packaging Available"], available: 1 },
    { name: "Pine Oil 85% & 96%", category: "Soaps and Detergents", uses: "Disinfectant and fragrance in cleaning products.", packaging: ["1kg", "5kg", "20kg", "185kg Drum"], available: 1 },
    { name: "Polyquaternium7 (PQ7)", category: "Soaps and Detergents", uses: "Used in conditioners and personal care products.", packaging: ["1kg", "5kg", "20kg", "200kg Drum"], available: 1 },
    { name: "Potassium Hydroxide Flakes", category: "Soaps and Detergents", uses: "Key ingredient for soap and industrial applications.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Whiting 40 (Calcium Carbonate 52%)", category: "Soaps and Detergents", uses: "Used as filler and coating in paints and plastics.", packaging: ["Custom Packaging Available", "50kg"], available: 1 },
    { name: "SLES 70%", category: "Soaps and Detergents", uses: "Foaming agent used in detergents and cleaning products.", packaging: ["170kg Drum", "Custom Packaging Available"], available: 1 },
    { name: "Soda Ash Light", category: "Soaps and Detergents", uses: "Commonly used in glass manufacturing and detergents.", packaging: ["Custom Packaging Available", "50kg"], available: 1 },
    { name: "Sodium Bicarbonate", category: "Soaps and Detergents", uses: "Versatile product used in baking, cleaning, and pharmaceuticals.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Sodium Carbonate Dense (Magadi)", category: "Soaps and Detergents", uses: "Widely used in detergents and glass production.", packaging: ["Custom Packaging Available", "50kg"], available: 1 },
    { name: "Sodium Cumene Sulfonate 40% (SC40)", category: "Soaps and Detergents", uses: "Cleaning agent and solubilizer for household products.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Sodium Gluconate", category: "Soaps and Detergents", uses: "Used as a chelating agent and concrete additive.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Sodium Hydrosulphite 88%", category: "Soaps and Detergents", uses: "A bleaching agent used in textiles and pulp industries.", packaging: ["Custom Packaging Available", "50kg"], available: 1 },
    { name: "Sodium Hypochlorite 10%", category: "Soaps and Detergents", uses: "Powerful disinfectant for water treatment and cleaning.", packaging: ["Custom Packaging Available", "24kg"], available: 1 },
    { name: "Sodium Meta Bisulphite", category: "Soaps and Detergents", uses: "Preservative and disinfectant for industrial use.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Sodium Metasilicate Penta", category: "Soaps and Detergents", uses: "Detergent builder and corrosion inhibitor.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Sodium Perborate Tetrahydrate", category: "Soaps and Detergents", uses: "Used in detergents for its bleaching properties.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Sodium Silicate", category: "Soaps and Detergents", uses: "Binder in cements and refractory applications.", packaging: ["Custom Packaging Available", "30kg"], available: 1 },
    { name: "Sodium Sulphate Anhydrous", category: "Soaps and Detergents", uses: "Used in detergents and paper manufacturing.", packaging: ["Custom Packaging Available", "50kg"], available: 1 },
    { name: "Sodium Xylene Sulfonate 60%", category: "Soaps and Detergents", uses: "Detergent additive and solubilizer.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Talcum Powder", category: "Soaps and Detergents", uses: "Used as a filler in various industrial applications.", packaging: ["50kg"], available: 1 },
    { name: "Tego Betain CAPB 30%", category: "Soaps and Detergents", uses: "Mild surfactant for personal care and detergents.", packaging: ["5kg", "20kg", "235kg Drum"], available: 1 },
    { name: "Titanium Dioxide", category: "Soaps and Detergents", uses: "White pigment used in paints, plastics, and cosmetics.", packaging: ["25kg"], available: 1 },
    { name: "Triethanolamine 99% (TEA)", category: "Soaps and Detergents", uses: "Emulsifier and pH balancer for personal care products.", packaging: ["1kg", "5kg", "20kg", "230kg Drum"], available: 1 },
    { name: "Urea", category: "Soaps and Detergents", uses: "Fertilizer and raw material for industrial applications.", packaging: ["50kg"], available: 1 },

    // --- Solvents ---
    { name: "Acetone", category: "Solvents", uses: "A versatile solvent used in cleaning, thinning, and cosmetic formulations.", packaging: ["5kg", "20kg", "Drum"], available: 1 },
    { name: "Butyl Glycol Ether", category: "Solvents", uses: "Solvent for paints, coatings, and cleaning products.", packaging: ["5kg", "20kg", "Drum"], available: 1 },
    { name: "Carbomer 940", category: "Solvents", uses: "Thickening agent in personal care and cosmetic products.", packaging: ["Custom Packaging Available", "20kg"], available: 1 },
    { name: "Denatured IMS 96%", category: "Solvents", uses: "Industrial solvent and disinfectant for various applications.", packaging: ["5kg", "20kg", "Drum"], available: 1 },
    { name: "Isopropyl Alcohol Pure", category: "Solvents", uses: "A multipurpose solvent and sanitizer in cleaning and cosmetic products.", packaging: ["5kg", "20kg", "Drum"], available: 1 },
    { name: "Methanol Denatured", category: "Solvents", uses: "Solvent for industrial and laboratory use.", packaging: ["5kg", "20kg", "Drum"], available: 1 },
    { name: "Solvent C9 (Naphtha 100)", category: "Solvents", uses: "Used in paints, coatings, and industrial cleaning applications.", packaging: ["5kg", "20kg", "Drum"], available: 1 },
    { name: "White Spirit", category: "Solvents", uses: "Solvent for thinning paints, cleaning tools, and degreasing surfaces.", packaging: ["5kg", "20kg", "Drum"], available: 1 },

    // --- Water Treatment ---
    { name: "Aluminium Sulphate Powder", category: "Water Treatment", uses: "Used in water treatment as a coagulant which removes suspended particles and impurities in water.", packaging: ["50kg"], available: 1 },
    { name: "Aluminium Sulphate Rock", category: "Water Treatment", uses: "An effective coagulant used in water treatment to remove suspended particles and impurities.", packaging: ["50kg"], available: 1 },
    { name: "Ammonia Liquor 25%", category: "Water Treatment", uses: "Commonly used in industrial cleaning and water treatment.", packaging: ["5kg", "20kg", "33kg", "Custom Packaging Available"], available: 1 },
    { name: "Benzalkonium Chloride 50% (WT)", category: "Water Treatment", uses: "A versatile disinfectant for healthcare and industrial uses.", packaging: ["200kg Drum", "Custom Packaging Available"], available: 1 },
    { name: "Benzalkonium Chloride 80% (WT)", category: "Water Treatment", uses: "High-concentration disinfectant for industrial applications.", packaging: ["200kg Drum", "Custom Packaging Available"], available: 1 },
    { name: "Calcium Hypo Chlorite 65-70%", category: "Water Treatment", uses: "Disinfectant for water treatment and swimming pools.", packaging: ["Custom Packaging Available", "45kg"], available: 1 },
    { name: "Chlorine 90% TCCA", category: "Water Treatment", uses: "Used as a disinfecting agent in swimming pools and fountain water bodies, aids in achieving sparkling clean and clear water.", packaging: ["Custom Packaging Available", "50kg"], available: 1 },
    { name: "Copper Sulphate Pentahydrate", category: "Water Treatment", uses: "Used as an algaecide in swimming pools which improves water clarity.", packaging: ["25kg"], available: 1 },
    { name: "Poly Aluminium Chloride (PAC)", category: "Water Treatment", uses: "Efficient coagulant for water purification and treatment.", packaging: ["25kg", "50kg"], available: 1 },

    // --- Mining ---
    { name: "Borax Decahydrate", category: "Mining", uses: "Used in cleaning, as a flux in metallurgy, and in the manufacture of glass and ceramics.", packaging: ["25kg"], available: 1 },
    { name: "Caustic Soda Flakes", category: "Mining", uses: "Used in soap making, water treatment, and in the manufacturing of various chemicals.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Caustic Soda Pearls", category: "Mining", uses: "Commonly used in cleaning, manufacturing of soaps, and as a neutralizing agent in industrial processes.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Hydrochloric Acid 30-35%", category: "Mining", uses: "Used in pickling of metals, in the production of organic compounds, and as a laboratory reagent.", packaging: ["Custom Packaging Available", "40kg"], available: 1 },
    { name: "Hydrogen Peroxide 50%", category: "Mining", uses: "Used as a bleaching agent, disinfectant, and for water treatment.", packaging: ["Custom Packaging Available", "30kg", "40kg"], available: 1 },
    { name: "Nitric Acid", category: "Mining", uses: "Used in the production of fertilizers, explosives, and as a cleaning agent in industrial applications.", packaging: ["35kg"], available: 1 },
    { name: "Oxalic Acid Dihydrate", category: "Mining", uses: "Used as a cleaning agent, in bleaching, and in rust removal.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Sulphuric Acid", category: "Mining", uses: "Widely used in industry for producing fertilizers, chemicals, and in petroleum refining.", packaging: ["47kg"], available: 1 },
    { name: "Sodium Sulphide (Yellow Flakes)", category: "Mining", uses: "Used in the manufacture of dyes, textiles, and in chemical processes in industries like paper production.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },

    // --- Food Industry ---
    { name: "Citric Acid", category: "Food Industry", uses: "Used as a preservative, flavoring agent, and in the production of cleaning agents and cosmetics.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Corn Starch", category: "Food Industry", uses: "Used in the food industry as a thickening agent and in the production of biodegradable plastics.", packaging: ["25kg"], available: 1 },
    { name: "Glacial Acetic Acid", category: "Food Industry", uses: "Used in the production of vinegar, as a solvent, and in chemical synthesis processes.", packaging: ["Custom Packaging Available", "30kg"], available: 1 },
    { name: "Hydrogen Peroxide 35%", category: "Food Industry", uses: "Used as a disinfectant, bleach, and in the treatment of drinking water and wastewater.", packaging: ["Custom Packaging Available", "30kg"], available: 1 },
    { name: "Phosphoric Acid Food Grade 85%", category: "Food Industry", uses: "Used in the food industry as an acidulant, pH adjuster, and in the production of phosphate salts.", packaging: ["Custom Packaging Available", "35kg"], available: 1 },
    { name: "Sodium Benzoate Powder", category: "Food Industry", uses: "Used as a preservative in food and beverages, and in cosmetics and pharmaceuticals.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },

    // --- Essential Oils & Fragrances ---
    { name: "Color Acid Blue 80", category: "Essential Oils", uses: "Used for coloring in industrial and textile applications.", packaging: ["1kg"], available: 1 },
    { name: "Color Apple Green", category: "Essential Oils", uses: "Widely used in food, textiles, and personal care products for vibrant green shades.", packaging: ["1kg"], available: 1 },
    { name: "Color Brilliant Blue", category: "Essential Oils", uses: "Commonly used in food, beverages, and cosmetics for a bright blue hue.", packaging: ["1kg"], available: 1 },
    { name: "Color Egg Yellow", category: "Essential Oils", uses: "Used in food coloring, cosmetics, and decorative applications.", packaging: ["1kg"], available: 1 },
    { name: "Color Iragon Blue ABL 9", category: "Essential Oils", uses: "Specialized blue dye for industrial and personal care use.", packaging: ["1kg"], available: 1 },
    { name: "Color Pink Rose", category: "Essential Oils", uses: "Used in cosmetics, food products, and decorative applications.", packaging: ["1kg"], available: 1 },
    { name: "Color Puricolor Green PGR7", category: "Essential Oils", uses: "Bright green dye for industrial and decorative purposes.", packaging: ["1kg"], available: 1 },
    { name: "Color Puricolor Yellow AYE 23", category: "Essential Oils", uses: "Yellow dye for food, textile, and cosmetic applications.", packaging: ["1kg"], available: 1 },
    { name: "Color Raspberry", category: "Essential Oils", uses: "Used for a vibrant red color in food, cosmetics, and textiles.", packaging: ["1kg"], available: 1 },
    { name: "Color Sunset Yellow", category: "Essential Oils", uses: "Widely used in food and beverages for bright orange-yellow hues.", packaging: ["1kg"], available: 1 },
    { name: "Color Tomato Red", category: "Essential Oils", uses: "Used in food, cosmetics, and textiles for vibrant red tones.", packaging: ["1kg"], available: 1 },
    { name: "Essential Oil Almond Sweet", category: "Essential Oils", uses: "Used in cosmetics, massage oils, and aromatherapy for its nourishing properties.", packaging: ["1L"], available: 1 },
    { name: "Essential Oil Aloe Vera", category: "Essential Oils", uses: "Known for its soothing and hydrating properties in skincare products.", packaging: ["1L"], available: 1 },
    { name: "Essential Oil Eucalyptus", category: "Essential Oils", uses: "Used for its refreshing aroma and therapeutic properties in personal care products.", packaging: ["1L"], available: 1 },
    { name: "Essential Oil Frutine", category: "Essential Oils", uses: "A fruity oil blend for use in cosmetics, perfumes, and air fresheners.", packaging: ["1L"], available: 1 },
    { name: "Essential Oil Kired", category: "Essential Oils", uses: "A specialty oil for cosmetics and personal care formulations.", packaging: ["500ml", "1L"], available: 1 },
    { name: "Essential Oil Lemon Grass", category: "Essential Oils", uses: "Used in aromatherapy, skincare, and as a natural insect repellent.", packaging: ["500ml", "1L"], available: 1 },
    { name: "Essential Oil Lemon Perfume", category: "Essential Oils", uses: "A refreshing lemon fragrance for perfumes and personal care products.", packaging: ["500ml", "1L"], available: 1 },
    { name: "Essential Oil Peppermint BP", category: "Essential Oils", uses: "Known for its cooling and invigorating properties in skincare and aromatherapy.", packaging: ["500ml", "1L"], available: 1 },
    { name: "Essential Oil Pine Fresh", category: "Essential Oils", uses: "Used for its refreshing pine scent in air fresheners and personal care products.", packaging: ["500ml", "1L"], available: 1 },
    { name: "Essential Oil Silky", category: "Essential Oils", uses: "A light, silky fragrance oil for cosmetic and aromatherapy applications.", packaging: ["500ml", "1L"], available: 1 },
    { name: "Essential Oil Suaril", category: "Essential Oils", uses: "A versatile oil for use in cosmetics and perfumes.", packaging: ["500ml", "1L"], available: 1 },
    { name: "Essential Oil Tea Tree Oil", category: "Essential Oils", uses: "Known for its antibacterial and antifungal properties in skincare products.", packaging: ["500ml", "1L"], available: 1 },
    { name: "Fragrance Apricot", category: "Essential Oils", uses: "A sweet and fruity apricot fragrance for personal care products and air fresheners.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Fragrance Eternall Eagle", category: "Essential Oils", uses: "A bold and sophisticated fragrance for high-end personal care products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Fragrance Grape Fruit", category: "Essential Oils", uses: "A refreshing and tangy grapefruit scent for perfumes and cosmetics.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Fragrance Strawberry", category: "Essential Oils", uses: "A sweet and vibrant strawberry scent for various personal care applications.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Fragrance Pineapple", category: "Essential Oils", uses: "A tropical pineapple fragrance for cosmetics and air fresheners.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Apple", category: "Essential Oils", uses: "A crisp and fresh apple scent for perfumes and personal care products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Apple Fizz", category: "Essential Oils", uses: "A vibrant and fizzy apple fragrance ideal for perfumes and personal care products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Apricot", category: "Essential Oils", uses: "A sweet and fruity apricot scent for cosmetics and air fresheners.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Blue Fresh", category: "Essential Oils", uses: "A clean and aquatic fragrance suitable for freshening products and perfumes.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Bubble Gum", category: "Essential Oils", uses: "A playful and sweet scent reminiscent of bubble gum.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Caramel", category: "Essential Oils", uses: "A warm and sweet caramel fragrance for personal care products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Caring Moments", category: "Essential Oils", uses: "A comforting and soft fragrance for use in cosmetics and perfumes.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Carnation", category: "Essential Oils", uses: "A floral carnation scent ideal for air fresheners and personal care products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Citrus", category: "Essential Oils", uses: "A bright and zesty citrus scent for perfumes and cleaning products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Coco Butter", category: "Essential Oils", uses: "A rich and creamy cocoa butter fragrance for skincare products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Earternal Eagle", category: "Essential Oils", uses: "A bold and majestic fragrance for high-end personal care items.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Florazol", category: "Essential Oils", uses: "A refreshing floral fragrance suitable for perfumes and cleaning products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Fresh Toilet Cleaner", category: "Essential Oils", uses: "A crisp and fresh fragrance designed for cleaning products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Intense Clean", category: "Essential Oils", uses: "A sharp and invigorating fragrance for cleaning solutions and fresheners.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Jojoba", category: "Essential Oils", uses: "A mild and nourishing jojoba fragrance for skincare and cosmetic products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Lavender", category: "Essential Oils", uses: "A calming lavender scent ideal for personal care and air fresheners.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Lemon 3", category: "Essential Oils", uses: "A bright and tangy lemon fragrance for cleaning products and cosmetics.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Mangue Vanille", category: "Essential Oils", uses: "A sweet mango and vanilla blend ideal for personal care and perfumes.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Marine Fresh", category: "Essential Oils", uses: "A refreshing marine-inspired scent perfect for cleaning products and air fresheners.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume New Car", category: "Essential Oils", uses: "A crisp, leathery scent mimicking the smell of a new car interior.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Orange", category: "Essential Oils", uses: "A juicy and zesty orange fragrance for personal care and cleaning products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Passion", category: "Essential Oils", uses: "A sultry and exotic passionfruit scent for perfumes and skincare.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Peach", category: "Essential Oils", uses: "A soft and sweet peach fragrance for air fresheners and personal care items.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Pine", category: "Essential Oils", uses: "A classic pine scent suitable for cleaning and freshening products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Pineaple NK", category: "Essential Oils", uses: "A tropical pineapple fragrance for cosmetics and household products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume PineappleStrawberry", category: "Essential Oils", uses: "A fruity blend of pineapple and strawberry for vibrant and playful scents.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Pink Breeze", category: "Essential Oils", uses: "A fresh and light pink floral fragrance for cosmetics and perfumes.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Purete", category: "Essential Oils", uses: "A pure and clean fragrance for a refreshing sensory experience.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Rose", category: "Essential Oils", uses: "A classic rose fragrance ideal for perfumes and air fresheners.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Sheer Summer", category: "Essential Oils", uses: "A breezy summer-inspired scent for vibrant perfumes and cosmetics.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Soft Peach", category: "Essential Oils", uses: "A delicate peach fragrance suitable for skincare and personal care products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Strawberry Ice Cream", category: "Essential Oils", uses: "A creamy and sweet strawberry scent for personal and household products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Stwaberry EP", category: "Essential Oils", uses: "A bright strawberry fragrance ideal for freshening and care products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Sundance", category: "Essential Oils", uses: "A sunny and uplifting fragrance for vibrant skincare and perfumes.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Sweet Lemon", category: "Essential Oils", uses: "A sweet and citrusy lemon scent for air fresheners and cosmetics.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Tropical Burst", category: "Essential Oils", uses: "A vibrant tropical mix of fruity notes for energetic personal care products.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Vanilla", category: "Essential Oils", uses: "A warm and inviting vanilla fragrance for perfumes and personal care items.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Perfume Vanilla Blossom", category: "Essential Oils", uses: "A floral and vanilla combination for elegant and sophisticated fragrances.", packaging: ["500ml", "1L", "5L"], available: 1 },
    { name: "Diethlphthalate 99%", category: "Essential Oils", uses: "A versatile plasticizer and solvent used in various industrial applications.", packaging: ["500ml", "1L", "5L"], available: 1 },

    // --- Cosmetics ---
    { name: "Castor Oil", category: "Cosmetics", uses: "Used in cosmetics, pharmaceuticals, and as a lubricant in industrial applications.", packaging: ["1kg", "5kg", "20kg", "Drum"], available: 1 },
    { name: "Ceto Stearyl Alcohol", category: "Cosmetics", uses: "Used as an emulsifying agent and thickener in creams, lotions, and cosmetic formulations.", packaging: ["Custom Packaging Available", "25kg"], available: 1 },
    { name: "Dehyquart 4046", category: "Cosmetics", uses: "Used as a conditioning agent in shampoos, hair conditioners, and other personal care products.", packaging: ["Custom Packaging Available", "20kg"], available: 1 },
    { name: "Glyccor Mono Stearic (GMS)", category: "Cosmetics", uses: "Used as an emulsifier in cosmetics, food, and pharmaceutical applications.", packaging: ["Custom Packaging Available", "20kg"], available: 1 },
    { name: "Glycerin USP Grade", category: "Cosmetics", uses: "Used in pharmaceuticals, cosmetics, food products, and as a humectant and solvent.", packaging: ["5kg", "25kg", "Drum"], available: 1 },
    { name: "Lanette Wax Ao", category: "Cosmetics", uses: "Used in cosmetic formulations as an emulsifying agent, thickener, and emollient.", packaging: ["Custom Packaging Available", "20kg"], available: 1 },
    { name: "Micro Slack Wax 160S", category: "Cosmetics", uses: "Used in the production of candles, polishes, and as a lubricant in industrial applications.", packaging: ["25kg"], available: 1 },
    { name: "Mono Propylene Glycol (MPG)", category: "Cosmetics", uses: "Used as a humectant in food, cosmetics, and pharmaceuticals, and in industrial applications.", packaging: ["5kg", "20kg"], available: 1 },
    { name: "Paraffin Wax 58/60", category: "Cosmetics", uses: "Used in the manufacture of candles, coating food products, and in cosmetics and pharmaceuticals.", packaging: ["25kg"], available: 1 },
    { name: "Stearic Acid", category: "Cosmetics", uses: "Used in the production of soaps, cosmetics, lubricants, and as a stabilizing agent in plastics.", packaging: ["25kg"], available: 1 },
    { name: "White Oil", category: "Cosmetics", uses: "Used in cosmetics, pharmaceuticals, and as a lubricant in industrial applications.", packaging: ["1kg", "5kg", "20kg", "Drum"], available: 1 },
];

// =====================
// Database Initialization
// =====================
let db;

function init() {
    db = new Database(DB_PATH);

    // Enable WAL mode for better performance
    db.pragma('journal_mode = WAL');

    // Create tables
    db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL UNIQUE,
            category    TEXT    NOT NULL,
            uses        TEXT    NOT NULL DEFAULT '',
            packaging   TEXT    NOT NULL DEFAULT '[]',
            available   INTEGER NOT NULL DEFAULT 1,
            created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
            updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
        CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
    `);

    // Seed if table is empty
    const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
    if (count.cnt === 0) {
        seedProducts();
    }

    return db;
}

function seedProducts() {
    const insert = db.prepare(
        'INSERT OR IGNORE INTO products (name, category, uses, packaging) VALUES (?, ?, ?, ?)'
    );

    const insertMany = db.transaction((products) => {
        for (const p of products) {
            insert.run(p.name, p.category, p.uses, JSON.stringify(p.packaging));
        }
    });

    insertMany(SEED_PRODUCTS);
}

// =====================
// Query Functions
// =====================

function getAll() {
    ensureInit();
    const rows = db.prepare('SELECT * FROM products WHERE available = 1 ORDER BY category, name').all();
    return rows.map(deserialize);
}

function getByCategory(category) {
    ensureInit();
    const rows = db.prepare('SELECT * FROM products WHERE category = ? AND available = 1 ORDER BY name').all(category);
    return rows.map(deserialize);
}

function getByName(name) {
    ensureInit();
    const row = db.prepare('SELECT * FROM products WHERE name = ?').get(name);
    return row ? deserialize(row) : null;
}

function getCategories() {
    ensureInit();
    return db.prepare('SELECT DISTINCT category FROM products WHERE available = 1 ORDER BY category').all().map(r => r.category);
}

function search(query, limit = 20) {
    ensureInit();
    if (!query || query.trim().length === 0) return [];

    const allProducts = getAll();

    const fuse = new Fuse(allProducts, {
        keys: ['name', 'category', 'uses'],
        threshold: 0.45,
        ignoreLocation: true,
        minMatchCharLength: 2,
    });

    return fuse.search(query.trim()).slice(0, limit).map(r => r.item);
}

function upsert(product) {
    ensureInit();
    const stmt = db.prepare(`
        INSERT INTO products (name, category, uses, packaging, available)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(name) DO UPDATE SET
            category   = excluded.category,
            uses       = excluded.uses,
            packaging  = excluded.packaging,
            available  = excluded.available,
            updated_at = datetime('now')
    `);
    return stmt.run(
        product.name,
        product.category,
        product.uses || '',
        JSON.stringify(product.packaging || []),
        product.available !== false ? 1 : 0
    );
}

function remove(name) {
    ensureInit();
    return db.prepare('UPDATE products SET available = 0 WHERE name = ?').run(name);
}

// =====================
// Helpers
// =====================
function ensureInit() {
    if (!db) init();
}

function deserialize(row) {
    return {
        id:        row.id,
        name:      row.name,
        category:  row.category,
        uses:      row.uses,
        packaging: JSON.parse(row.packaging || '[]'),
        available: row.available === 1,
    };
}

// Auto-initialize on require
init();

module.exports = { getAll, getByCategory, getByName, getCategories, search, upsert, remove, SEED_PRODUCTS };
