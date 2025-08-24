const API_BASE_URL = 'http://localhost:5000';

export const getImageUrl = (localPath) => {
  if (!localPath) {
    return 'https://placehold.co/600x600'; // Fallback image
  }
  // This logic assumes your backend serves images from a folder mapped to '/images'
  // It correctly handles both Windows (\) and Linux (/) path separators.
  const filename = localPath.split(/[\\/]/).pop();
  return `${API_BASE_URL}/images/${filename}`;
};