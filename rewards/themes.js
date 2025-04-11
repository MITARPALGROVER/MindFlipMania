// Theme configurations
const THEMES = {
    default: {
      name: "Default",
      description: "The classic MindFlip Mania theme",
      price: 0,
      background: "../home/images/theme_default.jpg",
      gameBackground: "../game/images/gamebg.jpg",
      cardColor: "#946599",
      textColor: "#ffb0a1",
      buttonColor: "#a38da6",
      emojis: ["🙈", "🐼", "🦁", "🐶", "🐮", "🐸", "🐱", "🐭", "🐰", "🦊", "🐻", "🐨"],
    },
    space: {
      name: "Space",
      description: "Explore the galaxy with this space theme!",
      price: 100,
      background: "../rewards/images/space.webp",
      gameBackground: "../rewards/images/space-game.webp",
      cardColor: "#5d6e82",
      textColor: "#fef9ed",
      buttonColor: "#bd9c8e",
      emojis: ["🚀", "🛸", "🌠", "🌌", "🪐", "👽", "🌕", "🌑", "☄️", "🌟", "👨‍🚀", "🛰️"],
    },
    underwater: {
      name: "Underwater",
      description: "Dive into the ocean with this underwater theme!",
      price: 150,
      background: "../rewards/images/underwater.webp",
      gameBackground: "../rewards/images/underwater-game.webp",
      cardColor: "#0277bd",
      textColor: "#b3e5fc",
      buttonColor: "#74a376",
      emojis: ["🐠", "🐙", "🐬", "🐋", "🦈", "🐡", "🦑", "🐚", "🧜‍♀️", "🐟", "🦐", "🦞"],
    },
    jungle: {
      name: "Jungle",
      description: "Experience the wild with this jungle theme!",
      price: 200,
      background: "../rewards/images/jungle.webp",
      gameBackground: "../rewards/images/jungle-game.webp",
      cardColor: "#2e7d32",
      textColor: "#c8e6c9",
      buttonColor: "#74a376",
      emojis: ["🐒", "🦁", "🐯", "🐘", "🦓", "🦒", "🦏", "🐊", "🦍", "🦜", "🦚", "🐍"],
    },
    desert: {
      name: "Desert",
      description: "Feel the heat with this desert theme!",
      price: 250,
      background: "../rewards/images/desert.webp",
      gameBackground: "../rewards/images/desert-game.webp",
      cardColor: "#845d4f",
    textColor: "#f2c693",
    buttonColor: "#877068",
      emojis: ["🏜️", "🌵", "🐪", "🦂", "🦎", "🐍", "🌞", "🔥", "⛺", "🧿", "🕌", "🧩"],
    },
    city: {
      name: "City",
      description: "Explore the urban jungle with this city theme!",
      price: 300,
      background: "../rewards/images/city.webp",
      gameBackground: "../rewards/images/city-game.webp",
      cardColor: "#37474f",
      textColor: "#cfd8dc",
      buttonColor: "#90a4ae",
      emojis: ["🏙️", "🚗", "🚕", "🚌", "🏢", "🚇", "🚦", "🚲", "🛴", "🏭", "🌃", "🌉"],
    },
    fantasy: {
      name: "Fantasy",
      description: "Enter a magical world with this fantasy theme!",
      price: 350,
      background: "../rewards/images/fantacy.webp",
      gameBackground: "../rewards/images/fantacy-game.webp",
      cardColor: "#417390",
    textColor: "#f8d5a1",
    buttonColor: "#6a8594", 
      emojis: ["🧙‍♂️", "🧝‍♀️", "🧚‍♂️", "🐉", "🦄", "🏰", "⚔️", "🛡️", "🧪", "🔮", "📜", "💎"],
    },
    winter: {
      name: "Winter",
      description: "Chill out with the frosty vibes of the Winter wonderland theme!",
      price: 400,
      background: "../rewards/images/winter.webp",
      gameBackground: "../rewards/images/winter-game.webp",
      cardColor: "#90caf9",
      textColor: "#ffffff",
      buttonColor: "#64b5f6",
      emojis: ["❄️", "☃️", "🌨️", "⛷️", "🏂", "🧤", "🧣", "🌬️", "🦌", "🎿", "🌁", "🥶"],
    },
    cyberpunk: {
      name: "Cyberpunk",
      description: "Dive into a neon-lit futuristic world of tech and thrill!",
      price: 500,
      background: "../rewards/images/cyberpunk.webp",
      gameBackground: "../rewards/images/cyberpunk-game.webp",
      cardColor: "#d87697",
    textColor: "#75d4d0",
    buttonColor: "#ab8491", 
      emojis: ["🤖", "💾", "🕶️", "🧬", "💡", "🌃", "🛸", "🚨", "📟", "🕹️", "📡", "⚡"],
    },
    
    
    
  }
  
  // Get theme data
  function getThemeData(themeName) {
    return THEMES[themeName] || THEMES.default
  }
  
  // Get all themes
  function getAllThemes() {
    return THEMES
  }
  
  // Apply theme to page
  function applyTheme(themeName) {
    const theme = getThemeData(themeName)
  
    // Apply background
    document.body.style.backgroundImage = `url('${theme.background}')`
  
    // Apply other theme styles via CSS variables
    document.documentElement.style.setProperty("--primary-color", theme.cardColor)
    document.documentElement.style.setProperty("--text-color", theme.textColor)
    document.documentElement.style.setProperty("--button-color", theme.buttonColor)
  
    // Store active theme in localStorage
    localStorage.setItem("activeTheme", themeName)
  
    return theme
  }
  
  // Get active theme
  function getActiveTheme() {
    return localStorage.getItem("activeTheme") || "default"
  }
  
  // Check if theme is purchased
  function isThemePurchased(themeName, userThemes) {
    if (!userThemes || !userThemes.themes) return themeName === "default"
  
    const theme = userThemes.themes.find((t) => t.name === themeName)
    return theme && theme.purchased
  }
  
  // Export functions
  window.themeManager = {
    getThemeData,
    getAllThemes,
    applyTheme,
    getActiveTheme,
    isThemePurchased,
  }
  