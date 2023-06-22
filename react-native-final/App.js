import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView } from 'react-native';
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
    borderRadius: 8,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 10,
    width: 90,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 20,
  },
  productContainer: {
    backgroundColor:'white',
    marginBottom: 10,
    padding:20,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, 
    marginBottom: 10,
  },
  productImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover', 
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 14,
    marginTop: 5,
  },
  addToCartButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 10,
    width: 120,
    marginTop: 10,
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

function HomeScreen() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.vendoo.ge/api/beta/catalog?url=technics%2Fkompiuteruli-teqnika%2Fnoutbuqebi-da-misi-aqsesuarebi&sort=popular&sortDir=desc&page=1&limit=20'
        );
        const data = response.data.products;
        setProducts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (productId) => {
    // Implement your logic for adding the product to the cart
    console.log('Product added to cart:', productId);
  };

  

  return (
    <ScrollView>
      <View style={styles.container}>
        {products.map((product) => (
          <View key={product.id} style={styles.productContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: product.thumb_img.files.webp }}
                style={styles.productImage}
              />
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>Price: {product.original_price}</Text>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => handleAddToCart(product.id)}
            >
              <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
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

      
      await AsyncStorage.setItem('accessToken', token);

      
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
