// src/main-page.js (or any other name you prefer)

import app from '../api/firebase';
import { getFunctions, httpsCallable } from "firebase/functions";

export const greetUser = (userName) => {
  alert(`Hello, ${userName}! Welcome to Study Buddy Finder!`);
};

export const validateEmail = (email) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

export async function createUser(email, fullName, password) {
  const functions = getFunctions(app);
  const createUser = httpsCallable(functions, 'createUser');
  const result = await createUser({ email, fullName, password });
  return result.data;
}

export const handleSignIn = (fullName, email, password, confirmPassword, users) => {
  // Check if passwords match
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Validate email
  if (!validateEmail(email)) {
    alert("Please enter a valid email!");
    return;
  }

  createUser(email, fullName, password);
  
  // Create a new user object
  const newUser = {
    fullName,
    email,
    password,
  };

  // Add new user to the users array
  users.push(newUser);

  // Greet the user
  greetUser(fullName);

  // Optionally, log the users array to the console
  console.log(users);
};
