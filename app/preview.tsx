// app/preview.tsx
import React from "react";
import { View } from "react-native";
import { useCVContext } from "../context/CVContext";
import { CVPreview } from "@/components/CVPreview";
import { CVPrint } from "@/components/CVPrint";

export default function PreviewScreen() {
  const { cvData } = useCVContext();

  return (
    <View className="flex-1 bg-white">
      <CVPreview cvData={cvData} />
      <CVPrint cvData={cvData} />
    </View>
  );
}
