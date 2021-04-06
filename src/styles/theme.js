import { extendTheme } from "@chakra-ui/react"

let config = {
  initialColorMode: "light",
  useSystemColorMode: true,
  mode: {
    light: {
      logo: "#102a43",
      background: "#fff",
      cardBG: "#EFF2FB",
      text: "#334E68",
      heading: "#102a43",
      icon: "#9FB3C8",
      link: "#9F00FF",
    },
    dark: {
      logo: "#ffffff",
      background: "#102a43",
      cardBG: "#243B53",
      text: "#EFF2FB",
      heading: "#fff",
      icon: "#486581",
      link: "#F8CCFF",
    },
  },
  colors: {
    brand: {
      700: "#3A394B",
      800: "#222138",
      900: "#1A192B",
    },
  }
}

const theme = extendTheme(config);

export default theme;
