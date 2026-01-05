import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ArrowLeft, X, Plus } from 'lucide-react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { profileStyles } from '../styles/profileStyles';
import { apiClient } from '../utils/api';
import { AddFavoriteModal } from '../modules/planner/components/AddFavoriteModal';

interface FavoriteTask {
  id: string;
  title: string;
  order: number;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favs = await apiClient.getFavorites();
      // Sort by order
      const sortedFavs = (favs || []).sort((a, b) => (a.order || 0) - (b.order || 0));
      setFavorites(sortedFavs);
    } catch (error: any) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async (taskName: string) => {
    try {
      const response = await apiClient.createFavorite(taskName);
      if (response.success) {
        await loadFavorites();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add favorite');
    }
  };

  const handleDeleteFavorite = (favoriteId: string) => {
    Alert.alert(
      'Delete Favorite',
      'Are you sure you want to delete this favorite task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.deleteFavorite(favoriteId);
              await loadFavorites();
            } catch (error: any) {
              Alert.alert('Error', 'Failed to delete favorite');
            }
          },
        },
      ]
    );
  };

  const handleDragEnd = async ({ data }: { data: FavoriteTask[] }) => {
    try {
      const favoriteIds = data.map(f => f.id);
      await apiClient.reorderFavorites(favoriteIds);
      setFavorites(data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to reorder favorites');
      // Reload on error to restore original order
      await loadFavorites();
    }
  };

  const renderFavoriteItem = ({ item, drag, isActive }: RenderItemParams<FavoriteTask>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            profileStyles.favoriteItem,
            isActive && { opacity: 0.8, backgroundColor: '#E0E0E0' }
          ]}
          activeOpacity={0.7}
        >
          <View style={profileStyles.favoriteItemLeft}>
            <Text style={profileStyles.favoriteItemText}>{item.title}</Text>
          </View>
          <TouchableOpacity
            style={profileStyles.favoriteDeleteButton}
            onPress={() => handleDeleteFavorite(item.id)}
            activeOpacity={0.7}
          >
            <X size={16} color="#FF0000" />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={profileStyles.container}>
        <StatusBar style="dark" />
        <View style={profileStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={profileStyles.container}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={[profileStyles.header, { paddingHorizontal: 24, paddingTop: 16 }]}>
        <TouchableOpacity
          style={profileStyles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#000000" />
        </TouchableOpacity>
        <Text style={profileStyles.headerTitle}>Manage Favorites</Text>
        <TouchableOpacity
          style={profileStyles.backButton}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.7}
        >
          <Plus size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <View style={profileStyles.emptyContainer}>
          <Text style={profileStyles.emptyText}>No favorite tasks yet</Text>
          <Text style={profileStyles.emptySubtext}>Tap the + button to add one</Text>
        </View>
      ) : (
        <DraggableFlatList
          data={favorites}
          onDragEnd={handleDragEnd}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteItem}
          contentContainerStyle={[profileStyles.scrollContent, { paddingTop: 0, paddingHorizontal: 24 }]}
        />
      )}

      {/* Add Favorite Modal */}
      <AddFavoriteModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddFavorite}
      />
    </SafeAreaView>
  );
}