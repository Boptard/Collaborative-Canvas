const userColors = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#F7B731',
  '#5F27CD',
  '#00D2D3',
  '#FF9FF3',
  '#54A0FF',
  '#48DBFB',
  '#FD79A8'
];

export const generateUserColor = (userId: string): string => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % userColors.length;
  return userColors[index];
};

export const generateObjectId = (): string => {
  return `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};