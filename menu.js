document.addEventListener("DOMContentLoaded", () => {
  const translations = {
    sq: {
      "nav.home": "Kreu",
      "nav.location": "Vendndodhja",
      "nav.call": "Telefono",
      "hero.menuTitle": "Menuja Jonë",
      "hero.eyebrow": "Menu Vale Beach Bar",
      "hero.heroCopy":
        "Kafe, kokteje, pica, deti dhe shije të freskëta plazhi të dizajnuara për ndriçimin dhe qetësinë e detit Adriatik.",
      "footer.line": "Shfleto, skano dhe shijo Valé.",

      "tabs.tabCoffee": "Kafe & Freskuese",
      "tabs.tabBeer": "Birra",
      "tabs.tabCocktails": "Kokteje",
      "tabs.tabSpirits": "Pije Alkoolike",
      "tabs.tabWine": "Verë",
      "tabs.tabSalads": "Sallatë & Shoqëruese",
      "tabs.tabSeafood": "Deti",
      "tabs.tabChicken": "Pula",
      "tabs.tabPizza": "Pizza",
      "tabs.tabSandwiches": "Sanduiçe",
      "tabs.tabBreakfast": "Mëngjesi",

      "items.itemCoffee": "Kafe",
      "items.itemFreddoCoffee": "Kafe Fredo",
      "items.itemIcedCocoa": "Kakao e Ftohtë",
      "items.itemSmallCocoa": "Kakao e Vogël",
      "items.itemIcedCappuccino": "Kapuçhino e Ftohtë",
      "items.itemCappuccino": "Kapuçhino Kafe",
      "items.itemCappuccinoSachet": "Kapuçino me Bustinë",
      "items.itemMacchiato": "Makiato",
      "items.itemDecaf": "Dekafeinato",
      "items.itemFrappe": "Frape",
      "items.itemMilkGlass": "Gotë Qumësht",
      "items.itemIcedChocolate": "Çokollatë e Ftohtë",
      "items.itemB52": "B52",
      "items.item1VI": "1VI",
      "items.itemBravoJuices": "Bravo Pjeshkë / Mollë / Rrushi / Luleshtrydhe",
      "items.itemAmitaJuices": "AmiTa Qershi / Mollë / Banane",
      "items.itemCocaCola": "Coca Cola",
      "items.itemCrodino": "Crodino",
      "items.itemFanta": "Fanta Portokall / Exo",
      "items.itemNescafeCan": "Nescafe Kanace",
      "items.itemLemonOrangeSoda": "Lemon / Orange Soda",
      "items.itemIceTea": "Ice Tea Pjeshkë / Limon",
      "items.itemPepsi": "Pepsi",
      "items.itemRedBull": "Red Bull",
      "items.itemSprite": "Sprite",
      "items.itemSchweppes": "Schweppes",
      "items.itemWaterSparkling": "Ujë / Ujë i Gazuar",
      "items.itemVitaminWater": "Ujë Vitamin Tepelena",

      "items.itemCorona": "Corona",
      "items.itemPeroni": "Peroni",
      "items.itemHeineken": "Heineken",
      "items.itemPaulaner": "Paulaner",
      "items.itemKorca": "Korça",

      "items.itemGinLemonTonic": "Gin Lemon / Tonic",
      "items.itemJagerRedbull": "Jager Redbull",
      "items.itemNegroni": "Negroni",
      "items.itemNonAlcoholic": "Analkolik",
      "items.itemVodkaLemon": "Vodka Lemon",
      "items.itemVodkaRedbull": "Vodka Redbull",
      "items.itemVodkaSour": "Vodka Sour",
      "items.itemBasilSmash": "Basil Smash",
      "items.itemWhiskeySour": "Whiskey Sour",
      "items.itemGinSour": "Gin Sour",
      "items.itemMojito": "Mojito",
      "items.itemEspressoMartini": "Espresso Martini",
      "items.itemAperolSpritz": "Aperol Spritz",
      "items.itemMargarita": "Margarita",
      "items.itemPinaColada": "Pina Colada",
      "items.itemCubaLibre": "Cuba Libre",
      "items.itemTequilaSunrise": "Tequila Sunrise",
      "items.itemPassionFruitMojito": "Passion Fruit Mojito",
      "items.itemSunsetAtVale": "Sunset at Valé",
      "items.itemSummerEcho": "Summer Echo",
      "items.itemBlackWhiteRussian": "Black / White Russian",

      "items.itemDictador12": "Dictador 12",
      "items.itemDiplomatico": "Diplomatico",
      "items.itemDisaronno": "Disaronno",
      "items.itemGinMare": "Gin Mare",
      "items.itemJackGentleman": "Jack Gentleman",
      "items.itemJagermeister": "Jagermeister",
      "items.itemMolinariSambuca": "Molinari Sambuca",
      "items.itemUzo": "Uzo",
      "items.itemVodkaBelvedere": "Vodka Belvedere",
      "items.itemChivasRegal": "Chivas Regal",
      "items.itemCourvoisier": "Courvoisier",
      "items.itemFernetBranca": "Fernet Branca",
      "items.itemJackDaniels": "Jack Daniels",
      "items.itemGinHendricks": "Gin Hendricks",

      "items.itemWineGlass": "Gotë Verë",
      "items.itemProseccoGlassBottle": "Gotë / Shishe Prosecco",
      "items.itemChardonnay": "Chardonnay",
      "items.itemPinotGrigio": "Pinot Grigio",
      "items.itemGrecoDiTufo": "Greco di Tufo",
      "items.itemGewurztraminer": "Gewürztraminer",

      "items.itemGreekSalad": "Sallatë Greke",
      "items.itemGreenSalad": "Sallatë Jeshile",
      "items.itemOlivesLemon": "Ullinj, Limon",
      "items.itemWatermelonCheeseMint": "Shalqi dhe Djathë dhe Mente",
      "items.itemWhiteCheese": "Djathë i Bardhë",
      "items.itemGrilledVegetables": "Perime Zgare",
      "items.itemFrenchFries": "French Fries",

      "items.itemGrilledSeaBream": "Koçë Zgare",
      "items.itemGrilledSeaBass": "Levrek Zgare",
      "items.itemSeafoodMixSmall": "Mix Deti Zgare (i vogël)",
      "items.itemSeafoodMixLarge": "Mix Deti Zgare (i madh)",
      "items.itemGrilledShrimp": "Karkalec Zgare",
      "items.itemGrilledCalamari": "Kallamar Zgare",
      "items.itemCrabMeatballs": "Qofte Gaforre",
      "items.itemMarinatedAnchovies": "Acuge të Marinuara",
    },

    en: {
      "nav.home": "Home",
      "nav.location": "Location",
      "nav.call": "Call",
      "hero.menuTitle": "Our Menu",
      "hero.eyebrow": "Vale Beach Bar Menu",
      "hero.heroCopy":
        "Coffee, cocktails, pizza, seafood, and beachside bites crafted to match the light and calm of the Adriatic coast.",
      "footer.line": "Explore, scan, and enjoy Valé.",

      "tabs.tabCoffee": "Coffee & Refreshments",
      "tabs.tabBeer": "Beer",
      "tabs.tabCocktails": "Cocktails",
      "tabs.tabSpirits": "Spirits",
      "tabs.tabWine": "Wine",
      "tabs.tabSalads": "Salads & Sides",
      "tabs.tabSeafood": "Seafood",
      "tabs.tabChicken": "Chicken",
      "tabs.tabPizza": "Pizza",
      "tabs.tabSandwiches": "Sandwiches",
      "tabs.tabBreakfast": "Breakfast",

      "items.itemCoffee": "Coffee",
      "items.itemFreddoCoffee": "Freddo Coffee",
      "items.itemIcedCocoa": "Iced Cocoa",
      "items.itemSmallCocoa": "Small Cocoa",
      "items.itemIcedCappuccino": "Iced Cappuccino",
      "items.itemCappuccino": "Cappuccino",
      "items.itemCappuccinoSachet": "Cappuccino with Sachet",
      "items.itemMacchiato": "Macchiato",
      "items.itemDecaf": "Decaf Coffee",
      "items.itemFrappe": "Frappe",
      "items.itemMilkGlass": "Glass of Milk",
      "items.itemIcedChocolate": "Iced Chocolate",
      "items.itemB52": "B52",
      "items.item1VI": "1VI",
      "items.itemBravoJuices": "Bravo Peach / Apple / Grape / Strawberry",
      "items.itemAmitaJuices": "AmiTa Cherry / Apple / Banana",
      "items.itemCocaCola": "Coca Cola",
      "items.itemCrodino": "Crodino",
      "items.itemFanta": "Fanta Orange / Exotic",
      "items.itemNescafeCan": "Nescafe Can",
      "items.itemLemonOrangeSoda": "Lemon / Orange Soda",
      "items.itemIceTea": "Iced Tea Peach / Lemon",
      "items.itemPepsi": "Pepsi",
      "items.itemRedBull": "Red Bull",
      "items.itemSprite": "Sprite",
      "items.itemSchweppes": "Schweppes",
      "items.itemWaterSparkling": "Water / Sparkling Water",
      "items.itemVitaminWater": "Vitamin Water Tepelena",

      "items.itemCorona": "Corona",
      "items.itemPeroni": "Peroni",
      "items.itemHeineken": "Heineken",
      "items.itemPaulaner": "Paulaner",
      "items.itemKorca": "Korça Beer",

      "items.itemGinLemonTonic": "Gin Lemon / Tonic",
      "items.itemJagerRedbull": "Jager Red Bull",
      "items.itemNegroni": "Negroni",
      "items.itemNonAlcoholic": "Non-Alcoholic Cocktail",
      "items.itemVodkaLemon": "Vodka Lemon",
      "items.itemVodkaRedbull": "Vodka Red Bull",
      "items.itemVodkaSour": "Vodka Sour",
      "items.itemBasilSmash": "Basil Smash",
      "items.itemWhiskeySour": "Whiskey Sour",
      "items.itemGinSour": "Gin Sour",
      "items.itemMojito": "Mojito",
      "items.itemEspressoMartini": "Espresso Martini",
      "items.itemAperolSpritz": "Aperol Spritz",
      "items.itemMargarita": "Margarita",
      "items.itemPinaColada": "Pina Colada",
      "items.itemCubaLibre": "Cuba Libre",
      "items.itemTequilaSunrise": "Tequila Sunrise",
      "items.itemPassionFruitMojito": "Passion Fruit Mojito",
      "items.itemSunsetAtVale": "Sunset at Valé",
      "items.itemSummerEcho": "Summer Echo",
      "items.itemBlackWhiteRussian": "Black / White Russian",

      "items.itemDictador12": "Dictador 12",
      "items.itemDiplomatico": "Diplomatico",
      "items.itemDisaronno": "Disaronno",
      "items.itemGinMare": "Gin Mare",
      "items.itemJackGentleman": "Jack Gentleman",
      "items.itemJagermeister": "Jagermeister",
      "items.itemMolinariSambuca": "Molinari Sambuca",
      "items.itemUzo": "Ouzo",
      "items.itemVodkaBelvedere": "Vodka Belvedere",
      "items.itemChivasRegal": "Chivas Regal",
      "items.itemCourvoisier": "Courvoisier",
      "items.itemFernetBranca": "Fernet Branca",
      "items.itemJackDaniels": "Jack Daniels",
      "items.itemGinHendricks": "Gin Hendrick's",

      "items.itemWineGlass": "Glass of Wine",
      "items.itemProseccoGlassBottle": "Glass / Bottle of Prosecco",
      "items.itemChardonnay": "Chardonnay",
      "items.itemPinotGrigio": "Pinot Grigio",
      "items.itemGrecoDiTufo": "Greco di Tufo",
      "items.itemGewurztraminer": "Gewürztraminer",

      "items.itemGreekSalad": "Greek Salad",
      "items.itemGreenSalad": "Green Salad",
      "items.itemOlivesLemon": "Olives, Lemon",
      "items.itemWatermelonCheeseMint": "Watermelon, Cheese and Mint",
      "items.itemWhiteCheese": "White Cheese",
      "items.itemGrilledVegetables": "Grilled Vegetables",
      "items.itemFrenchFries": "French Fries",

      "items.itemGrilledSeaBream": "Grilled Sea Bream",
      "items.itemGrilledSeaBass": "Grilled Sea Bass",
      "items.itemSeafoodMixSmall": "Grilled Seafood Mix (small)",
      "items.itemSeafoodMixLarge": "Grilled Seafood Mix (large)",
      "items.itemGrilledShrimp": "Grilled Shrimp",
      "items.itemGrilledCalamari": "Grilled Calamari",
      "items.itemCrabMeatballs": "Crab Meatballs",
      "items.itemMarinatedAnchovies": "Marinated Anchovies",
    },

    it: {
      "nav.home": "Home",
      "nav.location": "Posizione",
      "nav.call": "Chiama",
      "hero.menuTitle": "Il Nostro Menu",
      "hero.eyebrow": "Menu Vale Beach Bar",
      "hero.heroCopy":
        "Caffè, cocktail, pizza, frutti di mare e sapori da spiaggia pensati per accompagnare la luce e la calma della costa adriatica.",
      "footer.line": "Scopri, scansiona e goditi Valé.",

      "tabs.tabCoffee": "Caffè & Bevande Fresche",
      "tabs.tabBeer": "Birra",
      "tabs.tabCocktails": "Cocktail",
      "tabs.tabSpirits": "Alcolici",
      "tabs.tabWine": "Vino",
      "tabs.tabSalads": "Insalate & Contorni",
      "tabs.tabSeafood": "Mare",
      "tabs.tabChicken": "Pollo",
      "tabs.tabPizza": "Pizza",
      "tabs.tabSandwiches": "Panini",
      "tabs.tabBreakfast": "Colazione",

      "items.itemCoffee": "Caffè",
      "items.itemFreddoCoffee": "Caffè Freddo",
      "items.itemIcedCocoa": "Cacao Freddo",
      "items.itemSmallCocoa": "Cacao Piccolo",
      "items.itemIcedCappuccino": "Cappuccino Freddo",
      "items.itemCappuccino": "Cappuccino",
      "items.itemCappuccinoSachet": "Cappuccino con Bustina",
      "items.itemMacchiato": "Macchiato",
      "items.itemDecaf": "Decaffeinato",
      "items.itemFrappe": "Frappè",
      "items.itemMilkGlass": "Bicchiere di Latte",
      "items.itemIcedChocolate": "Cioccolata Fredda",
      "items.itemB52": "B52",
      "items.item1VI": "1VI",
      "items.itemBravoJuices": "Bravo Pesca / Mela / Uva / Fragola",
      "items.itemAmitaJuices": "AmiTa Ciliegia / Mela / Banana",
      "items.itemCocaCola": "Coca Cola",
      "items.itemCrodino": "Crodino",
      "items.itemFanta": "Fanta Arancia / Exotic",
      "items.itemNescafeCan": "Nescafe in Lattina",
      "items.itemLemonOrangeSoda": "Soda Limone / Arancia",
      "items.itemIceTea": "Tè Freddo Pesca / Limone",
      "items.itemPepsi": "Pepsi",
      "items.itemRedBull": "Red Bull",
      "items.itemSprite": "Sprite",
      "items.itemSchweppes": "Schweppes",
      "items.itemWaterSparkling": "Acqua / Acqua Frizzante",
      "items.itemVitaminWater": "Acqua Vitaminica Tepelena",

      "items.itemCorona": "Corona",
      "items.itemPeroni": "Peroni",
      "items.itemHeineken": "Heineken",
      "items.itemPaulaner": "Paulaner",
      "items.itemKorca": "Birra Korça",

      "items.itemGinLemonTonic": "Gin Lemon / Tonic",
      "items.itemJagerRedbull": "Jager Red Bull",
      "items.itemNegroni": "Negroni",
      "items.itemNonAlcoholic": "Cocktail Analcolico",
      "items.itemVodkaLemon": "Vodka Lemon",
      "items.itemVodkaRedbull": "Vodka Red Bull",
      "items.itemVodkaSour": "Vodka Sour",
      "items.itemBasilSmash": "Basil Smash",
      "items.itemWhiskeySour": "Whiskey Sour",
      "items.itemGinSour": "Gin Sour",
      "items.itemMojito": "Mojito",
      "items.itemEspressoMartini": "Espresso Martini",
      "items.itemAperolSpritz": "Aperol Spritz",
      "items.itemMargarita": "Margarita",
      "items.itemPinaColada": "Pina Colada",
      "items.itemCubaLibre": "Cuba Libre",
      "items.itemTequilaSunrise": "Tequila Sunrise",
      "items.itemPassionFruitMojito": "Mojito al Frutto della Passione",
      "items.itemSunsetAtVale": "Sunset at Valé",
      "items.itemSummerEcho": "Summer Echo",
      "items.itemBlackWhiteRussian": "Black / White Russian",

      "items.itemDictador12": "Dictador 12",
      "items.itemDiplomatico": "Diplomatico",
      "items.itemDisaronno": "Disaronno",
      "items.itemGinMare": "Gin Mare",
      "items.itemJackGentleman": "Jack Gentleman",
      "items.itemJagermeister": "Jagermeister",
      "items.itemMolinariSambuca": "Molinari Sambuca",
      "items.itemUzo": "Ouzo",
      "items.itemVodkaBelvedere": "Vodka Belvedere",
      "items.itemChivasRegal": "Chivas Regal",
      "items.itemCourvoisier": "Courvoisier",
      "items.itemFernetBranca": "Fernet Branca",
      "items.itemJackDaniels": "Jack Daniels",
      "items.itemGinHendricks": "Gin Hendrick's",

      "items.itemWineGlass": "Calice di Vino",
      "items.itemProseccoGlassBottle": "Calice / Bottiglia di Prosecco",
      "items.itemChardonnay": "Chardonnay",
      "items.itemPinotGrigio": "Pinot Grigio",
      "items.itemGrecoDiTufo": "Greco di Tufo",
      "items.itemGewurztraminer": "Gewürztraminer",

      "items.itemGreekSalad": "Insalata Greca",
      "items.itemGreenSalad": "Insalata Verde",
      "items.itemOlivesLemon": "Olive, Limone",
      "items.itemWatermelonCheeseMint": "Anguria, Formaggio e Menta",
      "items.itemWhiteCheese": "Formaggio Bianco",
      "items.itemGrilledVegetables": "Verdure alla Griglia",
      "items.itemFrenchFries": "Patatine Fritte",

      "items.itemGrilledSeaBream": "Orata alla Griglia",
      "items.itemGrilledSeaBass": "Branzino alla Griglia",
      "items.itemSeafoodMixSmall": "Grigliata Mista di Mare (piccola)",
      "items.itemSeafoodMixLarge": "Grigliata Mista di Mare (grande)",
      "items.itemGrilledShrimp": "Gamberi alla Griglia",
      "items.itemGrilledCalamari": "Calamari alla Griglia",
      "items.itemCrabMeatballs": "Polpette di Granchio",
      "items.itemMarinatedAnchovies": "Alici Marinate",
    },
  };

  const DEFAULT_LANG = "sq";

  const applyTranslations = (lang) => {
    const map = translations[lang] || translations[DEFAULT_LANG];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (key && map[key]) {
        el.textContent = map[key];
      }
    });
  };

  const tabs = document.querySelectorAll(".category-tabs .tab");
  const sections = Array.from(tabs).map((tab) =>
    document.getElementById(tab.dataset.target)
  );

  const headerElement = document.querySelector(".menu-header");
  const getHeaderOffset = () => (headerElement?.offsetHeight || 0) + 12;

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const smoothScrollToSection = (target, duration = 700) => {
    const start = window.scrollY;
    const targetRect = target.getBoundingClientRect();
    const offset = getHeaderOffset();
    const targetPosition = targetRect.top + window.scrollY - offset;
    const distance = targetPosition - start;
    if (distance === 0) return;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      window.scrollTo(0, start + distance * ease);
      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.target);
      if (target) {
        smoothScrollToSection(target);
      }
    });
  });
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const tab = Array.from(tabs).find(
          (item) => item.dataset.target === entry.target.id
        );
        if (entry.isIntersecting) {
          tabs.forEach((item) => item.classList.remove("active"));
          tab?.classList.add("active");
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach((section) => {
    if (section) observer.observe(section);
  });

  const langButtons = document.querySelectorAll(".lang-btn");
  const storedLang = localStorage.getItem("valeMenuLanguage");
  const langToUse =
    storedLang && ["sq", "en", "it"].includes(storedLang)
      ? storedLang
      : DEFAULT_LANG;

  applyTranslations(langToUse);

  const activeBtn = Array.from(langButtons).find(
    (btn) => btn.dataset.lang === langToUse
  );
  if (activeBtn) {
    langButtons.forEach((btn) => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  }

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      langButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const lang = button.dataset.lang;
      if (lang) {
        localStorage.setItem("valeMenuLanguage", lang);
        applyTranslations(lang);
      }
    });
  });
});

