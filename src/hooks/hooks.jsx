import { collection, orderBy, query, where } from "firebase/firestore";
import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const tasksConverter = {
  toFirestore: (data) => data,
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      task: data.task || "",
      checked: data.checked || false,
      createdAt: data.createdAt || null,
      uid: data.uid || null,
      archivedAt: data.archivedAt || null,
    };
  },
};

export const useQuery = (auth, ref, sort) => {
  const [user] = useAuthState(auth);

  return useMemo(() => {
    if (!user || !ref) return null;
    return query(
      ref.withConverter(tasksConverter),
      where("uid", "==", user.uid),
      orderBy(sort)
    );
  }, [ref, user, sort]);
};

export const useTaskRef = (firestore, store) => {
  return useMemo(() => collection(firestore, store), [firestore, store]);
};
