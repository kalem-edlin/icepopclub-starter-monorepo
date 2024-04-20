import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { usePersistance } from '../../services/Persistance';


function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const { isLoaded, signOut } = useAuth();
    const setUserContext = usePersistance(state => state.setUserContext)
  
    return (
    <>
    <SignedIn>
    <Tabs
      screenOptions={{
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => isLoaded && <TouchableOpacity onPress={() => signOut()} className='mr-4'>
<MaterialIcons name="logout" size={20} color="black" />
          </TouchableOpacity>
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
    </SignedIn>
    <SignedOut>
        <Redirect href="/(auth)/signin"></Redirect>
    </SignedOut></>
  );
}
