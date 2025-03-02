import prisma from '../utils/prisma';

export const createUser = async (username: string, password: string) => {
  return await prisma.user.create({
    data: {username, password},
  });
};

export const findUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({where: {username}});
};
