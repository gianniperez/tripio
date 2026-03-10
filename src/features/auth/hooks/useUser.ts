import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/types/tripio";

export const useUser = (uid: string | null | undefined) => {
  return useQuery({
    queryKey: ["user", uid],
    queryFn: async () => {
      if (!uid) return null;
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data() as User;
      }
      return null;
    },
    enabled: !!uid,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
