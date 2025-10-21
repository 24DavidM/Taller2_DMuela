// components/CVPreview.tsx
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { CVData } from "../types/cv.types";

interface CVPreviewProps {
  cvData: CVData;
}

export const CVPreview = ({ cvData }: CVPreviewProps) => {
  const { personalInfo, experiences, education, skills } = cvData;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        {/* Header con foto */}
        <View className="flex-row items-center mb-6">
          {personalInfo.profileImage && (
            <Image
              source={{ uri: personalInfo.profileImage }}
              className="w-24 h-24 rounded-full mr-4 border-4 border-blue-500"
            />
          )}
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {personalInfo.fullName || "Nombre"}
            </Text>
            {personalInfo.email && <Text className="text-sm text-gray-500 mb-1">📧 {personalInfo.email}</Text>}
            {personalInfo.phone && <Text className="text-sm text-gray-500 mb-1">📱 {personalInfo.phone}</Text>}
            {personalInfo.location && <Text className="text-sm text-gray-500">📍 {personalInfo.location}</Text>}
          </View>
        </View>

        {/* Resumen */}
        {personalInfo.summary && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-blue-500 border-b-2 border-blue-500 pb-1 mb-2">
              Resumen Profesional
            </Text>
            <Text className="text-sm text-gray-800 leading-5">{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experiencia */}
        {experiences.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-blue-500 border-b-2 border-blue-500 pb-1 mb-2">
              Experiencia Laboral
            </Text>
            {experiences.map((exp) => (
              <View key={exp.id} className="mb-4">
                <Text className="text-base font-semibold text-gray-800">{exp.position}</Text>
                <Text className="text-sm text-gray-500">{exp.company}</Text>
                <Text className="text-xs text-gray-400">{exp.startDate} - {exp.endDate || "Actual"}</Text>
                {exp.description && <Text className="text-sm text-gray-800 mt-1">{exp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Educación */}
        {education.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-blue-500 border-b-2 border-blue-500 pb-1 mb-2">
              Educación
            </Text>
            {education.map((edu) => (
              <View key={edu.id} className="mb-4">
                <Text className="text-base font-semibold text-gray-800">{edu.degree}</Text>
                {edu.field && <Text className="text-sm text-gray-500">{edu.field}</Text>}
                <Text className="text-sm text-gray-500">{edu.institution}</Text>
                <Text className="text-xs text-gray-400">{edu.graduationYear}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Habilidades */}
        {skills.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-blue-500 border-b-2 border-blue-500 pb-1 mb-2">
              Habilidades
            </Text>
            {skills.map((skill) => (
              <View key={skill.id} className="mb-2">
                <Text className="text-base font-semibold text-gray-800">{skill.name}</Text>
                <Text className="text-sm text-gray-500">Nivel: {skill.level}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
