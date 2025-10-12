// components/CVPrint.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
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

    const getBase64Image = async (uri: string | undefined) => {
        if (!uri) return null;
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
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
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    color: #333;
                }
                h1 {
                    color: #007AFF;
                    text-align: center;
                    margin-bottom: 10px;
                    font-size: 2.5em;
                }
                h2 {
                    color: #007AFF;
                    margin-bottom: 25px;
                }
                h3 {
                    color: #030303;
                }

                h4 {
                    color: #313030;
                }

                .item {
                    margin-bottom: 15px;
                }

                header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 25px;
                    border-bottom: 2px solid #007AFF;
                    padding-bottom: 25px;
                }
                .profileImage {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    margin: 10px 0;
                    object-fit: cover;
                }
                .contactInfo {
                    display: flex;
                    flex-direction: row;
                    gap: 15px;
                    margin-top: 5px;
                    justify-content: center;
                }
                .contactInfo p {
                    margin: 0;
                }
                .section {
                    margin-top: 30px;
                }
                .experience,
                .education {
                    margin-top: 20px;
                }
                .skills p {
                    font-weight: 600;
                    color: #030303;
                }
                .skills p span {
                    font-weight: 400;
                    margin-bottom: 8px;
                }
            </style>
        </head>
        <body>
            <header>
                <h1>${personalInfo.fullName || "Nombre Apellido"}</h1>
                ${base64Image
                        ? `<img src="${base64Image}" class="profileImage"/>`
                        : `<div class="profileImage" style="background:#ddd;"></div>`
                    }
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
                <div class="experience">
                    ${experiences?.length
                        ? experiences.map(exp => `
                        <div class="item">
                            <h3>${exp.position}</h3>
                            <h4>${exp.company}</h4>
                            <p>${exp.startDate} - ${exp.endDate || "Actual"}</p>
                            <p>${exp.description || ""}</p>
                        </div>`).join("")
                        : "<p>Sin experiencia registrada.</p>"
                    }
                </div>
            </section>

            <section class="section">
                <h2>Educación</h2>
                <div class="education">
                    ${education?.length
                        ? education.map(edu => `
                    <div class="item">
                        <h3>${edu.degree}</h3>
                        <h4>${edu.field || ""}</h4>
                        <p>${edu.institution}</p>
                        <p>Año: ${edu.graduationYear || "—"}</p>
                    </div>`).join("")
                        : "<p>Sin educación registrada.</p>"
                    }
                </div>
            </section>

            <section class="section">
                <h2>Habilidades</h2>
                ${skills?.length
                        ? skills.map(skill => `
                    <div class="skills">
                        <p>• ${skill.name} <span> — Nivel: ${skill.level}</span></p>
                    </div>`).join("")
                        : "<p>Sin habilidades registradas.</p>"
                    }
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
        if (!pdfUri) {
            Alert.alert("Primero debes generar el PDF");
            return;
        }
        try {
            await Print.printAsync({ uri: pdfUri });
        } catch (error) {
            console.error("Error al mostrar PDF:", error);
            Alert.alert("Error", "No se pudo mostrar el PDF.");
        }
    };

    const sharePDF = async () => {
        if (!pdfUri) {
            Alert.alert("Primero debes generar el PDF antes de compartirlo.");
            return;
        }
        try {
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(pdfUri);
            } else {
                Alert.alert("No disponible compartir en este dispositivo.");
            }
        } catch (error) {
            console.error("Error al compartir PDF:", error);
            Alert.alert("Error", "No se pudo compartir el PDF.");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#007AFF" }]} onPress={generatePDF}>
                <Text style={styles.buttonText}>GENERAR PDF</Text>
            </TouchableOpacity>

            <View style={styles.rowButtons}>
                <TouchableOpacity style={[styles.button, styles.flexButton, { backgroundColor: "#34C759" }]} onPress={viewPDF}>
                    <Text style={styles.buttonText}>VER PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.flexButton, { backgroundColor: "#FF9500" }]} onPress={sharePDF}>
                    <Text style={styles.buttonText}>COMPARTIR PDF</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginBottom: 30,
    },
    button: {
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    rowButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    flexButton: {
        flex: 1,
        marginHorizontal: 5,
    },
});
