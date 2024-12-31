export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
      const passwordResetToken = await prisma.passwordResetToken.findFirst({
        where: {
          email,
        },
      })
      return passwordResetToken
    } catch (error) {
      console.log(error)
      return null
    }
  }
  
  export const getPasswordResetTokenByToken = async (token: string) => {
    try {
      const passwordResetToken = await prisma.passwordResetToken.findFirst({
        where: {
          token,
        },
      })
      return passwordResetToken
    } catch (error) {
      console.log(error)
      return null
    }
  }
  