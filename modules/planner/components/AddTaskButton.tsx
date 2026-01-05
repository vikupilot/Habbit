import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native';
import { Plus, X, ChevronDown } from 'lucide-react-native';
import { plannerStyles } from '../../../styles/plannerStyles';

interface AddTaskButtonProps {
  onAddTask: (taskTitle: string) => void;
  quickTasks?: string[];
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({
  onAddTask,
  quickTasks = ['Exercise', 'Read Book', 'Meditate', 'Workout'],
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [taskInput, setTaskInput] = useState('');

  const handleQuickTask = (task: string) => {
    onAddTask(task);
    setShowModal(false);
    setShowDropdown(false);
    setTaskInput('');
  };

  const handleCustomTask = () => {
    if (taskInput.trim()) {
      onAddTask(taskInput.trim());
      setTaskInput('');
      setShowModal(false);
      setShowDropdown(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={plannerStyles.addTaskButton}
        onPress={() => setShowModal(true)}
        activeOpacity={0.8}
      >
        <Plus size={20} color="#000000" />
        <Text style={plannerStyles.addTaskButtonText}>Add Task</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={plannerStyles.modalOverlay}>
          <View style={plannerStyles.modalContent}>
            {/* Header */}
            <View style={plannerStyles.modalHeader}>
              <Text style={plannerStyles.modalTitle}>Add New Task</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  setShowDropdown(false);
                  setTaskInput('');
                }}
                style={plannerStyles.modalCloseButton}
              >
                <X size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            {/* Quick Tasks Dropdown */}
            <TouchableOpacity
              style={plannerStyles.dropdownButton}
              onPress={() => setShowDropdown(!showDropdown)}
              activeOpacity={0.7}
            >
              <Text style={plannerStyles.dropdownButtonText}>
                Quick Tasks
              </Text>
              <ChevronDown
                size={20}
                color="#000000"
                style={[
                  plannerStyles.dropdownIcon,
                  showDropdown && plannerStyles.dropdownIconRotated,
                ]}
              />
            </TouchableOpacity>

            {showDropdown && (
              <View style={plannerStyles.dropdownList}>
                {quickTasks.map((task, index) => (
                  <TouchableOpacity
                    key={index}
                    style={plannerStyles.dropdownItem}
                    onPress={() => handleQuickTask(task)}
                    activeOpacity={0.7}
                  >
                    <Text style={plannerStyles.dropdownItemText}>{task}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Custom Input */}
            <View style={plannerStyles.taskInputContainer}>
              <TextInput
                style={plannerStyles.taskInput}
                placeholder="Or write your own task..."
                placeholderTextColor="#999999"
                value={taskInput}
                onChangeText={setTaskInput}
                multiline
              />
            </View>

            {/* Add Button */}
            <TouchableOpacity
              style={[
                plannerStyles.addTaskSubmitButton,
                !taskInput.trim() && plannerStyles.addTaskSubmitButtonDisabled,
              ]}
              onPress={handleCustomTask}
              activeOpacity={0.8}
              disabled={!taskInput.trim()}
            >
              <Text style={plannerStyles.addTaskSubmitButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

