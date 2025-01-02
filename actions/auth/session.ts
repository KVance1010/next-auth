// "use server";
// import prisma from "@/lib/dbConnection";

// export const getSessionById = async (id: string) => {
//     const session = await prisma.session.findFirst({
//       where: {
//         userId: id,
//       },
//     })
//     if (session) return session
//     return null
//   }