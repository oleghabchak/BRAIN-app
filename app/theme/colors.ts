const palette = {
  neutral50: '#FFFFFF',
  neutral100: '#F8F9FE',
  neutral200: '#E5E6EE',
  neutral300: '#D4D6DD',
  neutral400: '#C5C6CC',
  neutral500: '#C3C5D2',
  neutral600: '#898D9E',
  neutral700: '#494A50',
  neutral800: '#2F3036',
  neutral900: '#1F2024',

  primary50: '#EBF0FF',
  primary100: '#E1E8FE',
  primary200: '#CFD9FC',
  primary300: '#9EB3FA',
  primary400: '#6E8EF7',
  primary500: '#585CE5',
  primary600: '#3356CC',
  primary700: '#2945A3',
  primary800: '#263873',
  primary900: '#1F2847',

  secondary100: '#DCDDE9',
  secondary200: '#BCC0D6',
  secondary300: '#9196B9',
  secondary400: '#626894',
  secondary500: '#41476E',

  accent100: '#FFEED4',
  accent200: '#FFE1B2',
  accent300: '#FDD495',
  accent400: '#FBC878',
  accent500: '#FFBB50',

  error_light: '#FFE2E5',
  error_medium: '#FF616D',
  error_dark: '#ED3241',

  success_light: '#E7F4E8',
  success_medium: '#3AC0A0',
  success_dark: '#298267',

  green50: '#E1FEF0',
  green100: '#CFFCE5',
  green200: '#9EFACC',
  green300: '#6EF7B2',
  green400: '#10D48E',
  green500: '#47EB99',
  green600: '#33CC7F',
  green700: '#29A366',
  green800: '#26734C',
  green900: '#1F4733',

  overlay20: 'rgba(25, 16, 21, 0.2)',
  overlay50: 'rgba(25, 16, 21, 0.5)',
} as const;

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: 'rgba(0, 0, 0, 0)',
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral100,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.error_medium,
  /**
   * Error Background.
   */
  errorBackground: palette.error_light,
} as const;
