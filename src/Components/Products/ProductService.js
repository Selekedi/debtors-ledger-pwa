import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../../services/firebase";

export async function addProduct(productData){
    const productsRef = collection(db, "products");

  try {
    const docRef = await addDoc(productsRef, {
      ...productData,
      deleted:false,
      updatedAt:serverTimestamp(),
      createdAt: serverTimestamp() // optional: add timestamp
    });
    console.log("Product added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

export async function getProducts(isDeleted = false){
    const productsQuery = query(
        collection(db, "products"),
        where("deleted","==", isDeleted)
      );
      try {
        const snapshot = await getDocs(productsQuery);
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        return products;
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
}

export async function getProductById(productId) {
  const productRef = doc(db, "products", productId);

  try {
    const snapshot = await getDoc(productRef);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    } else {
      console.warn("No such product found");
      return null;
    }
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
}

export async function editProduct(productId,newData){
    const productRef = doc(db,"products",productId)
    try {
      const productDoc = await getDoc(productRef)
      if(!productDoc.exists()){
        throw "Product doesnt exist"
      }
      await updateDoc(productRef, {
        ...newData,
        updatedAt:serverTimestamp()
      })
    } catch (error) {
      throw error
    }
}

export async function softDeleteProduct(productId){
  const productRef = doc(db,"products",productId)

  try {
    const productDoc = await getDoc(productRef)
    if(!productDoc.exists()){
      throw "Product doesnt exist"
    }
    await updateDoc(productRef, {
      deleted: true,
      updatedAt:serverTimestamp()
    })
  } catch (error) {
    throw error
  }
}
