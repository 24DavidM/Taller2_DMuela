import React from "react";
import { TextInput, Text, View, TextInputProps, TouchableOpacity } from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  inputStyle?: object;
  onFocusCustom?: () => void;
  editable?: boolean;
}

export const InputField = ({
  label,
  error,
  inputStyle,
  onFocusCustom,
  editable = true,
  ...props
}: InputFieldProps) => {
  return (
    <View className="mb-4">
      <Text className="text-base font-semibold text-gray-800 mb-2">{label}</Text>

      {editable ? (
        <TextInput
          placeholderTextColor="#999"
          {...props}
          className="rounded-lg p-3 text-base bg-white border"
          style={[
            { borderColor: error ? "#e74c3c" : "#d1d5db" },
            inputStyle,
          ]}
        />
      ) : (
        <TouchableOpacity onPress={onFocusCustom} activeOpacity={0.7}>
          <TextInput
            placeholderTextColor="#999"
            {...props}
            editable={false}
            className="rounded-lg p-3 text-base bg-white border"
            style={[
              { borderColor: error ? "#e74c3c" : "#d1d5db" },
              inputStyle,
            ]}
            pointerEvents="none" 
          />
        </TouchableOpacity>
      )}

      {error && (
        <Text style={{color:"red", fontSize:10}}>{error}</Text>
      )}
    </View>
  );
};
