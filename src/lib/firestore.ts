import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== TYPES ====================
export interface User {
  id?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'client' | 'admin';
  status: 'active' | 'inactive';
  createdAt?: Timestamp;
}

export interface Vehicle {
  id?: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  mileage?: number;
  status: 'active' | 'inactive';
  createdAt?: Timestamp;
}

export interface Notification {
  id?: string;
  userId: string | 'all';
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
  createdAt?: Timestamp;
}

// ==================== USERS ====================
export const usersCollection = collection(db, 'users');

export async function getUsers() {
  const snapshot = await getDocs(query(usersCollection, orderBy('createdAt', 'desc')));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function getUserByEmail(email: string) {
  const q = query(usersCollection, where('email', '==', email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as User;
}

export async function getUserById(id: string) {
  const docRef = doc(db, 'users', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as User;
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt'>) {
  const docRef = await addDoc(usersCollection, {
    ...userData,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...userData };
}

export async function updateUser(id: string, userData: Partial<User>) {
  const docRef = doc(db, 'users', id);
  await updateDoc(docRef, userData);
}

// ==================== VEHICLES ====================
export const vehiclesCollection = collection(db, 'vehicles');

export async function getVehicles() {
  const snapshot = await getDocs(query(vehiclesCollection, orderBy('createdAt', 'desc')));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
}

export async function getVehiclesByUser(userId: string) {
  const q = query(vehiclesCollection, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
}

export async function createVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) {
  const docRef = await addDoc(vehiclesCollection, {
    ...vehicleData,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...vehicleData };
}

export async function updateVehicle(id: string, vehicleData: Partial<Vehicle>) {
  const docRef = doc(db, 'vehicles', id);
  await updateDoc(docRef, vehicleData);
}

export async function deleteVehicle(id: string) {
  const docRef = doc(db, 'vehicles', id);
  await deleteDoc(docRef);
}

// ==================== NOTIFICATIONS ====================
export const notificationsCollection = collection(db, 'notifications');

export async function getNotifications() {
  const snapshot = await getDocs(query(notificationsCollection, orderBy('createdAt', 'desc')));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
}

export async function getNotificationsByUser(userId: string) {
  const q = query(
    notificationsCollection, 
    where('userId', 'in', [userId, 'all']),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
}

export async function createNotification(notifData: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
  const docRef = await addDoc(notificationsCollection, {
    ...notifData,
    read: false,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...notifData, read: false };
}

export async function markNotificationAsRead(id: string) {
  const docRef = doc(db, 'notifications', id);
  await updateDoc(docRef, { read: true });
}

// ==================== STATS ====================
export async function getStats() {
  const [users, vehicles, notifications] = await Promise.all([
    getUsers(),
    getVehicles(),
    getNotifications()
  ]);
  
  return {
    totalUsers: users.filter(u => u.role === 'client').length,
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter(v => v.status === 'active').length,
    totalNotifications: notifications.length,
    unreadNotifications: notifications.filter(n => !n.read).length
  };
}
