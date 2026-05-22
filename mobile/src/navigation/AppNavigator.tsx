import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import type { RootStackParamList } from "../types";
import { useAuth } from "../context/AuthContext";
import { Colors } from "../utils/theme";
import { navigationRef } from "../utils/navigation";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import EmployeeListScreen from "../screens/EmployeeListScreen";
import EmployeeDetailScreen from "../screens/EmployeeDetailScreen";
import EmployeeFormScreen from "../screens/EmployeeFormScreen";
import CategoryListScreen from "../screens/CategoryListScreen";
import DeviceListScreen from "../screens/DeviceListScreen";
import DeviceFormScreen from "../screens/DeviceFormScreen";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const EmployeeStack = createNativeStackNavigator();
const DeviceStack = createNativeStackNavigator();

function EmployeeStackScreen() {
  return (
    <EmployeeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "#fff",
      }}
    >
      <EmployeeStack.Screen name="EmployeeList" component={EmployeeListScreen} options={{ title: "员工管理" }} />
      <EmployeeStack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} options={{ title: "员工详情" }} />
      <EmployeeStack.Screen name="EmployeeForm" component={EmployeeFormScreen} options={{ title: "编辑员工" }} />
    </EmployeeStack.Navigator>
  );
}

function DeviceStackScreen() {
  return (
    <DeviceStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "#fff",
      }}
    >
      <DeviceStack.Screen name="DeviceList" component={DeviceListScreen} options={{ title: "设备管理" }} />
      <DeviceStack.Screen name="DeviceForm" component={DeviceFormScreen} options={{ title: "编辑设备" }} />
    </DeviceStack.Navigator>
  );
}

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    "首页": "🏠",
    "员工": "👥",
    "分类": "📂",
    "设备": "💻",
  };
  return (
    <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.5 }}>
      {icons[label] || "📌"}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "#fff",
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "首页",
          tabBarIcon: ({ focused }) => <TabIcon label="首页" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Employees"
        component={EmployeeStackScreen}
        options={{
          title: "员工",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon label="员工" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoryListScreen}
        options={{
          title: "分类",
          tabBarIcon: ({ focused }) => <TabIcon label="分类" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Devices"
        component={DeviceStackScreen}
        options={{
          title: "设备",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon label="设备" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <RootStack.Screen name="Main" component={MainTabs} />
        ) : (
          <RootStack.Screen name="Login" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
