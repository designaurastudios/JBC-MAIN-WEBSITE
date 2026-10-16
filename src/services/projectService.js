import { useState, useEffect } from 'react';
import { initialProjects } from '../data/projects';
import { 
  addDocumentSafely, 
  updateDocumentSafely, 
  deleteDocumentSafely, 
  subscribeToCollection 
} from '../firebase/firestore';
import { writeBatch, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

/**
 * Seed all 55 default Mumbai projects directly into Firebase Firestore
 */
export async function seedAllProjectsToFirestore() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured. Check your .env credentials.');
  }

  const batch = writeBatch(db);

  initialProjects.forEach((proj, index) => {
    const docRef = doc(db, 'projects', proj.id);
    batch.set(docRef, {
      ...proj,
      status: proj.status || 'Completed Work',
      hasCustomImage: Boolean(proj.image?.trim()),
      isDeleted: false,
      sortOrder: index,
      createdAt: new Date(Date.now() - (index * 60000)).toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  });

  await batch.commit();
  return { success: true, count: initialProjects.length };
}

/**
 * Service to manage Projects with real-time Firebase syncing and local fallback
 */
export async function addProject(projectData) {
  const payload = {
    name: projectData.name?.trim() || 'Untitled Project',
    image: projectData.image?.trim() || '',
    hasCustomImage: Boolean(projectData.image?.trim()),
    location: projectData.location?.trim() || 'Mumbai',
    area: projectData.area?.trim() || projectData.location?.trim() || 'Mumbai',
    description: projectData.description?.trim() || '',
    status: projectData.status || 'Completed Work',
    tag: projectData.tag || 'Verified Project • 100% Quality Guaranteed',
    createdAt: new Date().toISOString(),
    isCustom: true
  };

  return await addDocumentSafely('projects', payload);
}

export async function updateProject(id, projectData) {
  const original = initialProjects.find(p => p.id === id) || {};
  const payload = {
    ...original,
    ...projectData,
    id: id,
    hasCustomImage: Boolean(projectData.image?.trim()),
    isDeleted: false,
    updatedAt: new Date().toISOString()
  };
  return await updateDocumentSafely('projects', id, payload);
}

export async function deleteProject(id) {
  const deletedIds = JSON.parse(localStorage.getItem('jbc_deleted_project_ids') || '[]');
  if (!deletedIds.includes(id)) {
    deletedIds.push(id);
    localStorage.setItem('jbc_deleted_project_ids', JSON.stringify(deletedIds));
  }

  try {
    await updateDocumentSafely('projects', id, { isDeleted: true });
  } catch (e) {
    console.warn('Tombstone write warning:', e);
  }

  return await deleteDocumentSafely('projects', id);
}

/**
 * React hook for consuming projects in real time across the website
 */
export function useProjects() {
  const [projectsList, setProjectsList] = useState(() => {
    const saved = localStorage.getItem('jbc_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeProjects(parsed, initialProjects);
        }
      } catch (e) {
        console.warn('Projects parse error:', e);
      }
    }
    return mergeProjects([], initialProjects);
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection('projects', (liveProjects) => {
      const merged = mergeProjects(liveProjects, initialProjects);
      setProjectsList(merged);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return {
    projects: projectsList,
    latestProjects: projectsList.slice(0, 3),
    loading,
    createProject: addProject,
    editProject: updateProject,
    removeProject: deleteProject
  };
}

/**
 * Helper to merge live Firestore projects with initial directory projects,
 * keeping newly added / edited items first!
 */
function mergeProjects(liveProjects = [], fallbackProjects = []) {
  const deletedIds = new Set(
    JSON.parse(localStorage.getItem('jbc_deleted_project_ids') || '[]')
  );

  const activeLiveProjects = (liveProjects || []).filter(p => !p.isDeleted && !deletedIds.has(p.id));
  const liveMap = new Map(activeLiveProjects.map(p => [p.id, p]));
  const liveDeletedIds = new Set((liveProjects || []).filter(p => p.isDeleted).map(p => p.id));
  const fallbackIds = new Set((fallbackProjects || []).map(p => p.id));

  // Custom newly created projects appear at the top
  const customNewProjects = activeLiveProjects.filter(p => !fallbackIds.has(p.id));

  // Original fallback projects: if edited in live Firestore, seamlessly use updated data!
  const mergedFallbacks = (fallbackProjects || []).map(fb => {
    if (liveDeletedIds.has(fb.id) || deletedIds.has(fb.id)) {
      return null;
    }
    if (liveMap.has(fb.id)) {
      const liveData = liveMap.get(fb.id);
      return {
        ...fb,
        ...liveData,
        status: liveData.status || 'Completed Work'
      };
    }
    return {
      ...fb,
      status: fb.status || 'Completed Work'
    };
  }).filter(Boolean);

  return [...customNewProjects, ...mergedFallbacks];
}
