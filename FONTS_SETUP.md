# Fonts Setup Guide

This project is configured to use **Inter**, **Manrope**, and **Satoshi** fonts.

## Adding Fonts

1. Create the fonts directory:
   ```bash
   mkdir -p assets/fonts
   ```

2. Download the font files and place them in `assets/fonts/`:
   - Inter: Inter-Regular.ttf, Inter-Medium.ttf, Inter-SemiBold.ttf, Inter-Bold.ttf
   - Manrope: Manrope-Regular.ttf, Manrope-Medium.ttf, Manrope-SemiBold.ttf, Manrope-Bold.ttf
   - Satoshi: Satoshi-Regular.ttf, Satoshi-Medium.ttf, Satoshi-SemiBold.ttf, Satoshi-Bold.ttf

3. Uncomment the font loading code in `app/_layout.tsx`

## Where to Get Fonts

- **Inter**: [Google Fonts](https://fonts.google.com/specimen/Inter) or [rsms.me/inter](https://rsms.me/inter/)
- **Manrope**: [Google Fonts](https://fonts.google.com/specimen/Manrope)
- **Satoshi**: [Fontshare](https://www.fontshare.com/fonts/satoshi) or other font providers

## Using Fonts in Tamagui

Once fonts are loaded, you can use them in your components:

```tsx
<Paragraph fontFamily="Inter">Text with Inter font</Paragraph>
<Paragraph fontFamily="Manrope">Text with Manrope font</Paragraph>
<Paragraph fontFamily="Satoshi">Text with Satoshi font</Paragraph>
```

Or configure them in `tamagui.config.ts` to use as default fonts.

