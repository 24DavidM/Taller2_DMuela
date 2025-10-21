// components/CVPrint.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { CVData } from "@/types/cv.types";

interface CVPrintProps {
  cvData: CVData;
}

export const CVPrint = ({ cvData }: CVPrintProps) => {
  const { personalInfo, experiences, education, skills } = cvData;
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  const getBase64Image = async (uri?: string) => {
    if (!uri) return null;
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Error al convertir imagen a base64:", error);
      return null;
    }
  };

  const generatePDF = async () => {
    try {
      const base64Image = await getBase64Image(personalInfo.profileImage);

      const htmlContent = `
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Mi CV</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
              header { display:flex; flex-direction: column; align-items:center; margin-bottom:25px; border-bottom:2px solid #007AFF; padding-bottom:25px; }
              h1 { color: #007AFF; font-size:2.5em; margin-bottom:10px; text-align:center; }
              .profileImage { width:100px; height:100px; border-radius:50%; object-fit:cover; margin:10px 0; }
              .contactInfo { display:flex; flex-direction:row; gap:15px; justify-content:center; margin-top:5px; }
              .section { margin-top:30px; }
              .item { margin-bottom:15px; }
              h2 { color:#007AFF; margin-bottom:25px; }
              h3 { color:#030303; }
              h4 { color:#313030; }
            </style>
          </head>
          <body>
            <header>
              <h1>${personalInfo.fullName || "Nombre Apellido"}</h1>
              ${base64Image ? `<img src="${base64Image}" class="profileImage"/>` : `<div class="profileImage" style="background:#ddd;"></div>`}
              <div class="contactInfo">
                <p>📧 ${personalInfo.email || ""}</p>
                <p>📱 ${personalInfo.phone || ""}</p>
                <p>📍 ${personalInfo.location || ""}</p>
              </div>
            </header>

            <section class="section">
              <h2>Resumen Profesional</h2>
              <p>${personalInfo.summary || "Sin resumen disponible."}</p>
            </section>

            <section class="section">
              <h2>Experiencia Laboral</h2>
              ${experiences?.length ? experiences.map(exp => `
                <div class="item">
                  <h3>${exp.position}</h3>
                  <h4>${exp.company}</h4>
                  <p>${exp.startDate} - ${exp.endDate || "Actual"}</p>
                  <p>${exp.description || ""}</p>
                </div>`).join("") : "<p>Sin experiencia registrada.</p>"}
            </section>

            <section class="section">
              <h2>Educación</h2>
              ${education?.length ? education.map(edu => `
                <div class="item">
                  <h3>${edu.degree}</h3>
                  <h4>${edu.field || ""}</h4>
                  <p>${edu.institution}</p>
                  <p>Año: ${edu.graduationYear || "—"}</p>
                </div>`).join("") : "<p>Sin educación registrada.</p>"}
            </section>

            <section class="section">
              <h2>Habilidades</h2>
              ${skills?.length ? skills.map(skill => `
                <p>• ${skill.name} — Nivel: ${skill.level}</p>`).join("") : "<p>Sin habilidades registradas.</p>"}
            </section>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      setPdfUri(uri);
      Alert.alert("PDF Generado", "Ya puedes verlo o compartirlo.");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      Alert.alert("Error", "No se pudo generar el PDF.");
    }
  };

  const viewPDF = async () => {
    if (!pdfUri) return Alert.alert("Primero debes generar el PDF");
    try { await Print.printAsync({ uri: pdfUri }); }
    catch (error) { console.error(error); Alert.alert("Error", "No se pudo mostrar el PDF."); }
  };

  const sharePDF = async () => {
    if (!pdfUri) return Alert.alert("Primero debes generar el PDF antes de compartirlo.");
    try { if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(pdfUri); else Alert.alert("No disponible compartir en este dispositivo."); }
    catch (error) { console.error(error); Alert.alert("Error", "No se pudo compartir el PDF."); }
  };

  return (
    <View className="p-5 mb-8">
      <TouchableOpacity className="bg-blue-500 p-4 rounded-lg items-center mb-4" onPress={generatePDF}>
        <Text className="text-white font-semibold text-base">GENERAR PDF</Text>
      </TouchableOpacity>

      <View className="flex-row justify-between">
        <TouchableOpacity className="flex-1 bg-green-500 p-4 rounded-lg items-center mr-2" onPress={viewPDF}>
          <Text className="text-white font-semibold text-base">VER PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 bg-orange-500 p-4 rounded-lg items-center ml-2" onPress={sharePDF}>
          <Text className="text-white font-semibold text-base">COMPARTIR PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
