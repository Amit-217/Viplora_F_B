import User, { UserRole } from '../modules/user/user.model.js';

export const generateCustomId = async (role: UserRole): Promise<string> => {
  const prefix = role === UserRole.ADMIN ? 'ADM' : role === UserRole.VOLUNTEER ? 'VOL' : 'USR';
  
  const lastUser = await User.findOne({ role }).sort({ createdAt: -1 });
  
  let nextNumber = 1;
  if (lastUser && lastUser.customId) {
    const match = lastUser.customId.match(/\d+/);
    if (match) {
      const lastNumber = parseInt(match[0], 10);
      nextNumber = lastNumber + 1;
    }
  }
  
  const paddedNumber = nextNumber.toString().padStart(4, '0');
  return `${prefix}-${paddedNumber}`;
};
