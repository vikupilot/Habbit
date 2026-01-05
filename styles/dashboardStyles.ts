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
    paddingTop: Spacing.sm,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: Typography.xs,
    color: Colors.gray600,
    marginBottom: 2,
  },
  userName: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.black,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createTaskButton: {
    backgroundColor: Colors.black,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  createTaskIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray600,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  createTaskContent: {
    flex: 1,
  },
  createTaskTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  createTaskSubtitle: {
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
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
});

