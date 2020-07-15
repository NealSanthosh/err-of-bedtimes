import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {TextInput} from 'react-native';
import * as firebase from 'firebase';
import db from '../config.js';

export default class TransactionScreen extends React.Component {

  constructor(){
    super();
    this.state = {
      hasCameraPermission: null,
      scanned: false, 
      buttonState:"normal",
      scannedBookId:"",
      scannedStudentId:"",
      transactionMessage:"",
    };
  }

   getCameraPermission = async (Id)=>{
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted",
      buttonState: Id,
      scanned: false,
    })
  }

  handleBarCodeScanned = async({type, data})=>{
    const {buttonState} = this.state
    if(buttonState === "BookId"){
      this.setState({
        scannedBookId:data,
        scanned: true,
        buttonState:"normal"
      })
    }else if(buttonState === "StudentId"){
      this.setState({
        scannedStudentId:data,
        scanned: true,
        buttonState:"normal"
      }) 
    }
  }

  handleTransaction = async()=>{
    var transactionMessage;
    db.collection("books").doc(this.state.scannedBookId).get().then((doc)=>{
      console.log(doc.data());
    })
  }

    render() {
      const buttonState = this.state.buttonState
      const hasCameraPermission = this.state.hasCameraPermission
      const scanned = this.state.scanned

      if (buttonState !== "normal" && hasCameraPermission){
        return(
          <BarCodeScanner 
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanned? undefined:this.handleBarCodeScanned}>

          </BarCodeScanner>
        )
      }else if(buttonState === "normal"){
        return (
        <View style={styles.container}>
          <View>
            <Image source={require("../assets/booklogo.jpg")} 
            style = {{
              width: 200,
              height: 200
            }}/>
            <Text style={styles.displayText}>Book Worm</Text>
          </View>
          <View style={styles.inputView}>

            <TextInput 
            placeholder = "Book Id"
            value = {this.state.scannedBookId}/>

            <TouchableOpacity 
            style={styles.scanButton}
            onPress={()=>{
              this.getCameraPermission("BookId")
            }}>
            <Text>Scan</Text>
            </TouchableOpacity> 

            </View>

            <View style={styles.inputView}>

            <TextInput 
            placeholder = "Student Id"
            value = {this.state.scannedStudentId}/>

            <TouchableOpacity 
            style={styles.scanButton}
            onPress={()=>{
              this.getCameraPermission("StudentId")
              }}>
            <Text>Scan</Text>
            </TouchableOpacity> 

            </View>

            <TouchableOpacity
            style={styles.submitButton}
            onPress={async()=>{
              this.handleTransaction()
              }}>
              <Text style={styles.submitButtonText}>
                Submit
              </Text>
            </TouchableOpacity>

        </View>
      );
    }
      }
  }

const styles=StyleSheet.create({
  container:{
    flex: 1, justifyContent: 'center', alignItems: 'center' 
  },
  displayText:{
    fontSize: 30,
    textDecorationLine: "underline",
    textAlign:"center",
  },
  scanButton:{
    padding: 10,
    margin: 10,
    backgroundColor: "#2196f3",
  },
  BarCodeScanner:{
    alignItems: "center",
  },
  inputView:{
    flexDirection: "row",
    margin:10,
  },
  submitButton:{
    width:150,
    height: 50,
    backgroundColor: "#fbc02d",
    alignContent: 'center',
  },
  submitButtonText:{
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
    padding: 10,
    fontWeight: 'bold',
  }
});
