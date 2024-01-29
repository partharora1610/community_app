import { currentUser } from "@clerk/nextjs";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  authCallback: publicProcedure.query(() => {
    // const user = await currentUser();
    // if (!user) {
    //   throw new TRPCError({
    //     code: "UNAUTHORIZED",
    //     message: "You are not logged in",
    //   });
    // }

    // check if user is in the database

    return { success: true };
  }),
});

export type AppRouter = typeof appRouter;
