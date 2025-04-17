import { prisma } from "@/lib/prisma"

export const getUserOrders = async (userId: string) => {
  return await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })
}
