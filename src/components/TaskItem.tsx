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
  onPress: () => void;
  onToggle: () => void;
  colors: (typeof Colors)["light"];
}

export function TaskItem({ task, onPress, onToggle, colors }: TaskItemProps) {
  const priorityColors = {
    high: "#ff6b6b",
    medium: "#ffa500",
    low: "#51cf66",
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        task.completed && { opacity: 0.6 },
        { borderLeftColor: colors.cardBackground },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
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
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.content}>
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
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
          <Text style={[styles.dueDate, { color: colors.textSecondary }]}>
            {task.dueDate}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
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
    color: "#fff",
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
    color: "#fff",
  },
  dueDate: {
    fontSize: 11,
  },
});
