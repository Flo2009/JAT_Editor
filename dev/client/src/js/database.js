import { openDB } from 'idb';
import { header } from './header';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  console.log('PUT to the database');
  const jateDb = await openDB('jate', 1);
  const tx = jateDb.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  // const request = store.put( { jate: content });

  // Get all entries
  const entries = await store.getAll();

  if (entries.length > 0) {
    // If there's at least one entry, update the first one
    const firstEntryId = entries[0].id;
    const firstContent = entries[0].content;
    if (firstContent === ''){
      content=header;
    }
    await store.put({ id: firstEntryId, content });
    console.log('First entry updated in the database');
  } else {
    // If no entries exist, add a new one
    await store.add({ content: header });
    console.log('New entry added to the database');
  }
  // const result = await request;
  console.log('Data saved to the database', entries);
  // if (!result){
  //   console.error('putDb not implemented');
  // }else {
  //   console.log('Data saved to the database', result);
  // }
  await tx.done;
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  console.log('GET all from the database');
  const jateDb = await openDB('jate', 1);
  const tx = jateDb.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  const request = store.getAll();
  const result = await request;
  console.log('result.value', result);
  return result;
  // if (!result){
  //   console.error('getDb not implemented');
  // }else {
  // console.log('result.value', result);
  // return result;
  // }
};

initdb();
