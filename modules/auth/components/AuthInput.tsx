import React from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react-native';
import { authStyles } from '../../../styles/authStyles';

type InputType = 'text' | 'email' | 'password' | 'name';

interface AuthInputProps extends TextInputProps {
  type: InputType;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const iconMap = {
  name: User,
  email: Mail,
  password: Lock,
  text: Mail,
};

export const AuthInput: React.FC<AuthInputProps> = ({
  type,
  showPassword = false,
  onTogglePassword,
  ...textInputProps
}) => {
  const IconComponent = iconMap[type];
  const isPassword = type === 'password';

  return (
    <View style={authStyles.inputContainer}>
      <TextInput
        style={authStyles.input}
        placeholderTextColor="#999999"
        secureTextEntry={isPassword && !showPassword}
        keyboardType={type === 'email' ? 'email-address' : 'default'}
        autoCapitalize={type === 'email' || type === 'password' ? 'none' : 'words'}
        {...textInputProps}
      />
      <View style={authStyles.inputIcon}>
        {isPassword && onTogglePassword ? (
          <TouchableOpacity onPress={onTogglePassword} activeOpacity={0.7}>
            {showPassword ? (
              <EyeOff size={18} color="#999999" />
            ) : (
              <Eye size={18} color="#999999" />
            )}
          </TouchableOpacity>
        ) : (
          IconComponent && (
            <IconComponent size={18} color="#999999" />
          )
        )}
      </View>
    </View>
  );
};

