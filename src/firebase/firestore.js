import { db, isFirebaseConfigured } from './config';
import { 
  collection, 
  doc,
  addDoc, 
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit,
  onSnapshot
} from 'firebase/firestore';

/**
 * Safely add a document to a Firestore collection (with resilient offline/local fallback).
 */
export async function addDocumentSafely(collectionName, data) {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id, isLocal: false };
    } catch (error) {
      console.warn(`Firestore write encountered notice for ${collectionName} (${error.code || error.message}). Persisting to local offline storage.`);
      const mockId = 'local_' + Date.now();
      const stored = JSON.parse(localStorage.getItem(`jbc_${collectionName}`) || '[]');
      const newDoc = {
        ...data,
        id: mockId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isLocal: true,
      };
      stored.unshift(newDoc);
      localStorage.setItem(`jbc_${collectionName}`, JSON.stringify(stored));
      window.dispatchEvent(new CustomEvent(`jbc_${collectionName}_updated`, { detail: stored }));
      return { success: true, id: mockId, isLocal: true, fallback: true };
    }
  } else {
    // Local storage fallback for offline/demo operation
    const mockId = 'local_' + Date.now();
    const stored = JSON.parse(localStorage.getItem(`jbc_${collectionName}`) || '[]');
    const newDoc = {
      ...data,
      id: mockId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isLocal: true,
    };
    stored.unshift(newDoc);
    localStorage.setItem(`jbc_${collectionName}`, JSON.stringify(stored));
    window.dispatchEvent(new CustomEvent(`jbc_${collectionName}_updated`, { detail: stored }));
    return { success: true, id: mockId, isLocal: true };
  }
}

/**
 * Set or merge a document with specific ID (with resilient offline/local fallback).
 */
export async function setDocumentSafely(collectionName, docId, data) {
  // Always update local cache so changes are instant and never lost
  localStorage.setItem(`jbc_${collectionName}_${docId}`, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent(`jbc_${collectionName}_${docId}_updated`, { detail: data }));

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true, id: docId, isLocal: false };
    } catch (error) {
      console.warn(`Firestore save to cloud (${collectionName}/${docId}) skipped (${error.code || error.message}). Local offline cache preserved.`);
      return { success: true, id: docId, isLocal: true, fallback: true };
    }
  }

  return { success: true, id: docId, isLocal: true };
}

/**
 * Update a document safely (with resilient offline/local fallback).
 */
export async function updateDocumentSafely(collectionName, docId, data) {
  // Sync to local cache
  const stored = JSON.parse(localStorage.getItem(`jbc_${collectionName}`) || '[]');
  const idx = stored.findIndex(item => item.id === docId);
  if (idx !== -1) {
    stored[idx] = { ...stored[idx], ...data, updatedAt: new Date().toISOString() };
  } else {
    stored.unshift({ ...data, id: docId, updatedAt: new Date().toISOString() });
  }
  localStorage.setItem(`jbc_${collectionName}`, JSON.stringify(stored));
  window.dispatchEvent(new CustomEvent(`jbc_${collectionName}_updated`, { detail: stored }));

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true, id: docId, isLocal: false };
    } catch (error) {
      console.warn(`Firestore update cloud skipped for ${collectionName}/${docId} (${error.code || error.message}). Local cache preserved.`);
      return { success: true, id: docId, isLocal: true, fallback: true };
    }
  }

  return { success: true, id: docId, isLocal: true };
}

/**
 * Delete a document safely (with resilient offline/local fallback).
 */
export async function deleteDocumentSafely(collectionName, docId) {
  const stored = JSON.parse(localStorage.getItem(`jbc_${collectionName}`) || '[]');
  const filtered = stored.filter(item => item.id !== docId);
  localStorage.setItem(`jbc_${collectionName}`, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent(`jbc_${collectionName}_updated`, { detail: filtered }));

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return { success: true, id: docId, isLocal: false };
    } catch (error) {
      console.warn(`Firestore delete cloud skipped for ${collectionName}/${docId} (${error.code || error.message}). Local cache updated.`);
      return { success: true, id: docId, isLocal: true, fallback: true };
    }
  }

  return { success: true, id: docId, isLocal: true };
}

/**
 * Real-time collection listener (with resilient offline/local fallback).
 */
export function subscribeToCollection(collectionName, callback, maxLimit = 100) {
  const loadLocal = () => {
    const local = JSON.parse(localStorage.getItem(`jbc_${collectionName}`) || '[]');
    callback(local);
  };

  const handleUpdate = (e) => callback(e.detail || []);
  window.addEventListener(`jbc_${collectionName}_updated`, handleUpdate);

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, collectionName),
        limit(maxLimit)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (items.length > 0) {
          localStorage.setItem(`jbc_${collectionName}`, JSON.stringify(items));
        }
        callback(items);
      }, (error) => {
        console.warn(`Firestore subscription fallback for ${collectionName} (${error.code || error.message}): reading from local cache.`);
        loadLocal();
      });

      return () => {
        window.removeEventListener(`jbc_${collectionName}_updated`, handleUpdate);
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    } catch (err) {
      console.warn('Subscription setup fallback:', err);
      loadLocal();
    }
  } else {
    loadLocal();
  }

  return () => window.removeEventListener(`jbc_${collectionName}_updated`, handleUpdate);
}

/**
 * Real-time single document listener (e.g. settings/companyInfo) with resilient fallback.
 */
export function subscribeToDocument(collectionName, docId, callback) {
  const loadLocal = () => {
    const local = localStorage.getItem(`jbc_${collectionName}_${docId}`);
    if (local) {
      try {
        callback(JSON.parse(local));
      } catch {
        callback(null);
      }
    } else {
      callback(null);
    }
  };

  const handleUpdate = (e) => callback(e.detail || null);
  window.addEventListener(`jbc_${collectionName}_${docId}_updated`, handleUpdate);

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, collectionName, docId);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          localStorage.setItem(`jbc_${collectionName}_${docId}`, JSON.stringify(data));
          callback(data);
        } else {
          loadLocal();
        }
      }, (error) => {
        console.warn(`Firestore document subscription fallback for ${collectionName}/${docId} (${error.code || error.message}): reading from local cache.`);
        loadLocal();
      });

      return () => {
        window.removeEventListener(`jbc_${collectionName}_${docId}_updated`, handleUpdate);
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    } catch (err) {
      console.warn('Doc subscription setup fallback:', err);
      loadLocal();
    }
  } else {
    loadLocal();
  }

  return () => window.removeEventListener(`jbc_${collectionName}_${docId}_updated`, handleUpdate);
}

/**
 * Fetch documents safely.
 */
export async function getDocumentsSafely(collectionName, maxLimit = 50) {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, collectionName),
        orderBy('createdAt', 'desc'),
        limit(maxLimit)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn(`Firestore read failed for ${collectionName}:`, error);
      return JSON.parse(localStorage.getItem(`jbc_${collectionName}`) || '[]');
    }
  }
  return JSON.parse(localStorage.getItem(`jbc_${collectionName}`) || '[]');
}
