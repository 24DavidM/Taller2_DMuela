import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
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

  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
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

  const onSubmit = (data: FormData) => {
    // Validación fechas
    const today = new Date();

    if (!data.startDate) {
      Alert.alert("Error", "La fecha de inicio es obligatoria.");
      return;
    }

    const [startMonth, startYear] = data.startDate.split(" ");
    const start = new Date(parseInt(startYear), monthNames.indexOf(startMonth));

    if (start > today) {
      Alert.alert("Error", "La fecha de inicio no puede ser futura.");
      return;
    }

    if (data.endDate) {
      const [endMonth, endYear] = data.endDate.split(" ");
      const end = new Date(parseInt(endYear), monthNames.indexOf(endMonth));

      if (end > today) {
        Alert.alert("Error", "La fecha de fin no puede ser futura.");
        return;
      }

      if (end < start) {
        Alert.alert("Error", "La fecha de fin no puede ser anterior a la fecha de inicio.");
        return;
      }
    }

    // Guardar experiencia
    addExperience({ id: Date.now().toString(), ...data });
    Alert.alert("Éxito", "Experiencia agregada correctamente");

    // Limpiar formulario
    setValue("company", "");
    setValue("position", "");
    setValue("startDate", "");
    setValue("endDate", "");
    setValue("description", "");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteExperience(id) },
    ]);
  };

  const openPicker = (field: "startDate" | "endDate") => {
    setPickerField(field);
    setPickerDate(new Date());
  };

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

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

        {pickerField && (
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
          />
        )}

        <NavigationButton title="Agregar Experiencia" onPress={handleSubmit(onSubmit)} />

        {cvData.experiences.length > 0 && (
          <>
            <Text style={styles.listTitle}>Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                  <Text style={styles.cardDate}>
                    {exp.startDate} - {exp.endDate || "Actual"}
                  </Text>
                  {exp.description ? <Text>{exp.description}</Text> : null}
                </View>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#95a5a6",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
