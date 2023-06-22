import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 250,
    height: 50,
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius:8,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 10,
    width:90,
    
    
  },
  buttonText: {
    color: 'white',
    fontSize:20,
    textAlign:'center'
    
  },
  errorText: {
    color: 'red',
    marginTop: 20, 
  },
});

function HomeScreen() {
  const navigation = useNavigation();

  const handleHeaderButtonPress = () => {
    navigation.navigate('MyCart');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function MyCartScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>My Cart Screen</Text>
    </View>
  );
}

function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError] = useState('');
  
  const handleLogin = async () => {
    try {
      setError('');

      if (!email || !password) {
        setError('Please fill in your information');
        return;
      }

      const response = await axios.post(
        'https://accounts.tnet.ge/api/ka/user/auth',
        {
          Email: email,
          Password: password,
        }
      );

      const token = response.data.data.access_token;

      // Store the token using AsyncStorage
      await AsyncStorage.setItem('accessToken', token);

      // Perform navigation logic to the desired screen
      navigation.navigate('Home');
    } catch (error) {
      setError('Your email or password is incorrect');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const Stack = createNativeStackNavigator();

function MainApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('MyCart')}>
                <Text>my cart</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="MyCart" component={MyCartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return <MainApp />;
}
