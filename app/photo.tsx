import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";

export default function PhotoScreen() {
    const router = useRouter();
    const { cvData, updatePersonalInfo } = useCVContext();
    const [selectedImage, setSelectedImage] = useState<string | undefined>(
        cvData.personalInfo.profileImage
    );

    const takePhoto = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (!cameraPermission.granted) {
            Alert.alert("Permiso Denegado", "Necesitamos acceso a tu cámara.");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) setSelectedImage(result.assets[0].uri);
    };

    const pickImage = async () => {
        const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!galleryPermission.granted) {
            Alert.alert("Permiso Denegado", "Necesitamos acceso a tu galería.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) setSelectedImage(result.assets[0].uri);
    };

    const handleSave = () => {
        updatePersonalInfo({ ...cvData.personalInfo, profileImage: selectedImage });
        Alert.alert("Éxito", "Foto guardada correctamente");
        router.back();
    };

    const handleRemove = () => {
        Alert.alert("Confirmar", "¿Eliminar foto de perfil?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: () => {
                    setSelectedImage(undefined);
                    updatePersonalInfo({ ...cvData.personalInfo, profileImage: undefined });
                },
            },
        ]);
    };

    return (
        <View className="flex-1 p-5 bg-gray-100">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-5">
                Foto de Perfil
            </Text>

            <View className="items-center mb-4">
                {selectedImage ? (
                    <Image
                        source={{ uri: selectedImage }}
                        className="w-48 h-48 rounded-full border-4 border-blue-500"
                    />
                ) : (
                    <View className="w-48 h-48 rounded-full bg-gray-300 border-4 border-gray-400 justify-center items-center">
                        <Text className="text-gray-500 text-lg">Sin foto</Text>
                    </View>
                )}
            </View>

            <View className="mb-8 flex gap-2">
                <TouchableOpacity
                    onPress={takePhoto}
                    className="bg-blue-500 py-4 rounded-lg items-center"
                >
                    <Text className="text-white font-semibold text-lg">📷 Tomar Foto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={pickImage}
                    className="bg-blue-500 py-4 rounded-lg items-center"
                >
                    <Text className="text-white font-semibold text-lg">🖼️ Seleccionar de Galería</Text>
                </TouchableOpacity>

                {selectedImage && (
                    <TouchableOpacity
                        onPress={handleRemove}
                        className="bg-red-500 py-4 rounded-lg items-center"
                    >
                        <Text className="text-white font-semibold text-lg">🗑️ Eliminar Foto</Text>
                    </TouchableOpacity>
                )}
            </View>

            <NavigationButton title="Guardar" onPress={handleSave} className="mb-4" />

            <NavigationButton
                title="Cancelar"
                onPress={() => router.back()}
                variant="secondary"
                className="mb-10"
            />
        </View>
    );
}
