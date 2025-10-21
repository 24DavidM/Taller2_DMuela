import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface NavigationButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

export const NavigationButton = ({
  title,
  onPress,
  variant = "primary",
  className = "",
}: NavigationButtonProps) => {
  const baseStyles = "py-4 px-6 rounded-lg items-center justify-center my-2";
  const variants: Record<string, string> = {
    primary: "bg-blue-500",
    secondary: "bg-transparent border-2 border-blue-500",
    danger: "bg-red-500",
  };

  const textColor = variant === "secondary" ? "text-blue-500" : "text-white";

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text className={`text-base font-semibold ${textColor}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
