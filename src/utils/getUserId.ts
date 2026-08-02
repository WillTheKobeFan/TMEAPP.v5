import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

export const getUserId = async () => {
  let userId = await AsyncStorage.getItem("userId");
  if (!userId) {
    userId = uuidv4(); // generate new unique ID
    await AsyncStorage.setItem("userId", userId);
  }
  return userId;
};