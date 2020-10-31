import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { LoginScreen } from './app/login/Login';
import { ShoppingListScreen } from './app/Shopping-list/ShoppingList';
import { ShoppingListDetailsScreen } from './app/shopping-list-details/ShoppingListDetails';
import { SignUpScreen } from './app/sign-up/SignUp';


function Profile() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile</Text>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Login'}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{title: 'Sign Up'}}
        />
        <Stack.Screen
          name="ShoppingList"
          component={ShoppingListScreen}
          options={{title: 'Shopping Lists'}}
        />
        <Stack.Screen
          name="ShoppingListDetails"
          component={ShoppingListDetailsScreen}
          options={{title: 'Shopping List Details'}}
        />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
