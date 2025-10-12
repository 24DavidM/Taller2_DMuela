import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";
import { NavigationButton } from "../components/NavigationButton";
import { ValidatedInput } from "../components/ValidatedInput";
import { useForm } from "react-hook-form";

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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

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
            maxLength: { value: 250, message: "Máximo 250 caracteres" },
            required: { value: true, message: "Área de estudio es obligatoria" },
          }}
        />

        <ValidatedInput
          name="graduationYear"
          control={control}
          label="Año de Graduación"
          placeholder="Ej: 2023"
          keyboardType="numeric"
          rules={{
            pattern: { value: /^\d+$/, message: "Debe ser un número" },
            max: { value: currentYear, message: `No puede ser mayor a ${currentYear}` },
            required: { value: true, message: "Año de graduación es obligatoria" },

          }}
        />

        <NavigationButton title="Agregar Educación" onPress={handleSubmit(onSubmit)} />

        {cvData.education.length > 0 && (
          <>
            <Text style={styles.listTitle}>Educación Agregada</Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  <Text style={styles.cardSubtitle}>{edu.field}</Text>
                  <Text style={styles.cardInstitution}>{edu.institution}</Text>
                  <Text style={styles.cardDate}>{edu.graduationYear}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(edu.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
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
  cardInstitution: {
    fontSize: 14,
    color: "#95a5a6",
    marginBottom: 2,
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
