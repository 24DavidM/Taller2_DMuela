import React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ValidatedInput } from "../components/ValidatedInput";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { PersonalInfo } from "../types/cv.types";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { cvData, updatePersonalInfo } = useCVContext();

  const { control, handleSubmit } = useForm<PersonalInfo>({
    defaultValues: cvData.personalInfo,
  });

  const onSubmit = (data: PersonalInfo) => {
    updatePersonalInfo(data);
    alert("Información guardada correctamente");
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-5 space-y-4">

        {/* Nombre completo */}
        <ValidatedInput
          name="fullName"
          control={control}
          label="Nombre Completo *"
          placeholder="Juan Pérez"
          rules={{
            required: "Nombre completo es obligatorio",
            pattern: {
              value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
            maxLength: { value: 50, message: "Máximo 50 caracteres" },
          }}
        />

        {/* Email */}
        <ValidatedInput
          name="email"
          control={control}
          label="Email *"
          placeholder="juan@email.com"
          keyboardType="email-address"
          rules={{
            required: "Email es obligatorio",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Email inválido" },
          }}
        />

        {/* Teléfono */}
        <ValidatedInput
          name="phone"
          control={control}
          label="Teléfono *"
          placeholder="+593 99 999 9999"
          keyboardType="phone-pad"
          rules={{
            required: "Teléfono es obligatorio",
            pattern: { value: /^[0-9+]*$/, message: "Solo números y +" },
            maxLength: { value: 15, message: "Máximo 15 caracteres" },
          }}
        />

        {/* Ubicación */}
        <ValidatedInput
          name="location"
          control={control}
          label="Ubicación *"
          placeholder="Quito, Ecuador"
          rules={{
            required: "Ubicación es obligatoria",
            maxLength: { value: 50, message: "Máximo 50 caracteres" },
          }}
        />

        {/* Resumen profesional */}
        <ValidatedInput
          name="summary"
          control={control}
          label="Resumen Profesional"
          placeholder="Describe brevemente tu perfil profesional..."
          numberOfLines={4}
          inputStyle={{ height: 100, textAlignVertical: "top" }}
          rules={{ maxLength: { value: 250, message: "Máximo 250 caracteres" } }}
        />

        <NavigationButton
          title="Guardar Información"
          onPress={handleSubmit(onSubmit)}
          className="mb-4"
        />

        <NavigationButton
          title="Cancelar"
          onPress={() => router.back()}
          variant="secondary"
          className="mb-10"
        />
      </View>
    </ScrollView>
  );
}
