/**
 * Color System for EVShare Application
 * 
 * This file defines a consistent color palette for the entire application.
 * All colors should be referenced from here to maintain consistency.
 */

export const colors = {
  // Primary Brand Colors (EV Theme - Electric Green/Cyan)
  primary: {
    50: '#ecfdf5',   // Lightest
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',  // Main primary (emerald-400)
    500: '#1CC29F',  // Brand color (ev)
    600: '#17a984',  // Used in buttons
    700: '#059669',
    800: '#047857',
    900: '#064e3b',  // Darkest
  },

  // Secondary Colors (Cyan/Blue for gradients)
  secondary: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',  // cyan-400
    500: '#06b6d4',  // cyan-500
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },

  // Accent Colors (Sky/Indigo for depth)
  accent: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',  // sky-400
    500: '#0ea5e9',  // sky-500
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Indigo for gradients
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',  // indigo-500
    600: '#4f46e5',  // indigo-600
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // Semantic Colors
  success: {
    light: '#d1fae5',
    DEFAULT: '#10b981',  // green-500
    dark: '#059669',
  },
  
  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',  // red-500
    dark: '#dc2626',
  },
  
  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',  // amber-500
    dark: '#d97706',
  },
  
  info: {
    light: '#dbeafe',
    DEFAULT: '#3b82f6',  // blue-500
    dark: '#2563eb',
  },

  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Background Gradients (Predefined)
  gradients: {
    primary: 'from-emerald-400 via-cyan-500 to-indigo-600',
    primaryReverse: 'from-indigo-600 via-cyan-500 to-emerald-400',
    secondary: 'from-cyan-300 via-blue-400 to-indigo-600',
    light: 'from-cyan-50 via-blue-50 to-indigo-50',
    dark: 'from-emerald-600 via-cyan-700 to-indigo-800',
    button: 'from-emerald-400 to-cyan-500',
    buttonHover: 'from-emerald-300 to-cyan-400',
    card: 'from-white/10 to-white/5',
  },
} as const

/**
 * Get gradient classes for Tailwind
 */
export const getGradient = (gradientName: keyof typeof colors.gradients) => {
  return `bg-gradient-to-br ${colors.gradients[gradientName]}`
}

/**
 * Common color combinations for components
 */
export const componentColors = {
  button: {
    primary: 'bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400',
    secondary: 'bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400',
    danger: 'bg-red-500 hover:bg-red-600',
    outline: 'border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white',
  },
  
  card: {
    default: 'bg-white/10 backdrop-blur-xl border-white/40',
    elevated: 'bg-white shadow-xl',
    gradient: 'bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl',
  },
  
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    muted: 'text-gray-500',
    inverse: 'text-white',
    brand: 'text-emerald-600',
  },
} as const

