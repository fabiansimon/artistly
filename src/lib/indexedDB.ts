export function openDatabase({
  dbName,
  dbVersion,
  storeName,
}: {
  dbName: string;
  dbVersion: number;
  storeName: string;
}) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName, dbVersion);

    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName))
        db.createObjectStore(storeName, { keyPath: 'id' });
    };

    req.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    req.onerror = (event) => {
      reject(`Database error: ${(event.target as IDBOpenDBRequest).error}`);
    };
  });
}

export function storeAudioBlob({
  db,
  storeName,
  id,
  blob,
}: {
  db: IDBDatabase;
  storeName: string;
  id: string;
  blob: any;
}) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const req = objectStore.put({ id, blob });

    req.onsuccess = () => {
      resolve(true);
    };

    req.onerror = (event) => {
      reject(`Store error: ${(event.target as IDBOpenDBRequest).error}`);
    };
  });
}

export function fetchAudioBlob({
  db,
  storeName,
  id,
}: {
  db: IDBDatabase;
  storeName: string;
  id: string;
}) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(id);

    request.onsuccess = (event) => {
      const result = (event.target as IDBRequest).result;
      resolve(result ? result.blob : null);
    };

    request.onerror = (event) => {
      reject(`Retrieve error: ${(event.target as IDBRequest).error?.message}`);
    };
  });
}
