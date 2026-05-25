import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { RootStackParamList } from "../types";
import { useAuth } from "../context/AuthContext";
import * as Colors from "../theme/colors";
import * as Typography from "../theme/typography";
import { navigationRef } from "../utils/navigation";
import AppIcon, { IconNames, type IconName } from "../components/AppIcon";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import EmployeeListScreen from "../screens/EmployeeListScreen";
import EmployeeDetailScreen from "../screens/EmployeeDetailScreen";
import EmployeeFormScreen from "../screens/EmployeeFormScreen";
import CategoryListScreen from "../screens/CategoryListScreen";
import DeviceListScreen from "../screens/DeviceListScreen";
import DeviceFormScreen from "../screens/DeviceFormScreen";
import AIAssistantScreen from "../screens/AIAssistantScreen";
import TicketCreateScreen from "../screens/TicketCreateScreen";
import MyTicketsScreen from "../screens/MyTicketsScreen";
import TicketDetailScreen from "../screens/TicketDetailScreen";
import MessageNotificationsScreen from "../screens/MessageNotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ErrorStatesScreen from "../screens/ErrorStatesScreen";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const EmployeeStack = createNativeStackNavigator();
const DeviceStack = createNativeStackNavigator();

function EmployeeStackScreen() {
  return (
    <EmployeeStack.Navigator screenOptions={{ headerShown: false }}>
      <EmployeeStack.Screen
        name="EmployeeList"
        component={EmployeeListScreen}
        options={{ title: "员工管理" }}
      />
      <EmployeeStack.Screen
        name="EmployeeDetail"
        component={EmployeeDetailScreen}
        options={{ title: "员工详情" }}
      />
      <EmployeeStack.Screen
        name="EmployeeForm"
        component={EmployeeFormScreen}
        options={{ title: "编辑员工" }}
      />
    </EmployeeStack.Navigator>
  );
}

function DeviceStackScreen() {
  return (
    <DeviceStack.Navigator screenOptions={{ headerShown: false }}>
      <DeviceStack.Screen
        name="DeviceList"
        component={DeviceListScreen}
        options={{ title: "设备管理" }}
      />
      <DeviceStack.Screen
        name="DeviceForm"
        component={DeviceFormScreen}
        options={{ title: "编辑设备" }}
      />
    </DeviceStack.Navigator>
  );
}

const TAB_ICONS: Record<string, { outline: IconName; filled: IconName }> = {
  Home: { outline: IconNames.home, filled: IconNames.homeFilled },
  Employees: { outline: IconNames.people, filled: IconNames.peopleFilled },
  Categories: { outline: IconNames.folder, filled: IconNames.folderFilled },
  Devices: { outline: IconNames.desktop, filled: IconNames.desktopFilled },
  Profile: { outline: IconNames.person, filled: IconNames.personFilled },
};

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          if (!icons) return <AppIcon name={IconNames.home} size={size} color={color} />;
          return (
            <AppIcon
              name={focused ? icons.filled : icons.outline}
              size={size}
              color={color}
            />
          );
        },
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.borderLight,
          borderTopWidth: 1,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom - 4 : 6,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: Typography.xs,
          fontWeight: Typography.medium,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "首页" }} />
      <Tab.Screen name="Employees" component={EmployeeStackScreen} options={{ title: "员工" }} />
      <Tab.Screen name="Categories" component={CategoryListScreen} options={{ title: "分类" }} />
      <Tab.Screen name="Devices" component={DeviceStackScreen} options={{ title: "设备" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "我的" }} />
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
          <>
            <RootStack.Screen name="Main" component={MainTabs} />
            <RootStack.Screen name="AIAssistant" component={AIAssistantScreen} />
            <RootStack.Screen name="TicketCreate" component={TicketCreateScreen} />
            <RootStack.Screen name="MyTickets" component={MyTicketsScreen} />
            <RootStack.Screen name="TicketDetail" component={TicketDetailScreen} />
            <RootStack.Screen name="MessageNotifications" component={MessageNotificationsScreen} />
            <RootStack.Screen name="ErrorStates" component={ErrorStatesScreen} />
          </>
        ) : (
          <RootStack.Screen name="Login" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
