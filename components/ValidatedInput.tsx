import React from "react";
import { Controller, Control } from "react-hook-form";
import { InputField } from "./InputField";
import { TextStyle } from "react-native";

interface ValidatedInputProps {
    name: string;
    control: Control<any>;
    label: string;
    rules?: any;
    placeholder?: string;
    multiline?: boolean;
    numberOfLines?: number;
    keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
    inputStyle?: TextStyle;
    editable?: boolean;
    onFocus?: () => void; 
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
    name,
    control,
    label,
    rules,
    placeholder,
    multiline,
    numberOfLines,
    keyboardType,
    inputStyle,
    editable,
    onFocus,
}) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <InputField
                    label={label}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    placeholder={placeholder}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    keyboardType={keyboardType}
                    inputStyle={inputStyle}
                    editable={editable}
                    onFocusCustom={onFocus}
                />
            )}
        />
    );
};
