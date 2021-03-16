import { auth, firestore } from "./config";

export const getUserRole = () => {
  var role;
  firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .get()
    .then((document) => {
      role = document.data().role;
    });
  return role;
};
