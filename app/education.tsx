import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useCVContext } from "../context/CVContext";
import { NavigationButton } from "../components/NavigationButton";
import { ValidatedInput } from "../components/ValidatedInput";
import { useForm } from "react-hook-form";
import { Education } from "../types/cv.types";

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();
  const currentYear = new Date().getFullYear();

  const { control, handleSubmit, reset } = useForm<Omit<Education, "id">>({
    defaultValues: { institution: "", degree: "", field: "", graduationYear: "" },
  });

  const onSubmit = (data: Omit<Education, "id">) => {
    addEducation({ id: Date.now().toString(), ...data });
    reset();
    alert("Educación agregada correctamente");
  };

  const handleDelete = (id: string) => {
    const confirmed = confirm("¿Estás seguro de eliminar esta educación?");
    if (confirmed) deleteEducation(id);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-5">
        <Text className="text-2xl font-bold text-slate-800 mb-4">
          Agregar Nueva Educación
        </Text>

        <ValidatedInput
          name="institution"
          control={control}
          label="Institución *"
          placeholder="Nombre de la universidad/institución"
          rules={{
            required: "Institución es obligatoria",
            pattern: {
              value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
            maxLength: { value: 50, message: "Máximo 50 caracteres" },
          }}
        />

        <ValidatedInput
          name="degree"
          control={control}
          label="Título/Grado *"
          placeholder="Ej: Licenciatura, Maestría"
          rules={{
            required: "Título es obligatorio",
            maxLength: { value: 50, message: "Máximo 50 caracteres" },
          }}
        />

        <ValidatedInput
          name="field"
          control={control}
          label="Área de Estudio"
          placeholder="Ej: Ingeniería en Sistemas"
          multiline
          numberOfLines={3}
          rules={{
            required: "Área de estudio es obligatoria",
            maxLength: { value: 250, message: "Máximo 250 caracteres" },
          }}
        />

        <ValidatedInput
          name="graduationYear"
          control={control}
          label="Año de Graduación"
          placeholder="Ej: 2023"
          keyboardType="numeric"
          rules={{
            required: "Año de graduación es obligatoria",
            pattern: { value: /^\d+$/, message: "Debe ser un número" },
            max: { value: currentYear, message: `No puede ser mayor a ${currentYear}` },
          }}
        />

        <NavigationButton
          title="Agregar Educación"
          onPress={handleSubmit(onSubmit)}
        />

        {cvData.education.length > 0 && (
          <>
            <Text className="text-xl font-semibold text-slate-800 mt-6 mb-3">
              Educación Agregada
            </Text>

            {cvData.education.map((edu) => (
              <View
                key={edu.id}
                className="bg-white rounded-xl p-4 mb-3 flex-row shadow"
              >
                <View className="flex-1">
                  <Text className="text-base font-semibold text-slate-800 mb-1">
                    {edu.degree}
                  </Text>
                  <Text className="text-sm text-gray-500 mb-1">{edu.field}</Text>
                  <Text className="text-sm text-gray-400 mb-1">{edu.institution}</Text>
                  <Text className="text-xs text-gray-400">{edu.graduationYear}</Text>
                </View>

                <TouchableOpacity
                  className="w-8 h-8 rounded-full bg-red-500 justify-center items-center"
                  onPress={() => handleDelete(edu.id)}
                >
                  <Text className="text-white text-lg font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          className="mt-4"
        />
      </View>
    </ScrollView>
  );
}
