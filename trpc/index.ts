import { currentUser } from "@clerk/nextjs";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import * as z from "zod";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const user = await currentUser();

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not logged in",
      });
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.emailAddresses[0].emailAddress,
        },
      });
    }

    return { success: true };
  }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const files = await db.file.findMany({
      where: {
        userId,
      },
    });

    return files;
  }),

  // deleteUserFile: privateProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const { user, userId } = ctx;
  //     const { id } = input;

  //     const file = await db.file.findFirst({
  //       where: {
  //         id,
  //         userId,
  //       },
  //     });

  //     if (!file) {
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "File not found",
  //       });
  //     }

  //     await db.file.delete({
  //       where: {
  //         id,
  //       },
  //     });

  //     return;
  //   }),
});

export type AppRouter = typeof appRouter;
