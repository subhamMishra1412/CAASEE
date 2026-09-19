import { TaskItem } from "@/components/TaskItem";
import { Colors } from "@/constants/theme";
import { mockTasks } from "@/data/mockData";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type FilterType = "all" | "today" | "pending";
type Task = (typeof mockTasks)[0];

export default function TasksScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filter, setFilter] = useState<FilterType>("all");

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "today") return task.dueDate === "Today";
    if (filter === "pending") return !task.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const completionPercentage =
    totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Tasks</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {completedCount} of {totalCount} completed
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.text }]}
          disabled
          accessibilityHint="Task creation is planned for Task 003"
          activeOpacity={1}
        >
          <Text style={[styles.addIcon, { color: colors.background }]}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${completionPercentage}%`,
                backgroundColor: colors.text,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {Math.round(completionPercentage)}% complete
        </Text>
        <Text style={[styles.prototypeNotice, { color: colors.textSecondary }]}>
          Task completion is stored only for this prototype session.
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(["All", "Today", "Pending"] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f.toLowerCase() && [
                styles.activeFilter,
                { backgroundColor: colors.text },
              ],
              filter !== f.toLowerCase() && {
                backgroundColor: colors.cardBackground,
              },
            ]}
            onPress={() => setFilter(f.toLowerCase() as FilterType)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f.toLowerCase() && { color: colors.background },
                filter !== f.toLowerCase() && { color: colors.textSecondary },
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <View style={styles.tasksList}>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              colors={colors}
              onToggle={() => handleToggleTask(task.id)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>✓</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No tasks
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            All tasks completed or no tasks in this category
          </Text>
        </View>
      )}

      {/* Add Task Card */}
      <View
        style={[styles.addTaskCard, { backgroundColor: colors.cardBackground }]}
      >
        <Text style={styles.addTaskIcon}>+</Text>
        <View style={styles.addTaskContent}>
          <Text style={[styles.addTaskTitle, { color: colors.text }]}>
            Task creation is coming in Task 003
          </Text>
          <Text
            style={[styles.addTaskSubtext, { color: colors.textSecondary }]}
          >
            This prototype does not create or persist tasks yet.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: "500",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: {
    fontSize: 20,
    fontWeight: "700",
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
  },
  prototypeNotice: {
    fontSize: 11,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  activeFilter: {
    borderRadius: 8,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
  },
  tasksList: {
    marginBottom: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    textAlign: "center",
  },
  addTaskCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderStyle: "dashed",
  },
  addTaskIcon: {
    fontSize: 24,
    fontWeight: "700",
    color: "#999",
  },
  addTaskContent: {
    flex: 1,
  },
  addTaskTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  addTaskSubtext: {
    fontSize: 11,
  },
});
