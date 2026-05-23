---
name: Lumina System
colors:
  surface: '#fff8f2'
  surface-dim: '#e5d8c6'
  surface-bright: '#fff8f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff2df'
  surface-container: '#f9ecd9'
  surface-container-high: '#f3e6d4'
  surface-container-highest: '#eee1ce'
  on-surface: '#211b0f'
  on-surface-variant: '#4f4636'
  inverse-surface: '#363023'
  inverse-on-surface: '#fcefdc'
  outline: '#817664'
  outline-variant: '#d2c5b0'
  surface-tint: '#745b00'
  primary: '#745b00'
  on-primary: '#ffffff'
  primary-container: '#facd3b'
  on-primary-container: '#6e5700'
  inverse-primary: '#edc22f'
  secondary: '#8b501a'
  on-secondary: '#ffffff'
  secondary-container: '#feb072'
  on-secondary-container: '#78400a'
  tertiary: '#4a6800'
  on-tertiary: '#ffffff'
  tertiary-container: '#b2e251'
  on-tertiary-container: '#466300'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe089'
  primary-fixed-dim: '#edc22f'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574400'
  secondary-fixed: '#ffdcc4'
  secondary-fixed-dim: '#ffb780'
  on-secondary-fixed: '#2f1400'
  on-secondary-fixed-variant: '#6e3902'
  tertiary-fixed: '#c2f360'
  tertiary-fixed-dim: '#a7d646'
  on-tertiary-fixed: '#141f00'
  on-tertiary-fixed-variant: '#374e00'
  background: '#fff8f2'
  on-background: '#211b0f'
  surface-variant: '#eee1ce'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

# Lumina Design System

## Brand & Style
The Lumina System is defined by an optimistic, approachable, and sun-drenched aesthetic. Shifting from an intense, high-energy orange to a warm, golden-hour palette, the brand evokes feelings of clarity, warmth, and modern friendliness. 

The design style follows a **Corporate Modern** approach with a touch of **Minimalism**. It prioritizes extreme legibility and a welcoming interface. By moving away from sharp, aggressive angles toward soft, rounded forms, the UI feels more human and less industrial.

## Colors
The color palette is anchored by a vibrant, golden Primary Yellow (#ffd240), symbolizing energy and focus. This is supported by a Secondary Peach (#ffb072) for warmth and a Tertiary Lime (#cdff6a) to provide high-visibility accents and functional differentiation.

The Neutral palette (#f8ebd8) moves away from clinical greys toward a warm "Sand" base, which reduces eye strain and reinforces the organic, sunny feel of the system.

*   **Primary:** #ffd240 (Golden Yellow)
*   **Secondary:** #ffb072 (Peach)
*   **Tertiary:** #cdff6a (Lime)
*   **Neutral:** #f8ebd8 (Sand/Cream)
*   **Color Mode:** Light

## Typography
The system utilizes **Inter** across all typographic levels. Inter is a highly versatile neo-grotesque typeface designed for screen readability.

*   **Headlines:** Inter (Bold) - Large, impactful, and clear.
*   **Body:** Inter (Regular) - Optimized for long-form reading at 14px and 16px.
*   **Labels:** Inter (Medium) - Used for buttons and metadata with slight tracking.

## Layout & Spacing
The layout follows a disciplined 8px spacing rhythm. This creates a predictable vertical flow and consistent alignment across all components.

We employ a **Fluid Grid** system:
- **Desktop:** 12-column grid.
- **Tablet:** 8-column grid.
- **Mobile:** 4-column grid.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and soft **Ambient Shadows**. Instead of harsh black shadows, we use low-opacity tints derived from the neutral palette to create a natural, "sunlit" lift. Elements appear to float gently above the warm neutral background.

## Shapes
The shape language is defined by **Rounded** geometry. This is a core part of the friendly brand identity.

*   **Components (Buttons/Inputs):** 0.5rem (8px) corner radius.
*   **Containers (Cards/Modals):** 1rem (16px) corner radius.

## Components
*   **Buttons:** Primary buttons feature the Golden Yellow background with 8px rounding.
*   **Input Fields:** Clean, white surfaces with a primary yellow focus state and rounded corners.
*   **Cards:** Elevated white containers with 16px rounding, used to group related information.
*   **Chips:** Pill-shaped categorical markers using the secondary and tertiary palettes.