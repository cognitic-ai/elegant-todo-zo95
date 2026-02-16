import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

interface AddTodoProps {
  onAdd: (text: string) => void;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState("");

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAdd(trimmed);
    setText("");
  }, [text, onAdd]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: AC.secondarySystemGroupedBackground,
        borderRadius: 14,
        borderCurve: "continuous",
        paddingHorizontal: 16,
        paddingVertical: 6,
      }}
    >
      <Image
        source="sf:plus.circle.fill"
        style={{
          fontSize: 22,
          color: AC.systemBlue,
        }}
      />
      <TextInput
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        placeholder="Add a new task..."
        placeholderTextColor={AC.placeholderText}
        returnKeyType="done"
        style={{
          flex: 1,
          fontSize: 17,
          color: AC.label,
          paddingVertical: 12,
        }}
      />
      {text.trim().length > 0 && (
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
            backgroundColor: AC.systemBlue,
            borderRadius: 8,
            borderCurve: "continuous",
            paddingHorizontal: 14,
            paddingVertical: 8,
          })}
        >
          <Image
            source="sf:arrow.up"
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "white",
            }}
          />
        </Pressable>
      )}
    </View>
  );
}
