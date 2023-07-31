// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCJYeJOST8IbReGJIHF5z1JdAXzCvcvxTk",
  authDomain: "qr-track-ac8ec.firebaseapp.com",
  projectId: "qr-track-ac8ec",
  storageBucket: "qr-track-ac8ec.appspot.com",
  messagingSenderId: "647098870907",
  appId: "1:647098870907:web:58a5de6ae6114c768346de",
  measurementId: "G-8HP1PDQB09"
};
// const firebaseConfig = {
//   apiKey: "AIzaSyDGd4VDkfmNupoF4sBIkxBKDzMuMYobrw4",
//   authDomain: "meowsurvey-74418.firebaseapp.com",
//   projectId: "meowsurvey-74418",
//   storageBucket: "meowsurvey-74418.appspot.com",
//   messagingSenderId: "258332422451",
//   appId: "1:258332422451:web:b2cda4d21dbd0ea9be0e46",
//   measurementId: "G-4WLD8PDHE6"
// };
// const firebaseConfig = {
//   apiKey: "AIzaSyBE8hlH15xV2ucuSXEvJI8PwrMhTDI9RjA",
//   authDomain: "testdb-36ded.firebaseapp.com",
//   databaseURL: "https://testdb-36ded-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "testdb-36ded",
//   storageBucket: "testdb-36ded.appspot.com",
//   messagingSenderId: "179902468843",
//   appId: "1:179902468843:web:799972983b88bee04be4ae",
//   measurementId: "G-GTCWJ8YKTE"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);