import { collection, doc, getDoc, getDocs, query, runTransaction, serverTimestamp, where } from "firebase/firestore";
import { db } from "../../services/firebase";

export async function addOrder(customerId, items, total) {
    const customerRef = doc(db, "customers", customerId);
    const orderRef = doc(collection(db, "orders"));
    const customerBalancesRef = doc(db, "meta", "balances");

    try {
        await runTransaction(db, async (transaction) => {
            const customerDoc = await transaction.get(customerRef);
            if (!customerDoc.exists()) {
                throw new Error("Customer does not exist");
            }

            const customer = customerDoc.data();
            if (customer.deleted) {
                throw new Error("Customer has been deleted");
            }

            const balancesDoc = await transaction.get(customerBalancesRef);
            const balances = balancesDoc.data() || {};

            // Create the order
            transaction.set(orderRef, {
                customerId,
                customerName: `${customer.name} ${customer.surname}`,
                items,
                total,
                createdAt: serverTimestamp(),
                voided: false,
                replaces: null,
                replacedBy: null,
                voidedReason: null
            });

            // Update the customer's balance
            transaction.update(customerRef, {
                balance: customer.balance + total,
                updatedAt: serverTimestamp()
            });

            // Update the global total owed
            transaction.update(customerBalancesRef, {
                totalOwed: (balances.totalOwed || 0) + total
            });
        });

        console.log("Order successfully added");
        return orderRef.id;
    } catch (error) {
        console.error("Failed to add order:", error);
        throw error;
    }
}


export async function getOrders(isAuditMode) {
  const activeOrdersQuery = query(
    collection(db,"orders"),
    where("voided","==",false)
  )
  const ordersRef = collection(db, "orders");
  try {
    const snapshot = await getDocs(isAuditMode ? ordersRef : activeOrdersQuery);
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function getOrderById(orderId) {
  const orderRef = doc(db, "orders", orderId);

  try {
    const snapshot = await getDoc(orderRef);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    } else {
      console.warn("No such order found");
      return null;
    }
  } catch (error) {
    console.error("Error getting order:", error);
    throw error;
  }
}

export async function getOrdersByCustomerId(customerId, isAuditMode){
    const aciveOrderQuery = query(
        collection(db,"orders"),
        where("customerId","==",customerId),
        where("voided", "==", false)
    )
    const allOrderQuery = query(
        collection(db,"orders"),
        where("customerId","==",customerId),
    )

    try {
        const customerOrdersSnapshot = await getDocs(isAuditMode ?allOrderQuery :aciveOrderQuery)
        const customerOrders = customerOrdersSnapshot.docs.map(order => ({
            id:order.id,
            ...order.data()
        }))
        return customerOrders
    } catch (error) {
        console.error(error)
        return []
    }
}

export async function editOrder({ oldId, customerId, items, total }) {
    if (typeof total !== 'number' || isNaN(total) || total < 0) {
        throw new Error("Invalid total amount");
    }

    const olderOrderRef = doc(db, "orders", oldId);
    const customerRef = doc(db, "customers", customerId);
    const newOrderRef = doc(collection(db, "orders"));
    const customerBalancesRef = doc(db, "meta", "balances");

    try {
        await runTransaction(db, async (transaction) => {
            const olderOrderDoc = await transaction.get(olderOrderRef);
            const customerDoc = await transaction.get(customerRef);
            const balancesDoc = await transaction.get(customerBalancesRef);

            if (!olderOrderDoc.exists()) {
                throw new Error("The original order does not exist");
            }

            const olderOrder = olderOrderDoc.data();
            if (olderOrder.voided) {
                throw new Error("The original order has already been voided");
            }

            if (!customerDoc.exists()) {
                throw new Error("Customer does not exist");
            }

            const customer = customerDoc.data();
            if (customer.deleted) {
                throw new Error("Customer has been deleted");
            }

            const balances = balancesDoc.data();
            const delta = total - olderOrder.total;

            transaction.update(olderOrderRef, {
                voided: true,
                replacedBy: newOrderRef.id,
                voidedReason: "replaced"
            });

            transaction.set(newOrderRef, {
                customerId,
                customerName: `${customer.name} ${customer.surname}`,
                items,
                total,
                createdAt: serverTimestamp(),
                voided: false,
                replaces: olderOrderRef.id,
                replacedBy: null,
                voidedReason: null
            });

            transaction.update(customerRef, {
                balance: customer.balance + delta,
                updatedAt: serverTimestamp()
            });

            transaction.update(customerBalancesRef, {
                totalOwed: (balances.totalOwed || 0) + delta
            });
        });

        console.log("Edited order successfully");
        return newOrderRef.id;
    } catch (error) {
        console.error("editOrder failed:", error);
        throw error;
    }
}


export async function reverseOrder(orderId) {
    const orderRef = doc(db, "orders", orderId);
    const customerBalancesRef = doc(db, "meta", "balances");

    try {
        await runTransaction(db, async (transaction) => {
            const orderDoc = await transaction.get(orderRef);

            if (!orderDoc.exists()) {
                throw new Error("Order does not exist");
            }

            const order = orderDoc.data();
            if (order.voided) {
                throw new Error("Order is already voided");
            }

            const customerRef = doc(db, "customers", order.customerId);
            const customerDoc = await transaction.get(customerRef);

            if (!customerDoc.exists()) {
                throw new Error("Customer does not exist");
            }

            const customer = customerDoc.data();
            if (customer.deleted) {
                throw new Error("Customer has been deleted");
            }

            const balancesDoc = await transaction.get(customerBalancesRef);
            const balances = balancesDoc.data();

            // Mark the order as voided
            transaction.update(orderRef, {
                voided: true,
                voidedReason: "reversal"
            });

            // Decrease customer's balance
            transaction.update(customerRef, {
                balance: customer.balance - order.total,
                updatedAt: serverTimestamp()
            });

            // Update total owed
            transaction.update(customerBalancesRef, {
                totalOwed: (balances.totalOwed || 0) - order.total
            });
        });

        console.log("Order reversed successfully");
    } catch (error) {
        console.error("Failed to reverse order:", error);
        throw error;
    }
}
