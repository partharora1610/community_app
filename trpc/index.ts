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

  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { limit, cursor, fileId } = input;

      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      const messages = await db.message.findMany({
        where: {
          fileId,
        },
        take: limit ? limit + 1 : 11,
        skip: cursor ? 1 : 0,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (messages.length > 10) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor,
      };

      return { messages, nextCursor };
    }),

  deleteUserFile: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user, userId } = ctx;
      const { id } = input;

      const file = await db.file.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      await db.file.delete({
        where: {
          id,
        },
      });

      return;
    }),

  getFiles: privateProcedure
    .input(
      z.object({
        key: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      return file;
    }),
});

export type AppRouter = typeof appRouter;
