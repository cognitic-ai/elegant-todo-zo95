import AddTodo from "@/components/add-todo";
import TodoItem from "@/components/todo-item";
import { useTodos } from "@/components/todo-store";
import * as AC from "@bacons/apple-colors";
import { useMemo } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

const listTransition = LinearTransition.springify().damping(18).stiffness(150);

export default function IndexRoute() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();

  const { active, completed } = useMemo(() => {
    const active = todos.filter((t) => !t.completed);
    const completed = todos.filter((t) => t.completed);
    return { active, completed };
  }, [todos]);

  const completedCount = completed.length;
  const totalCount = todos.length;

  return (
    <KeyboardAvoidingView
      behavior={process.env.EXPO_OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40,
          gap: 12,
        }}
      >
        {/* Progress summary */}
        {totalCount > 0 && (
          <Animated.View
            layout={listTransition}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingVertical: 4,
              paddingHorizontal: 4,
            }}
          >
            {/* Progress bar */}
            <View
              style={{
                flex: 1,
                height: 6,
                backgroundColor: AC.systemFill,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                  backgroundColor: AC.systemGreen,
                  borderRadius: 3,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 13,
                color: AC.secondaryLabel,
                fontVariant: ["tabular-nums"],
              }}
            >
              {completedCount}/{totalCount}
            </Text>
          </Animated.View>
        )}

        {/* Add todo input */}
        <AddTodo onAdd={addTodo} />

        {/* Active tasks */}
        {active.length > 0 && (
          <Animated.View layout={listTransition} style={{ gap: 8 }}>
            {active.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </Animated.View>
        )}

        {/* Completed section */}
        {completed.length > 0 && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            layout={listTransition}
            style={{ gap: 8, marginTop: 8 }}
          >
            <Animated.Text
              layout={listTransition}
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: AC.secondaryLabel,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                paddingHorizontal: 4,
              }}
            >
              Completed
            </Animated.Text>
            {completed.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </Animated.View>
        )}

        {/* Empty state */}
        {totalCount === 0 && (
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(200)}
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 60,
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 48 }}>
              {"\u2705"}
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: AC.label,
              }}
            >
              All done!
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: AC.secondaryLabel,
                textAlign: "center",
              }}
            >
              Add a new task to get started.
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
