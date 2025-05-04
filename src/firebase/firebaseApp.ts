import { initializeApp } from 'firebase/app';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBTxaebT1bI9RTIF9FoERNcXw4ksXIfBOk",
    authDomain: "lappe-dev-b1d8f.firebaseapp.com",
    /* databaseURL: "https://my-app.firebaseio.com", */
    projectId: "lappe-dev-b1d8f",
    storageBucket: "lappe-dev-b1d8f.appspot.com",
    messagingSenderId: "266219936303",
    appId: "1:266219936303:web:b2064cef1fbdc9c8de04da",
};

export const firebaseApp = initializeApp(firebaseConfig);