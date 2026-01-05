import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Check, X, Plus, GripVertical } from 'lucide-react-native';
import { plannerStyles } from '../../../styles/plannerStyles';

interface TaskItemProps {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  onToggle: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  onLongPress?: () => void;
  isDragging?: boolean;
  inputRef?: (ref: TextInput | null) => void;
  isLast: boolean;
  autoFocus?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  status,
  onToggle,
  onUpdate,
  onDelete,
  onAddNew,
  onLongPress,
  isDragging = false,
  inputRef,
  isLast,
  autoFocus = false,
}) => {
  const [taskTitle, setTaskTitle] = useState(title);
  const [flashAnim] = useState(new Animated.Value(0));
  const [greenFlashAnim] = useState(new Animated.Value(0));
  const inputRefInternal = React.useRef<TextInput>(null);
  const completed = status === 'completed';

  useEffect(() => {
    if (inputRef) {
      inputRef(inputRefInternal.current);
    }
  }, [inputRef]);

  useEffect(() => {
    setTaskTitle(title);
  }, [title]);

  const handleDelete = () => {
    // Red flash animation
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start(() => {
      onDelete(id);
    });
  };

  const handleToggle = () => {
    if (status === 'pending') {
      // Green flash animation when completing
      Animated.sequence([
        Animated.timing(greenFlashAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(greenFlashAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
    onToggle(id);
  };

  const handleBlur = () => {
    if (taskTitle.trim() && id.startsWith('temp-')) {
      // If it's a temp task and has a title, we need to create it in backend
      // This will be handled by the parent component
      onUpdate(id, taskTitle);
    } else {
      onUpdate(id, taskTitle);
    }
  };

  const redFlashColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 0, 0, 0.3)'],
  });

  const greenFlashColor = greenFlashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 255, 0, 0.05)', 'rgba(0, 255, 0, 0.3)'],
  });

  return (
    <View style={plannerStyles.taskItemContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={onLongPress}
        disabled={!onLongPress || isDragging}
      >
        <Animated.View
          style={[
            plannerStyles.taskItemWrapper,
            {
              backgroundColor: completed ? greenFlashColor : redFlashColor,
              opacity: isDragging ? 0.8 : 1,
            },
          ]}
        >
        {/* Drag Handle */}
        {onLongPress && (
          <TouchableOpacity
            onLongPress={onLongPress}
            activeOpacity={0.7}
            style={plannerStyles.taskDragHandle}
          >
            <GripVertical size={18} color="#999999" />
          </TouchableOpacity>
        )}

        {/* Checkbox */}
        <TouchableOpacity
          style={[
            plannerStyles.taskCheckbox,
            completed && plannerStyles.taskCheckboxCompleted,
          ]}
          onPress={handleToggle}
          activeOpacity={0.7}
        >
          {completed && <Check size={16} color="#FFFFFF" />}
        </TouchableOpacity>

        {/* Input Field */}
        <TextInput
          ref={inputRefInternal}
          style={[
            plannerStyles.taskInput,
            completed && plannerStyles.taskInputCompleted,
          ]}
          value={taskTitle}
          onChangeText={setTaskTitle}
          onBlur={handleBlur}
          placeholder="Enter task name..."
          placeholderTextColor="#999999"
          editable={!completed}
          autoFocus={autoFocus}
        />

        {/* Delete Button */}
        <TouchableOpacity
          style={plannerStyles.taskDeleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <X size={20} color="#FF0000" />
        </TouchableOpacity>

        {/* Add New Button (only on last item) */}
        {isLast && (
          <TouchableOpacity
            style={plannerStyles.taskAddButton}
            onPress={onAddNew}
            activeOpacity={0.7}
          >
            <Plus size={20} color="#000000" />
          </TouchableOpacity>
        )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};
