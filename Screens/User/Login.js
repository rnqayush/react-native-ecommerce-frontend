import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

import axios from "axios"
import baseURL from "../../assets/common/baseUrl";

//expo

import * as Google from 'expo-google-app-auth'





//expo

// Context
import AuthGlobal from "../../Context/store/AuthGlobal";
 import { loginUser } from "../../Context/actions/Auth.actions";
 import { gloginUser } from "../../Context/actions/Auth.actions";
const Login = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token,setToken]=useState(false)
  const [name,setName]=useState("")
  const [photoUrl,setphotoUrl]=useState("")


  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      props.navigation.navigate("User Profile");
    }
  }, [context.stateUser.isAuthenticated]);

  const handleSubmit = () => {
    const user = {
      email,
      password,
    };

    if (email === "" || password === "") {
      setError("Please fill in your credentials");
    } else {
      loginUser(user, context.dispatch);
    }

  };
  
  async function signInWithGoogleAsync() {
    
    
  
    try {
      const result = await Google.logInAsync({
        androidClientId: '388214865982-upem3ea3ep023be70cds8a3de313kam9.apps.googleusercontent.com',
        
        scopes: ['profile', 'email'],
      });
      

      if (result.type === 'success') {
      
        var user={
          password:result.user.id,
          name:result.user.name,
          email:result.user.email
        }
      
        console.log(user)
        setEmail(result.user.email)
        setPassword(result.user.id)
        axios.post(`${baseURL}users/register`, user) //saving google user to database
        .then((res)=>{
          if(res.status==200){
              loginUser(user, context.dispatch) // logging in google user
          }
        })
       
        

      } else {
        console.log("cancelled");
      }
      
    } catch (e) {
      console.log("error",e);
    }
    
    
  }
  

  /* const googleLogin=()=>{
     axios
           .get(`${baseURL}users/auth/google`)
           
            
   }*/




  return (

    <FormContainer title={"Login"}>
      <Input
        placeholder={"Enter Email"}
        name={"email"}
        id={"email"}
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
      />
      <Input
        placeholder={"Enter Password"}
        name={"password"}
        id={"password"}
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}
        <EasyButton large primary onPress={() => handleSubmit()}>
          <Text style={{ color: "white" }}>Login</Text>
        </EasyButton>
        <EasyButton
        large
        danger 
        onPress={() => signInWithGoogleAsync()}>
          <Text style={{ color: "white" }}>google+</Text>
        </EasyButton>
      </View>
      <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
        <Text style={styles.middleText}>Don't have an account yet?</Text>

        <EasyButton
          large
          secondary
          onPress={() => props.navigation.navigate("Register")}>
          <Text style={{ color: "white" }}>Register</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },
});

export default Login;





//android id:388214865982-upem3ea3ep023be70cds8a3de313kam9.apps.googleusercontent.com