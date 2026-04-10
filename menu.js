document.addEventListener("DOMContentLoaded", () => {
  const translations = {
    sq: {
      "nav.home": "Kreu",
      "nav.location": "Vendndodhja",
      "nav.call": "Telefono",
      "hero.menuTitle": "Menuja Jonë",
      "hero.eyebrow": "Menu Vale Beach Bar",
      "hero.heroCopy": "Zbulo menunë e Vale Beach Bar në Zvërnec, Vlorë — kafe, cocktails, pizza, specialitete deti, breakfast, waffle dhe beach bites të shërbyera shpejt dhe me shije.",
      "footer.line": "Shfleto, skano dhe shijo Vale.",
      "tabs.kafeteria": "Kafeteria",
      "tabs.freskuese": "Freskuese",
      "tabs.birra": "Birra",
      "tabs.cocktails": "Cocktails",
      "tabs.spirits": "Pije Alkoolike",
      "tabs.wine": "Verë",
      "tabs.salads": "Sallatë & Shoqëruese",
      "tabs.seafood": "Specialitete Deti",
      "tabs.chicken": "Pulë & Grill",
      "tabs.pizza": "Pizza",
      "tabs.streetfood": "Street Food & Quick Bites",
      "tabs.breakfast": "Mëngjesi",
      "tabs.waffle": "Waffle",
      "tabs.burger": "Burger",
      "tabs.share": "Për të Gjithë Ne"
    },
    en: {
      "nav.home": "Home",
      "nav.location": "Location",
      "nav.call": "Call",
      "hero.menuTitle": "Our Menu",
      "hero.eyebrow": "Vale Beach Bar Menu",
      "hero.heroCopy": "Explore the Vale Beach Bar menu in Zvernec, Vlore — coffee, cocktails, pizza, seafood, breakfast, waffles, and beach bites served quickly and with flavor.",
      "footer.line": "Browse, scan, and enjoy Vale.",
      "tabs.kafeteria": "Coffee Bar",
      "tabs.freskuese": "Soft Drinks",
      "tabs.birra": "Beer",
      "tabs.cocktails": "Cocktails",
      "tabs.spirits": "Spirits",
      "tabs.wine": "Wine",
      "tabs.salads": "Salads & Sides",
      "tabs.seafood": "Seafood Specials",
      "tabs.chicken": "Chicken & Grill",
      "tabs.pizza": "Pizza",
      "tabs.streetfood": "Street Food & Quick Bites",
      "tabs.breakfast": "Breakfast",
      "tabs.waffle": "Waffle",
      "tabs.burger": "Burger",
      "tabs.share": "For Sharing"
    },
    it: {
      "nav.home": "Home",
      "nav.location": "Posizione",
      "nav.call": "Chiama",
      "hero.menuTitle": "Il Nostro Menu",
      "hero.eyebrow": "Menu Vale Beach Bar",
      "hero.heroCopy": "Scopri il menu di Vale Beach Bar a Zvërnec, Valona — caffè, cocktail, pizza, specialità di mare, colazione, waffle e beach bites serviti in modo veloce e gustoso.",
      "footer.line": "Sfoglia, scansiona e goditi Vale.",
      "tabs.kafeteria": "Caffetteria",
      "tabs.freskuese": "Bibite",
      "tabs.birra": "Birra",
      "tabs.cocktails": "Cocktail",
      "tabs.spirits": "Alcolici",
      "tabs.wine": "Vino",
      "tabs.salads": "Insalate & Contorni",
      "tabs.seafood": "Specialità di Mare",
      "tabs.chicken": "Pollo & Grill",
      "tabs.pizza": "Pizza",
      "tabs.streetfood": "Street Food & Quick Bites",
      "tabs.breakfast": "Colazione",
      "tabs.waffle": "Waffle",
      "tabs.burger": "Burger",
      "tabs.share": "Per Tutti"
    }
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
  const sections = Array.from(tabs).map((tab) => document.getElementById(tab.dataset.target));
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
      if (elapsed < duration) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.target);
      if (target) smoothScrollToSection(target);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const tab = Array.from(tabs).find((item) => item.dataset.target === entry.target.id);
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
    storedLang && ["sq", "en", "it"].includes(storedLang) ? storedLang : DEFAULT_LANG;

  applyTranslations(langToUse);

  const activeBtn = Array.from(langButtons).find((btn) => btn.dataset.lang === langToUse);
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