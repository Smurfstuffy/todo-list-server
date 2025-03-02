import prisma from '../utils/prisma';

export const saveToken = async (
  userId: number,
  refreshToken: string,
  accessToken: string,
) => {
  return await prisma.token.upsert({
    where: {userId},
    update: {refreshToken, accessToken},
    create: {userId, refreshToken, accessToken},
  });
};

export const findRefreshToken = async (refreshToken: string) => {
  return await prisma.token.findFirst({where: {refreshToken}});
};
