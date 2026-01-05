import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { plannerStyles } from '../../../styles/plannerStyles';

interface FavoriteTask {
  id: string;
  title: string;
}

interface FavoriteTasksProps {
  favorites: FavoriteTask[];
  onSelectFavorite: (task: FavoriteTask) => void;
}

export const FavoriteTasks: React.FC<FavoriteTasksProps> = ({
  favorites,
  onSelectFavorite,
}) => {
  if (favorites.length === 0) {
    return null;
  }

  return (
    <View style={plannerStyles.favoriteTasksContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={plannerStyles.favoriteTasksScroll}
      >
        {favorites.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={plannerStyles.favoriteTaskTile}
            onPress={() => onSelectFavorite(task)}
            activeOpacity={0.7}
          >
            <Text style={plannerStyles.favoriteTaskText}>{task.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

