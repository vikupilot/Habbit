import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { plannerStyles } from '../../../styles/plannerStyles';

interface AddFavoriteModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (taskName: string) => void;
}

export const AddFavoriteModal: React.FC<AddFavoriteModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [taskName, setTaskName] = useState('');

  const handleAdd = () => {
    if (taskName.trim()) {
      onAdd(taskName.trim());
      setTaskName('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={plannerStyles.modalOverlay}>
        <View style={plannerStyles.modalContent}>
          <View style={plannerStyles.modalHeader}>
            <Text style={plannerStyles.modalTitle}>Add Favorite Task</Text>
            <TouchableOpacity
              onPress={onClose}
              style={plannerStyles.modalCloseButton}
            >
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={plannerStyles.modalInput}
            placeholder="Enter task name..."
            placeholderTextColor="#999999"
            value={taskName}
            onChangeText={setTaskName}
            autoFocus
          />

          <TouchableOpacity
            style={[
              plannerStyles.modalButton,
              !taskName.trim() && plannerStyles.modalButtonDisabled,
            ]}
            onPress={handleAdd}
            activeOpacity={0.8}
            disabled={!taskName.trim()}
          >
            <Text style={plannerStyles.modalButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

