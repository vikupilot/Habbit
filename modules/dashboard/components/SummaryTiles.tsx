import React from 'react';
import { View, Text } from 'react-native';
import { dashboardStyles } from '../../../styles/dashboardStyles';

interface SummaryTilesProps {
  totalTasks: number;
  ongoingTasks: number;
  completedTasks: number;
  streak: number;
}

export const SummaryTiles: React.FC<SummaryTilesProps> = ({
  totalTasks,
  ongoingTasks,
  completedTasks,
  streak,
}) => {
  const tiles = [
    { label: 'Total Tasks', value: totalTasks.toString(), color: '#000000' },
    { label: 'Ongoing Tasks', value: ongoingTasks.toString(), color: '#FFEAA7' },
    { label: 'Completed Tasks', value: completedTasks.toString(), color: '#A8E6CF' },
    { label: 'Streak', value: streak.toString(), color: '#FFB6C1' },
  ];

  return (
    <View style={dashboardStyles.summaryGrid}>
      {tiles.map((tile, index) => (
        <View key={index} style={dashboardStyles.summaryCard}>
          <View style={dashboardStyles.summaryCardHeader}>
            <View
              style={[
                dashboardStyles.summaryCardDot,
                { backgroundColor: tile.color },
              ]}
            />
            <Text style={dashboardStyles.summaryCardLabel}>{tile.label}</Text>
          </View>
          <Text style={dashboardStyles.summaryCardValue}>{tile.value}</Text>
        </View>
      ))}
    </View>
  );
};

