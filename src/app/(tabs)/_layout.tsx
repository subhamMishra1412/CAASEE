import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import { StyleSheet, Text, type ColorValue } from "react-native";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ],

        tabBarLabelStyle: styles.tabBarLabel,

        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: "#999999",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <TabIcon icon="⌂" color={color} />,
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarLabel: "Calendar",
          tabBarIcon: ({ color }) => <TabIcon icon="▣" color={color} />,
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarLabel: "Tasks",
          tabBarIcon: ({ color }) => <TabIcon icon="✓" color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="assistant"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="schedule"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ icon, color }: { icon: string; color: ColorValue }) {
  return (
    <Text
      style={[
        styles.icon,
        {
          color,
        },
      ]}
    >
      {icon}
    </Text>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 64,
    paddingTop: 7,
    paddingBottom: 7,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 0,
  },

  tabBarLabel: {
    fontSize: 11,
    fontWeight: "600",
  },

  icon: {
    fontSize: 18,
  },
});
