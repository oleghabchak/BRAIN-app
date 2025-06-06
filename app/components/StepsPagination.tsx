import { useAppTheme } from "@/utils/useAppTheme";
import { View } from "react-native";

export default function StepsPagination({ currentStep }: { currentStep: number }) {
  const {
    theme: { colors },
  } = useAppTheme();
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 30,
          gap: 8,
          width: "50%",
        }}
      >
        {[1, 2, 3].map((step) => (
          <View
            key={step}
            style={{
              flex: 1,
              width: 30,
              height: 5,
              backgroundColor: currentStep >= step ? colors.palette.primary500 : colors.palette.neutral200,
              borderRadius: 10,
            }}
          />
        ))}
      </View>
    </View>
  );
}
