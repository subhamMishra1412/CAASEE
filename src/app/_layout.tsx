import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import { SafeAreaView, Text, type ColorValue } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 65,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            marginTop: 4,
          },
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: "#999",
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
            tabBarIcon: ({ color }) => <TabIcon icon="📅" color={color} />,
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
    </SafeAreaView>
  );
}

function TabIcon({ icon, color }: { icon: string; color: ColorValue }) {
  return (
    <Text
      style={{
        fontSize: 18,
        color,
        opacity: color === "#000" ? 1 : 0.5,
      }}
    >
      {icon}
    </Text>
  );
}
