import { Colors } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onPress?: () => void;
  onToggle: () => void;
  colors: (typeof Colors)["light"];
}

export function TaskItem({ task, onPress, onToggle, colors }: TaskItemProps) {
  const isInteractive = Boolean(onPress);
  const priorityColors = {
    high: colors.priorityHigh,
    medium: colors.priorityMedium,
    low: colors.priorityLow,
  };

  return (
    <View
      style={[
        styles.container,
        task.completed && { opacity: 0.6 },
        {
          backgroundColor: colors.cardBackground,
          borderLeftColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          task.completed && {
            backgroundColor: colors.text,
            borderColor: colors.text,
          },
          !task.completed && {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
        onPress={onToggle}
      >
        {task.completed && (
          <Text style={[styles.checkmark, { color: colors.background }]}>✓</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        disabled={!isInteractive}
        accessibilityHint={
          isInteractive ? undefined : "Task details are planned for Task 003"
        }
        activeOpacity={isInteractive ? 0.7 : 1}
      >
        <Text
          style={[
            styles.title,
            task.completed && {
              color: colors.textSecondary,
              textDecorationLine: "line-through",
            },
            !task.completed && { color: colors.text },
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        <View style={styles.meta}>
          <View
            style={[
              styles.priorityTag,
              { backgroundColor: priorityColors[task.priority] },
            ]}
          >
            <Text style={[styles.priorityText, { color: colors.background }]}>
              {task.priority}
            </Text>
          </View>
          <Text style={[styles.dueDate, { color: colors.textSecondary }]}>
            {task.dueDate}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 14,
    marginVertical: 8,
    borderLeftWidth: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priorityTag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "700",
  },
  dueDate: {
    fontSize: 11,
  },
});
