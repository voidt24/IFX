import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { database, usersCollectionName } from "./firebase.config";

export const handle_favs_watchlists = async (documentName, referenceOfClickedElement, state, fieldName, currentId) => {
  try {
    const document = doc(database, usersCollectionName, documentName);
    //reference of document 'documentName'(uid from activeUser) within 'users' colection
    const documentResult = await getDoc(document);

    if (documentResult.exists()) {
      //if we found the uid within users collection

      const dataSaved = documentResult.data();
      const IdWasAlreadySaved = IsValid(isElementInObject(dataSaved, fieldName, currentId));

      if (IdWasAlreadySaved) {
        deleteElementFromDocument(dataSaved, fieldName, currentId, document);
      } else {
        addElementToDocument(dataSaved, fieldName, currentId, referenceOfClickedElement, document, state);
      }
      return;
    }
    createDocumentWithNewElement(fieldName, currentId, referenceOfClickedElement, documentName, state);
  } catch (err) {
    throw err;
  }
};

const IsValid = (field) => {
  if (field !== null && field !== undefined && field !== false) {
    return true;
  }
  return false;
};

const isElementInObject = (dataSaved, fieldName, idToCheck) => {
  /* using the structure

  dataSaved = {    
    favs: [
      { id:1, name: "favorite 1", ... }, 
      { id:2, name: "favorite 2", ... }
    ],

    watchlists:[
      {id:1, name: "watchL 1", ... },
      {id:1, name: "watchL 2", ... }
    ]

  }*/

  if (!IsValid(dataSaved) || !IsValid(fieldName) || !IsValid(idToCheck)) return false;

  const valuesOfFieldNameFromDataSaved = Object.values(dataSaved[fieldName] || {});

  if (valuesOfFieldNameFromDataSaved) {
    const objectToUse = valuesOfFieldNameFromDataSaved.find((el) => el.id == idToCheck);

    const isIdInArray = Object.values(objectToUse || {}).includes(idToCheck);
    console.log(isIdInArray);
    return isIdInArray;
  }

  return false;
};
const deleteElementFromDocument = (dataSaved, fieldName, currentId, document) => {
  const newData = [...Object.values(dataSaved[fieldName]).filter((el) => el.id != currentId)];
  const updatedData = {};
  updatedData[fieldName] = newData;
  updateDoc(document, updatedData);
};

const createDocumentWithNewElement = (fieldName, currentId, referenceOfClickedElement, documentName, state) => {
  const newDataToSave = {};
  newDataToSave[fieldName] = [
    { id: currentId, mediatype: referenceOfClickedElement.current.dataset.mediatype, title: state.title, vote_average: state.vote, poster_path: state.poster, releaseDate: state.releaseDate },
  ];
  setDoc(doc(database, usersCollectionName, documentName), newDataToSave, { merge: true }); //'merge' was necessary to save in the document without replacing previous stored data
};

const addElementToDocument = (dataSaved, fieldName, currentId, referenceOfClickedElement, document, state) => {
  const newData = [
    ...Object.values(dataSaved[fieldName] || {}),
    { id: currentId, mediatype: referenceOfClickedElement.current.dataset.mediatype, title: state.title, vote_average: state.vote, poster_path: state.poster, releaseDate: state.releaseDate },
  ];

  const updatedData = {};
  updatedData[fieldName] = newData;
  updateDoc(document, updatedData);
};
