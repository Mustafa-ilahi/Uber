import firebase from 'firebase/app'

// Optionally import the services that you want to use
import "firebase/auth";
//import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAqabzrv7KbI2XipQY6Oy5Ob4m6OhjjjOw",
    authDomain: "uber-10fde.firebaseapp.com",
    projectId: "uber-10fde",
    storageBucket: "uber-10fde.appspot.com",
    messagingSenderId: "482921575411",
    appId: "1:482921575411:web:0ea9cf0c15f31740911886",
    measurementId: "G-HM43CQXMSX"
  };

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

function storeLocation (userId="Qtt4HaEVXHoDGVofJwts",location) {
    return db.collection('users').doc(userId).update({
        ...location
    })
}

function storeDriverLocation (driverId,location) {
    return db.collection('drivers').doc(driverId).update({
        ...location
    })
}

function getNearestDrivers(b) {
    return db.collection('drivers')
    .orderBy('geohash')
    .startAt(b[0])
    .endAt(b[1]);
}
function requestDriver (driverId, {userId, lat, lng}) {
    return db.collection('drivers').doc(driverId).update({
        currentRequest: {
            userId, lat, lng
        }
    })
}
function rejectRequest (driverId) {
    return db.collection('drivers').doc(driverId).update({
        currentRequest: null
    })
}

export{
    storeLocation,
    storeDriverLocation,
    getNearestDrivers,
    requestDriver,
    rejectRequest
}

export default db;