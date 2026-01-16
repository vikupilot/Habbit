import { StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, IconSizes } from './theme';

/**
 * Shared Auth Styles - Used by both Signup and Login pages
 */
export const authStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  // Back Button
  backButton: {
    marginBottom: Spacing.lg,
  },
  backButtonInner: {
    width: IconSizes.lg,
    height: IconSizes.lg,
    backgroundColor: Colors.black,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Header
  header: {
    marginBottom: Spacing.xl,
  },
  animatedHeader: {
    marginBottom: Spacing.xxl * 3,
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.black,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.gray600,
    lineHeight: 20,
    textAlign: 'center',
  },

  // Decorative Element
  decorativeElement: {
    height: 200,
    marginVertical: Spacing.xl,
  },

  // Form
  form: {
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: Spacing.lg + 4,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md + 4,
    paddingRight: 48,
    paddingVertical: Spacing.md + 2,
    fontSize: Typography.base,
    color: Colors.black,
  },
  inputIcon: {
    position: 'absolute',
    right: Spacing.md + 4,
    top: Spacing.md + 2,
    width: IconSizes.sm,
    height: IconSizes.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Buttons
  primaryButton: {
    backgroundColor: Colors.black,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    fontSize: Typography.sm,
    color: Colors.black,
    fontWeight: Typography.semibold,
  },

  // Social Section
  socialSection: {
    marginBottom: Spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray200,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  socialButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.gray200,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonDark: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: Typography.bold,
    color: Colors.black,
  },
  socialButtonTextDark: {
    fontSize: 16,
    fontWeight: Typography.bold,
    color: Colors.white,
  },

  // Sign in prompt
  signInPrompt: {
    fontSize: Typography.xs,
    color: Colors.gray600,
    textAlign: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
    fontWeight: Typography.medium,
  },

  // OAuth Buttons (Minimalistic Small Icons)
  oauthContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  oauthButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.black,
    borderRadius: BorderRadius.md,
  },
  oauthButtonApple: {
    backgroundColor: Colors.black,
  },
  oauthButtonIcon: {
    fontSize: 24,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  oauthButtonText: {
    color: Colors.white,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },

  // Links
  termsText: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.black,
    fontWeight: Typography.semibold,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  linkText: {
    fontSize: Typography.sm,
    color: Colors.gray600,
  },
  linkButton: {
    color: Colors.black,
    fontWeight: Typography.semibold,
  },
});

