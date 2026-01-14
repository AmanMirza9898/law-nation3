// src/dto/user.dto.ts
import { prisma } from "@/db/db.js";

/**
 * UserDTO now returns multi-team memberships via teamMembers[]
 */


export type UserDTO = {
  id: string;
  name: string;
  email: string;
  roles: string[]; // role names
};

/**
 * Convert a userId -> UserDTO
 */
export const userIdToUserDTO = async (userId: string): Promise<UserDTO> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: { include: { role: true } },
    },
  });

  if (!user) throw new Error("User not found");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles.map((userRole) => userRole.role.name),
  };
};
