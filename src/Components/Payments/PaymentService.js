import { collection, doc, getDoc, getDocs, query, runTransaction, serverTimestamp, where } from "firebase/firestore";
import { db } from "../../services/firebase";

export async function addPayment(customerId, amount) {
    const customerRef = doc(db, "customers", customerId);
    const paymentRef = doc(collection(db, "payments"));
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
            const balances = balancesDoc.exists() ? balancesDoc.data() : {};

            // Create the payment
            transaction.set(paymentRef, {
                customerId,
                customerName: `${customer.name} ${customer.surname}`,
                amount,
                createdAt: serverTimestamp(),
                voided: false,
                replaces: null,
                replacedBy: null,
                voidedReason: null
            });

            // Update customer's balance
            transaction.update(customerRef, {
                balance: customer.balance - amount,
                updatedAt: serverTimestamp()
            });

            // Update global balance
            transaction.update(customerBalancesRef, {
                totalOwed: (balances.totalOwed || 0) - amount
            });
        });

        console.log("Payment successfully added");
        return paymentRef.id;
    } catch (error) {
        console.error("Failed to add payment:", error);
        throw error;
    }
}


export async function getPayments(isAuditMode) {
  const acivePaymentsQuery = query(
    collection(db, "payments"),
    where("voided","==", false)
  );
  const allPaymentsRef = collection(db, "payments")
    
  try {
    const snapshot = await getDocs(isAuditMode ? allPaymentsRef: acivePaymentsQuery);
    const payments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return payments;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}

export async function getPaymentById(paymentId) {
  const paymentRef = doc(db, "payments", paymentId);

  try {
    const snapshot = await getDoc(paymentRef);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    } else {
      console.warn("No such payment found");
      return null;
    }
  } catch (error) {
    console.error("Error getting payment:", error);
    throw error;
  }
}

export async function getPaymentByCustomerId(customerId, isAuditMode){
    const acivePaymentsQuery = query(
        collection(db,"payments"),
        where("customerId","==",customerId),
        where("voided", "==", false)
    )

    const allPaymentQuery = query(
        collection(db,"payments"),
        where("customerId","==", customerId)
    )

    try {
        const customerPaymentsSnapshot = await getDocs(isAuditMode ? allPaymentQuery : acivePaymentsQuery)
        const customerPayments = customerPaymentsSnapshot.docs.map(payment => {
            return {
                id:payment.id,
                ...payment.data()
            }
        })
        return customerPayments
    } catch (error) {
        console.error(error)
        return []
    }
}

export async function editPayment({ oldId, customerId, newAmount }) {
    if (typeof newAmount !== 'number' || isNaN(newAmount) || newAmount < 0) {
        throw new Error("Invalid amount");
    }

    const olderPaymentRef = doc(db, "payments", oldId);
    const customerRef = doc(db, "customers", customerId);
    const newPaymentRef = doc(collection(db, "payments"));
    const customerBalancesRef = doc(db, "meta", "balances");

    try {
        await runTransaction(db, async (transaction) => {
            const olderPaymentDoc = await transaction.get(olderPaymentRef);
            const customerDoc = await transaction.get(customerRef);
            const balancesDoc = await transaction.get(customerBalancesRef);

            if (!olderPaymentDoc.exists()) {
                throw new Error("The payment no longer exists");
            }

            const olderPayment = olderPaymentDoc.data();
            if (olderPayment.voided) {
                throw new Error("The payment is voided");
            }

            if (!customerDoc.exists()) {
                throw new Error("Customer does not exist");
            }

            const customer = customerDoc.data();
            if (customer.deleted) {
                throw new Error("Customer has been deleted");
            }

            const balanceData = balancesDoc.data();
            const delta = newAmount - olderPayment.amount;

            transaction.update(olderPaymentRef, {
                voided: true,
                replacedBy: newPaymentRef.id,
                voidedReason: "replaced"
            });

            transaction.set(newPaymentRef, {
                customerId,
                customerName: `${customer.name} ${customer.surname}`,
                amount: newAmount,
                createdAt: serverTimestamp(),
                voided: false,
                replaces: olderPaymentRef.id,
                replacedBy: null
            });

            transaction.update(customerRef, {
                balance: customer.balance - delta,
                updatedAt: serverTimestamp()
            });

            transaction.update(customerBalancesRef, {
                totalOwed: (balanceData.totalOwed || 0) - delta
            });
        });

        return newPaymentRef.id;
    } catch (error) {
        console.error("editPayment failed:", error);
        throw error;
    }
}


export async function reversePayment(paymentId) {
    const paymentRef = doc(db, "payments", paymentId);
    const customerBalancesRef = doc(db, "meta", "balances");

    const paymentDoc = await getDoc(paymentRef);
    const payment = paymentDoc.data();

    if (!paymentDoc.exists() || payment.voided) {
        throw new Error("Payment doesn't exist or is already voided");
    }

    await runTransaction(db, async (transaction) => {
        const customerRef = doc(db, "customers", payment.customerId);
        const customerDoc = await transaction.get(customerRef);

        if (!customerDoc.exists()) {
            throw new Error("Customer does not exist");
        }

        const customer = customerDoc.data();
        if (customer.deleted) {
            throw new Error("Customer has been deleted");
        }

        const balancesDoc = await transaction.get(customerBalancesRef);
        const balances = balancesDoc.exists() ? balancesDoc.data() : {};

        // Void the payment
        transaction.update(paymentRef, {
            voided: true,
            voidedReason: "reversal"
        });

        // Update customer's balance
        transaction.update(customerRef, {
            balance: customer.balance + payment.amount,
            updatedAt: serverTimestamp()
        });

        // Update global balance
        transaction.update(customerBalancesRef, {
            totalOwed: (balances.totalOwed || 0) + payment.amount
        });
    });

    console.log("Payment reversed:", paymentId);
}
