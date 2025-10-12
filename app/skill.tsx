// app/skill.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useCVContext } from '@/context/CVContext';
import { LevelSkill, Skill } from '@/types/cv.types';
import { NavigationButton } from '@/components/NavigationButton';
import { InputField } from '@/components/InputField';

export default function SkillScreen() {
    const router = useRouter();
    const { cvData, addSkill, deleteSkill } = useCVContext();

    const [formData, setFormData] = useState<Omit<Skill, 'id'>>({
        name: '',
        level: LevelSkill.BASIC,
    });

    // AGREGAR
    const handleAdd = () => {
        if (!formData.name.trim()) {
            alert('Por favor completa el nombre de la habilidad');
            return;
        }
        const newSkill: Skill = { id: Date.now().toString(), ...formData };
        addSkill(newSkill);
        setFormData({ name: '', level: LevelSkill.BASIC });
        alert('Habilidad agregada correctamente');
    };

    // BORRAR
    const handleDelete = (id: string) => {
        Alert.alert('Confirmar', '¿Estás seguro de eliminar esta habilidad?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Eliminar', style: 'destructive', onPress: () => deleteSkill(id) },
        ]);
    };

    return (
        <ScrollView>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Agregar Nuevas Habilidades</Text>

                {/* Formulario */}
                <View style={styles.formSection}>
                    <InputField
                        label="Nombre de la Habilidad *"
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        placeholder="Ej. JavaScript, React, etc."
                    />
                    <Text style={styles.textoStyle}>Nivel:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.level}
                            onValueChange={(itemValue) =>
                                setFormData({ ...formData, level: itemValue as LevelSkill })
                            }
                        >
                            {Object.values(LevelSkill).map((nivel) => (
                                <Picker.Item key={nivel} label={nivel} value={nivel} />
                            ))}
                        </Picker>
                    </View>

                    <NavigationButton title="Guardar Información" onPress={handleAdd} />
                </View>

                {/* Lista de habilidades */}
                {cvData.skills.length > 0 ? (
                    <>
                        <Text style={styles.sectionTitle}>Habilidades Agregadas</Text>
                        <View style={styles.cardsContainer}>
                            {cvData.skills.map((skill) => (
                                <View key={skill.id} style={styles.card}>
                                    <View style={styles.cardContent}>
                                        <Text style={styles.cardTitle}>{skill.name}</Text>
                                        <Text style={styles.cardSubtitle}>Nivel: {skill.level}</Text>
                                    </View>
                                    <View style={styles.cardButtons}>
                                        <TouchableOpacity
                                            onPress={() => handleDelete(skill.id)}
                                            style={styles.deleteButton}
                                        >
                                            <Text style={styles.deleteButtonText}>Eliminar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </>
                ) : (
                    <Text>No has agregado habilidades aún.</Text>
                )}

                <NavigationButton
                    title="Volver"
                    onPress={() => router.back()}
                    variant="secondary"
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: { padding: 20 },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 16,
    },
    formSection: { marginBottom: 20 },
    textoStyle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 16,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        width: '48%',
    },
    deleteButton: {
        backgroundColor: '#63a2ffff',
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardContent: { marginBottom: 5 },
    cardTitle: { fontSize: 17, fontWeight: '600', color: '#2c3e50'},
    cardSubtitle: { fontSize: 15, color: '#2c3e50',paddingBottom: 5  },
    cardButtons: { flexDirection: 'row' },
});