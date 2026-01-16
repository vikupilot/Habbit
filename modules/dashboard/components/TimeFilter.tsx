import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { dashboardStyles } from '../../../styles/dashboardStyles';

export type TimeFilterOption = 'day' | 'week' | 'month' | 'year';

interface TimeFilterProps {
  selected: TimeFilterOption;
  onSelect: (option: TimeFilterOption) => void;
}

export const TimeFilter: React.FC<TimeFilterProps> = ({ selected, onSelect }) => {
  const options: { label: string; value: TimeFilterOption }[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
  ];

  return (
    <View style={dashboardStyles.timeFilterContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            dashboardStyles.timeFilterButton,
            selected === option.value && dashboardStyles.timeFilterButtonActive,
          ]}
          onPress={() => onSelect(option.value)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              dashboardStyles.timeFilterButtonText,
              selected === option.value && dashboardStyles.timeFilterButtonTextActive,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

