import { addDoc, collection, doc, getDoc, getDocs, query, runTransaction, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../services/firebase";

export async function addCustomer(customerData){
    const customersRef = collection(db, "customers");
    
      try {
        const docRef = await addDoc(customersRef, {
          ...customerData,
          createdAt: serverTimestamp(), // optional: add timestamp
          updatedAt:serverTimestamp(),
          deleted:false,
          balance:0
        });
        console.log("Customer added with ID:", docRef.id);
        return docRef.id;
      } catch (error) {
        console.error("Error adding customer:", error);
        throw error;
      }
}

export async function getCustomers(isDeleted = false) {
  const customersQuery = query(
      collection(db, "customers"),
      where("deleted","==", isDeleted)
    );
  try {
    const snapshot = await getDocs(customersQuery);
    const customers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function getCustomerById(customerId) {
  const customerRef = doc(db, "customers", customerId);

  try {
    const snapshot = await getDoc(customerRef);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    } else {
      console.warn("No such customer found");
      return null;
    }
  } catch (error) {
    console.error("Error getting customer:", error);
    throw error;
  }
}



export async function editCustomer(customerId,newData){
    const customerRef = doc(db,"customers",customerId)
    try {
      const customerDoc = await getDoc(customerRef)
      if(!customerDoc.exists()){
        throw new Error("Customer doesnt exist")
      }
      await updateDoc(customerRef, {
        ...newData,
        updatedAt:serverTimestamp()
      })
    } catch (error) {
      throw error
    }
}

export async function softDeleteCustomer(customerId){
  const balancesRef = doc(db,"meta","balances")
  const customerRef = doc(db, "customers", customerId)
  const ordersQuery = query(
    collection(db, "orders"),
    where("customerId", "==",customerId),
    where("voided", "!=", true)
  )

  const paymentsQuery = query(
    collection(db, "payments"),
    where("customerId", "==",customerId),
    where("voided", "!=", true)
  )

  try {

    
    await runTransaction(db, async (transaction) => {
      const customerDoc = await transaction.get(customerRef)
      if(!customerDoc.exists()){
        throw new Error("Customer doesnt exist");
        
      }

      
      const customer = customerDoc.data()
      if(customer.deleted){
        throw new Error("Customer already deleted");
      }

      const balanceDoc = await transaction.get(balancesRef)
      const balance = balanceDoc.data()
      

      // Get and void all orders
      const ordersSnap = await getDocs(ordersQuery);
      ordersSnap.forEach((orderDoc) => {
        transaction.update(orderDoc.ref, { voided: true ,voidedReason:"customer deleted"});
      });

      // Get and void all payments
      const paymentsSnap = await getDocs(paymentsQuery);
      paymentsSnap.forEach((paymentDoc) => {
        transaction.update(paymentDoc.ref, { voided: true, voidedReason:"customer deleted" });
      });

      transaction.update(balancesRef, {
        totalOwed:balance.totalOwed - customer.balance
      })

      transaction.update(customerRef, {
        deleted:true,
        updatedAt:serverTimestamp()
      })

    })
  } catch (error) {
    throw error
  }
}

export async function restoreCustomer(customerId){
  const customerRef = doc(db,"customers",customerId)
  const balancesRef = doc(db,"meta","balances")

  const ordersQuery = query(
    collection(db,"orders"),
    where("customerId", '==',customerId),
    where("voidedReason","==", "customer deleted")
  )
  const paymentsQuery = query(
    collection(db,"payments"),
    where("customerId", '==',customerId),
    where("voidedReason","==", "customer deleted")
  )

  try {
    await runTransaction(db, async (transaction) => {
      const customerDoc = await transaction.get(customerRef)
      if(!customerDoc.exists()){
        throw new Error("Customer is doesnt exist");
      }

      const customer = customerDoc.data()
      if(!customer.deleted){
        throw new Error("Cant restore a customer that is not deleted");
      }

      const balanceDoc = await transaction.get(balancesRef)
      const balance = balanceDoc.data()


      const ordersSnapshot = await getDocs(ordersQuery)
      ordersSnapshot.forEach(doc => {
        transaction.update(doc.ref,{voided:false, voidedReason:null})
      })

      const paymentsSnapshot = await getDocs(paymentsQuery)
      paymentsSnapshot.forEach(doc => {
        transaction.update(doc.ref,{voided:false, voidedReason:null})
      })

      
      transaction.update(balancesRef, {
        totalOwed:balance.totalOwed + customer.balance
      })

      transaction.update(customerRef, {
        deleted:false,
        updatedAt:serverTimestamp()
      })
      
    })
  } catch (error) {
    throw error
  }
}

export async function recalculateTotalOwed(){
  const customersQuery = query(
      collection(db,"customers"),
      where("deleted","==",false)
    )
  try {
    const customersDocs = await getDocs(customersQuery)
    let total = 0
    customersDocs.forEach(doc => {
      const data =  doc.data()
      console.log(data)
      total += data.balance || 0
    })
    
    await setDoc(doc(db, "meta", "balances"), { totalOwed: total }, { merge: true })

  } catch (error) {
    throw error
  }
}

/*

WAS FIXING AN ERROR WITH DELETION OF A CUSTOMER
async function fix(){
  const paymentsQuery = query(
    collection(db,"payments"),
    where("replacedBy","!=",null)
  )

  const ordersQuery = query(
    collection(db,"orders"),
    where("replacedBy","!=",null)
  )

  try {
    const orderDocs = await getDocs(ordersQuery)
    orderDocs.forEach(async doc => await updateDoc(doc.ref, {
      voided:true,
      voidedReason:"replaced"
    }))

    const paymentDocs = await getDocs(paymentsQuery)
    paymentDocs.forEach(async doc => await updateDoc(doc.ref, {
      voided:true,
      voidedReason:"replaced"
    }))
    console.log("fixed part of the issue with customers")
  } catch (error) {
    console.error(error)
  }
}

*/
