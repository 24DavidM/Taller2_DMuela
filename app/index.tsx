import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, TouchableOpacity, View, Text } from "react-native";
import { useCVContext } from "../context/CVContext";

export default function HomeScreen() {
  const router = useRouter();
  const { cvData } = useCVContext();

  const isPersonalInfoComplete =
    cvData.personalInfo.fullName && cvData.personalInfo.email;
  const hasExperience = cvData.experiences.length > 0;
  const hasEducation = cvData.education.length > 0;
  const hasPhoto = !!cvData.personalInfo.profileImage;

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={true}
    >
      <Text className="text-2xl font-bold text-slate-800 text-center mb-5">
        Crea tu CV Profesional
      </Text>

      {/* Sección: Foto de Perfil */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-slate-800 mb-1">
              Foto de Perfil
            </Text>
            <Text className="text-green-600">
              {hasPhoto ? "✓ Agregada" : "Opcional"}
            </Text>
          </View>
          {hasPhoto && cvData.personalInfo.profileImage && (
            <Image
              source={{ uri: cvData.personalInfo.profileImage }}
              className="w-12 h-12 rounded-full border-2 border-blue-400"
            />
          )}
        </View>
        <TouchableOpacity
          className="bg-blue-400 p-4 rounded-lg"
          onPress={() => router.push("/photo")}
        >
          <Text className="text-white text-center font-semibold">
            {hasPhoto ? "Cambiar Foto" : "Subir Foto"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Información Personal */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-slate-800 mb-1">
          1. Información Personal
        </Text>
        <Text className="text-green-600 mb-2">
          {isPersonalInfoComplete ? "✓ Completado" : "Pendiente"}
        </Text>
        <TouchableOpacity
          className="bg-blue-400 p-4 rounded-lg"
          onPress={() => router.push("/personal-info")}
        >
          <Text className="text-white text-center font-semibold">Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Experiencia */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-slate-800 mb-1">
          2. Experiencia
        </Text>
        <Text className="text-green-600 mb-2">
          {hasExperience
            ? `✓ ${cvData.experiences.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          className="bg-blue-400 p-4 rounded-lg"
          onPress={() => router.push("/experience")}
        >
          <Text className="text-white text-center font-semibold">Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Educación */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-slate-800 mb-1">
          3. Educación
        </Text>
        <Text className="text-green-600 mb-2">
          {hasEducation
            ? `✓ ${cvData.education.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          className="bg-blue-400 p-4 rounded-lg"
          onPress={() => router.push("/education")}
        >
          <Text className="text-white text-center font-semibold">Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Habilidades */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-slate-800 mb-1">
          4. Habilidades
        </Text>
        <Text className="text-green-600 mb-2">
          {cvData.skills.length > 0
            ? `✓ ${cvData.skills.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          className="bg-blue-400 p-4 rounded-lg"
          onPress={() => router.push("/skill")}
        >
          <Text className="text-white text-center font-semibold">Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de Vista Previa */}
      <View className="mt-5 mb-5">
        <TouchableOpacity
          className="bg-green-500 p-5 rounded-xl items-center shadow-lg"
          onPress={() => router.push("/preview")}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-bold text-center">
            Ver Vista Previa del CV
          </Text>
        </TouchableOpacity>
      </View>

      {/* Espacio extra */}
      <View className="h-5" />
    </ScrollView>
  );
}
