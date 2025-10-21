import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import { useCVContext } from "@/context/CVContext";
import { LevelSkill, Skill } from "@/types/cv.types";
import { NavigationButton } from "@/components/NavigationButton";
import { ValidatedInput } from "@/components/ValidatedInput";

type SkillForm = Omit<Skill, "id">;

export default function SkillScreen() {
    const router = useRouter();
    const { cvData, addSkill, deleteSkill } = useCVContext();

    const { control, handleSubmit, setValue, watch } = useForm<SkillForm>({
        defaultValues: {
            name: "",
            level: LevelSkill.BASIC,
        },
    });

    const onSubmit = (data: SkillForm) => {
        addSkill({ id: Date.now().toString(), ...data });
        Alert.alert("Éxito", "Habilidad agregada correctamente");
        setValue("name", "");
        setValue("level", LevelSkill.BASIC);
    };

    const handleDelete = (id: string) => {
        Alert.alert("Confirmar", "¿Estás seguro de eliminar esta habilidad?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Eliminar", style: "destructive", onPress: () => deleteSkill(id) },
        ]);
    };

    const selectedLevel = watch("level");

    return (
        <ScrollView className="flex-1 bg-gray-100">
            <View className="p-5">
                <Text className="text-2xl font-bold text-slate-800 mb-4">
                    Agregar Nuevas Habilidades
                </Text>

                {/* Formulario */}
                <View className="mb-6">
                    <ValidatedInput
                        name="name"
                        control={control}
                        label="Nombre de la Habilidad *"
                        placeholder="Ej. JavaScript, React, etc."
                        rules={{
                            required: "El nombre de la habilidad es obligatorio",
                            pattern: {
                                value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                                message: "Solo se permiten letras y espacios",
                            },
                            maxLength: {
                                value: 50,
                                message: "Máximo 50 caracteres",
                            },
                        }}
                    />

                    <Text className="text-base font-semibold text-gray-800 mb-2">
                        Nivel:
                    </Text>
                    <View className="border border-gray-300 rounded-lg bg-white mb-4">
                        <Picker
                            selectedValue={selectedLevel}
                            onValueChange={(itemValue) =>
                                setValue("level", itemValue as LevelSkill)
                            }
                        >
                            {Object.values(LevelSkill).map((nivel) => (
                                <Picker.Item key={nivel} label={nivel} value={nivel} />
                            ))}
                        </Picker>
                    </View>

                    <NavigationButton title="Guardar Habilidad" onPress={handleSubmit(onSubmit)} />
                </View>

                {/* Lista de habilidades */}
                {cvData.skills.length > 0 ? (
                    <>
                        <Text className="text-2xl font-bold text-slate-800 mb-4">
                            Habilidades Agregadas
                        </Text>

                        <View className="flex-row flex-wrap justify-between">
                            {cvData.skills.map((skill) => (
                                <View
                                    key={skill.id}
                                    className="bg-white rounded-lg p-4 mb-3 w-[48%] shadow"
                                >
                                    <View className="mb-2">
                                        <Text className="text-lg font-semibold text-slate-800">
                                            {skill.name}
                                        </Text>
                                        <Text className="text-base text-slate-700">
                                            Nivel: {skill.level}
                                        </Text>
                                    </View>

                                    <View className="flex-row">
                                        <TouchableOpacity
                                            onPress={() => handleDelete(skill.id)}
                                            className="bg-blue-500 px-4 py-1.5 rounded-md"
                                        >
                                            <Text className="text-white text-xs font-bold">
                                                Eliminar
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </>
                ) : (
                    <Text className="text-gray-600 text-center mb-4">
                        No has agregado habilidades aún.
                    </Text>
                )}

                <NavigationButton title="Volver" onPress={() => router.back()} variant="secondary" />
            </View>
        </ScrollView>
    );
}
