import React, { useState } from "react";
import { View, Text, ScrollView, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm } from "react-hook-form";
import { ValidatedInput } from "../components/ValidatedInput";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";

type FormData = Omit<Experience, "id">;

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  const { control, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  const [pickerField, setPickerField] = useState<"startDate" | "endDate" | null>(null);
  const [pickerDate, setPickerDate] = useState(new Date());

  // Función para abrir DatePicker
  const openPicker = (field: "startDate" | "endDate") => {
    setPickerField(field);
    setPickerDate(new Date());
  };

  // Función que maneja la selección de la fecha
  const onDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setPickerField(null);
      return;
    }

    if (selectedDate && pickerField) {
      const formatted = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
      setValue(pickerField, formatted);
      setPickerField(null);
    }
  };

  // Función para agregar experiencia
  const onSubmit = (data: FormData) => {
    const today = new Date();

    if (!data.startDate) {
      alert("La fecha de inicio es obligatoria.");
      return;
    }

    const [startMonth, startYear] = data.startDate.split(" ");
    const start = new Date(parseInt(startYear), monthNames.indexOf(startMonth));

    if (start > today) {
      alert("La fecha de inicio no puede ser futura.");
      return;
    }

    if (data.endDate) {
      const [endMonth, endYear] = data.endDate.split(" ");
      const end = new Date(parseInt(endYear), monthNames.indexOf(endMonth));

      if (end > today) {
        alert("La fecha de fin no puede ser futura.");
        return;
      }

      if (end < start) {
        alert("La fecha de fin no puede ser anterior a la fecha de inicio.");
        return;
      }
    }

    addExperience({ id: Date.now().toString(), ...data });
    alert("Experiencia agregada correctamente");

    // Limpiar campos
    setValue("company", "");
    setValue("position", "");
    setValue("startDate", "");
    setValue("endDate", "");
    setValue("description", "");
  };

  // Función para eliminar experiencia con alerta
  const handleDeleteExperience = (id: string) => {
    Alert.alert(
      "Eliminar Experiencia",
      "¿Estás seguro de eliminar esta experiencia?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deleteExperience(id) },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-5">
        <Text className="text-2xl font-bold text-slate-800 mb-4">
          Agregar Nueva Experiencia
        </Text>

        {/* Inputs */}
        <ValidatedInput
          name="company"
          control={control}
          label="Empresa *"
          placeholder="Nombre de la empresa"
          rules={{
            required: "Empresa es obligatoria",
            maxLength: { value: 50, message: "Máximo 50 caracteres" },
            pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, message: "Solo se permiten letras y espacios" }
          }}
        />

        <ValidatedInput
          name="position"
          control={control}
          label="Cargo *"
          placeholder="Tu posición"
          rules={{
            required: "Cargo es obligatorio",
            maxLength: { value: 50, message: "Máximo 50 caracteres" },
            pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, message: "Solo se permiten letras y espacios" }
          }}
        />

        <ValidatedInput
          name="startDate"
          control={control}
          label="Fecha de Inicio *"
          placeholder="Selecciona mes y año"
          editable={false}
          onFocus={() => openPicker("startDate")}
        />

        <ValidatedInput
          name="endDate"
          control={control}
          label="Fecha de Fin"
          placeholder="Selecciona mes y año"
          editable={false}
          onFocus={() => openPicker("endDate")}
        />

        <ValidatedInput
          name="description"
          control={control}
          label="Descripción"
          placeholder="Describe tus responsabilidades y logros..."
          multiline
          numberOfLines={4}
          inputStyle={{ height: 100, textAlignVertical: "top" }}
          rules={{ maxLength: { value: 250, message: "Máximo 250 caracteres" } }}
        />

        {/* Date Picker */}
        {pickerField && (
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
          />
        )}

        {/* Botones */}
        <NavigationButton
          title="Agregar Experiencia"
          onPress={handleSubmit(onSubmit)}
        />

        {cvData.experiences.length > 0 && (
          <>
            <Text className="text-xl font-semibold text-slate-800 mt-6 mb-3">
              Experiencias Agregadas
            </Text>

            {cvData.experiences.map((exp) => (
              <View key={exp.id} className="bg-white rounded-xl p-4 mb-3 shadow">
                <Text className="text-base font-semibold text-slate-800 mb-1">
                  {exp.position}
                </Text>
                <Text className="text-sm text-gray-500 mb-1">{exp.company}</Text>
                <Text className="text-xs text-gray-400 mb-1">
                  {exp.startDate} - {exp.endDate || "Actual"}
                </Text>
                {exp.description && (
                  <Text className="text-sm text-gray-600">{exp.description}</Text>
                )}

                {/* Botón eliminar */}
                <NavigationButton
                  title="Eliminar"
                  onPress={() => handleDeleteExperience(exp.id)}
                  variant="danger"
                  className="mt-3"
                />
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          className="mt-4 mb-8"
        />
      </View>
    </ScrollView>
  );
}
