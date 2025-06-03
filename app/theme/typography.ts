// TODO: write documentation about fonts and typography along with guides on how to add custom fonts in own
// markdown file and add links from here

import { Platform } from "react-native";

import {
  NotoSansJP_300Light as notoSansJPLight,
  NotoSansJP_400Regular as notoSansJPRegular,
  NotoSansJP_500Medium as notoSansJPMedium,
  NotoSansJP_600SemiBold as notoSansJPSemiBold,
  NotoSansJP_700Bold as notoSansJPBold,
} from "@expo-google-fonts/noto-sans-jp";

export const customFontsToLoad = {
  notoSansJPLight,
  notoSansJPRegular,
  notoSansJPMedium,
  notoSansJPSemiBold,
  notoSansJPBold,
};

const fonts = {
  notoSansJP: {
    // Cross-platform Google font.
    light: "notoSansJPLight",
    normal: "notoSansJPRegular",
    medium: "notoSansJPMedium",
    semiBold: "notoSansJPSemiBold",
    bold: "notoSansJPBold",
  },
  helveticaNeue: {
    // iOS only font.
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    // iOS only font.
    normal: "Courier",
  },
  sansSerif: {
    // Android only font.
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    // Android only font.
    normal: "monospace",
  },
};

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.notoSansJP,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
};
