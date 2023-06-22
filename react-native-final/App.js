
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch, Provider } from 'react-redux';
import {
  configureStore,
  createSlice,
} from '@reduxjs/toolkit';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingBottom: 20,
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
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 20,
    
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItemContainer: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width:300,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cartItemPrice: {
    fontSize: 14,
    marginBottom:10,
  },
  removeButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 10,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    
  },
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      state.push(action.payload);
      AsyncStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      const newState = state.filter((product) => product.id !== action.payload);
      AsyncStorage.setItem('cart', JSON.stringify(newState));
      return newState;
    },
    initializeCart: (state, action) => {
      return action.payload || [];
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});
AsyncStorage.getItem('cart').then((data) => {
  store.dispatch(cartSlice.actions.initializeCart(JSON.parse(data)));
});
//////////////////////////////////////////
function HomeScreen() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const isInCart = (productId) => {
    return cart.some((product) => product.id === productId);
  };

  const handleAddToCart = (product) => {
    if (isInCart(product.id)) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(addToCart(product));
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, product) => total + parseFloat(product.original_price), 0);
  };

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

  const handleLogout = async () => {
    
    await AsyncStorage.removeItem('accessToken');
    
    navigation.navigate('Login');
  };

  return (
    <ScrollView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
            <Text style={styles.productPrice}>
              Price: {product.original_price}
            </Text>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => handleAddToCart(product)}
            >
              <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
////////////////////////////////////////////////////////////
function MyCartScreen() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const calculateTotalPrice = () => {
    return cart.reduce(
      (total, product) => total + parseFloat(product.original_price),
      0
    );
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
        <Text style={styles.title}>My Cart</Text>
        {cart.map((product) => (
          <View key={product.id} style={styles.cartItemContainer}>
            <View style={styles.cartItem}>
              <Image
                source={{ uri: product.thumb_img.files.webp }}
                style={styles.cartItemImage}
              />
              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName}>{product.name}</Text>
                <Text style={styles.cartItemPrice}>
                  Price: {product.original_price}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFromCart(product.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <Text style={styles.totalPriceText}>
          Total Price: {calculateTotalPrice().toFixed(2)} 
        </Text>
      </View>
    </ScrollView>
  );
}
////////////////////////////////////////////

function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

      navigation.replace('Home');
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
//////////////////////////////////////////////
const Stack = createNativeStackNavigator();

function MainApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('MyCart')}
              >
                <Text>My Cart</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="MyCart" component={MyCartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
///////////////////////////////////////////////
export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}

