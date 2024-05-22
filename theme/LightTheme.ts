import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const BlueTheme: ThemeTypes = {
    name: 'BlueTheme',
    dark: false,
    variables: {
        'border-color': '#eeeeee',
        'carousel-control-size': 10
    },
    colors: {
        primary: '#3D80CC',
        secondary: '#3D80A0',
        info: '#3D80B6',
        success: '#3DCCB7',
        accent: '#FFAB91',
        warning: '#FFAE1F',
        error: '#FA896B',
        muted: '#4D6A85',
        lightprimary: '#DCE7F7',
        lightsecondary: '#DAE7F3',
        lightsuccess: '#D9F2F1',
        lighterror: '#FACDD3',
        lightwarning: '#FADFCA',
        textPrimary: '#2A3547',
        textSecondary: '#2A3547',
        borderColor: '#e5eaef',
        inputBorder: '#000',
        containerBg: '#ffffff',
        hoverColor: '#f6f9fc',
        surface: '#fff',
        'on-surface-variant': '#fff',
        grey100: '#F2F6FA',
        grey200: '#EAEFF4'
      }
};
export { BlueTheme};
