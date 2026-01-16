import { StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from './theme';

/**
 * Dashboard Styles - Used by Dashboard screen
 */
export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingTop: Spacing.md,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: Typography.xs,
    color: Colors.gray600,
    fontWeight: Typography.medium,
  },
  userNameText: {
    fontSize: Typography.base,
    color: Colors.black,
    fontWeight: Typography.bold,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  motivationalQuoteContainer: {
    backgroundColor: Colors.black,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  motivationalQuoteText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  summaryCardDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  summaryCardLabel: {
    fontSize: Typography.xs,
    color: Colors.gray600,
    fontWeight: Typography.medium,
  },
  summaryCardValue: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.black,
    textAlign: 'center',
  },
  activitySection: {
    marginBottom: Spacing.xl,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  activitySubtitle: {
    fontSize: Typography.xs,
    color: Colors.gray600,
  },
  chartContainer: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    height: 200,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  chartBar: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: BorderRadius.sm,
    minHeight: 20,
  },
  chartLabels: {
    position: 'absolute',
    right: -40,
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  chartLabel: {
    fontSize: Typography.xs,
    color: Colors.gray600,
  },
  timeFilterContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
  },
  timeFilterButton: {
    flex: 1,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeFilterButtonActive: {
    backgroundColor: Colors.black,
  },
  timeFilterButtonText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.gray600,
  },
  timeFilterButtonTextActive: {
    color: Colors.white,
    fontWeight: Typography.semibold,
  },
  weeklyChartContainer: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  weeklyChartTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  weeklyChartContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingBottom: Spacing.sm,
  },
  weeklyChartBarWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    width: '100%',
  },
  weeklyChartBar: {
    width: '40%',
    marginHorizontal: 2,
    borderRadius: BorderRadius.sm,
    minHeight: 8,
    backgroundColor: Colors.black,
  },
  weeklyChartDayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  weeklyChartDayLabel: {
    fontSize: Typography.xs,
    color: Colors.gray600,
    marginTop: Spacing.xs,
  },
  weeklyChartValue: {
    fontSize: Typography.xs,
    color: Colors.black,
    fontWeight: Typography.semibold,
    marginBottom: Spacing.xs,
  },
});

