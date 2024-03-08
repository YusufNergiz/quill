import { z } from "zod";
import { procedure, router } from "../trpc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";

export const appRouter = router({
  auth: {
    authCallback: procedure.query(async () => {
      const { getUser } = getKindeServerSession();
      const currentUser: KindeUser | null = await getUser();

      if (!currentUser || !currentUser.email) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      } else {
        // check if the user is in the database
        console.log("Check if user in DB!!");
        const dbUser = await db.user.findFirst({
          where: {
            id: currentUser?.id,
          },
        });

        if (!dbUser) {
          // create user in db
          console.log("User not in DB!!");
          await db.user.create({
            data: {
              id: currentUser.id,
              email: currentUser.email,
            },
          });
        }
      }
      return { success: true };
    }),
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;
