import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useCallback, useRef } from "react";
import {
  Animated as RNAnimated,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import type { Todo } from "./todo-store";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const translateX = useRef(new RNAnimated.Value(0)).current;
  const panStartX = useRef(0);

  const handleToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(todo.id);
  }, [todo.id, onToggle]);

  const handleDelete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    RNAnimated.timing(translateX, {
      toValue: -400,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onDelete(todo.id));
  }, [todo.id, onDelete, translateX]);

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      layout={LinearTransition.springify().damping(18).stiffness(150)}
      style={{ overflow: "hidden" }}
    >
      {/* Delete background */}
      <View
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 100,
          backgroundColor: AC.systemRed,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 14,
        }}
      >
        <Image
          source="sf:trash.fill"
          style={{ fontSize: 20, color: "white" }}
        />
      </View>

      <RNAnimated.View
        style={{ transform: [{ translateX }] }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(e) => {
          panStartX.current = e.nativeEvent.pageX;
        }}
        onResponderMove={(e) => {
          const dx = e.nativeEvent.pageX - panStartX.current;
          if (dx < 0) {
            translateX.setValue(dx);
          }
        }}
        onResponderRelease={(e) => {
          const dx = e.nativeEvent.pageX - panStartX.current;
          if (dx < -80) {
            handleDelete();
          } else {
            RNAnimated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: AC.secondarySystemGroupedBackground,
            padding: 16,
            borderRadius: 14,
            borderCurve: "continuous",
            gap: 14,
          }}
        >
          {/* Checkbox */}
          <Pressable onPress={handleToggle} hitSlop={8}>
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                borderWidth: todo.completed ? 0 : 2,
                borderColor: todo.completed
                  ? "transparent"
                  : AC.tertiaryLabel,
                backgroundColor: todo.completed
                  ? AC.systemGreen
                  : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {todo.completed && (
                <Image
                  source="sf:checkmark"
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "white",
                  }}
                />
              )}
            </View>
          </Pressable>

          {/* Text */}
          <Text
            selectable
            style={{
              flex: 1,
              fontSize: 17,
              color: todo.completed ? AC.tertiaryLabel : AC.label,
              textDecorationLine: todo.completed ? "line-through" : "none",
            }}
            numberOfLines={3}
          >
            {todo.text}
          </Text>
        </View>
      </RNAnimated.View>
    </Animated.View>
  );
}
