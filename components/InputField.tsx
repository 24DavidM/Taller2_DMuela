import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps, TextStyle, TouchableOpacity } from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  inputStyle?: TextStyle;
  editable?: boolean;
  onFocusCustom?: () => void; // <-- para el calendario
}

export const InputField = ({
  label,
  error,
  multiline = false,
  numberOfLines,
  inputStyle,
  onFocusCustom,
  ...props
}: InputFieldProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity activeOpacity={1} onPress={onFocusCustom} disabled={!onFocusCustom}>
        <TextInput
          style={[styles.input, error && styles.inputError, inputStyle]}
          placeholderTextColor="#999"
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...props}
        />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#fff" },
  inputError: { borderColor: "#e74c3c" },
  errorText: { color: "#e74c3c", fontSize: 12, marginTop: 4 },
});
