import { StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from './theme';

/**
 * Planner Styles - Used by Planner screen
 */
export const plannerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.black,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarStrip: {
    marginBottom: Spacing.md, // Reduced from Spacing.xl
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  weekTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.black,
  },
  weekNavButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekNavText: {
    fontSize: 24,
    color: Colors.black,
    fontWeight: Typography.bold,
  },
  calendarDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  calendarDay: {
    flex: 1,
    alignItems: 'center',
  },
  calendarDayLabel: {
    fontSize: Typography.xs,
    color: Colors.gray600,
    fontWeight: Typography.medium,
    marginBottom: Spacing.xs,
  },
  calendarDayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray200,
  },
  calendarDayDotActive: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.black,
    marginTop: 4,
  },
  calendarScrollView: {
    marginHorizontal: -Spacing.lg,
  },
  calendarDatesScroll: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  dateItemHorizontal: {
    width: 60,
    alignItems: 'center',
    marginRight: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateDayLabel: {
    fontSize: Typography.xs,
    color: Colors.gray600,
    fontWeight: Typography.medium,
    marginBottom: 4,
  },
  dateDayLabelToday: {
    color: Colors.black,
    fontWeight: Typography.bold,
  },
  dateText: {
    fontSize: Typography.sm,
    color: Colors.black,
    fontWeight: Typography.medium,
    marginBottom: 4,
  },
  dateTextToday: {
    fontWeight: Typography.bold,
  },
  dateSelected: {
    width: 50,
    height: 60,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
  },
  dateSelectedDayLabel: {
    fontSize: Typography.xs,
    color: Colors.white,
    fontWeight: Typography.medium,
    marginBottom: 4,
  },
  dateSelectedText: {
    fontSize: Typography.base,
    color: Colors.white,
    fontWeight: Typography.bold,
  },
  todaySection: {
    marginTop: Spacing.sm, // Added margin top instead of relying on calendarStrip margin
    marginBottom: Spacing.lg,
  },
  todayTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  // Favorite Tasks
  favoriteTasksContainer: {
    marginBottom: Spacing.md,
  },
  favoriteTasksScroll: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  favoriteTaskTile: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginRight: Spacing.sm,
  },
  favoriteTaskText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.black,
  },
  // Task List
  taskList: {
    marginBottom: Spacing.md,
  },
  taskItemContainer: {
    marginBottom: 4,
  },
  taskItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  taskDragHandle: {
    marginRight: Spacing.xs,
    padding: Spacing.xs / 2,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  taskCheckboxCompleted: {
    backgroundColor: Colors.black,
  },
  taskInput: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.black,
    fontWeight: Typography.medium,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: 'transparent',
  },
  taskInputCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.gray600,
  },
  taskDeleteButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  taskAddButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.black,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: Colors.black,
    marginBottom: Spacing.lg,
  },
  modalButton: {
    backgroundColor: Colors.black,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
});
