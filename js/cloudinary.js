/**
 * Cloudinary CDN Image Upload Engine with Base64 Data URL Fallback
 * Cloud Name: ku9okwip
 * Upload Preset: room107
 */

const CLOUDINARY_CONFIG = {
  cloudName: 'ku9okwip',
  uploadPreset: 'room107',
  uploadUrl: 'https://api.cloudinary.com/v1_1/ku9okwip/image/upload'
};

/**
 * Upload an image file to Cloudinary or convert to Base64 Data URL fallback
 * @param {File} file - Image file from file input
 * @returns {Promise<string>} Image URL or Base64 String
 */
async function uploadImageFile(file) {
  if (!file) return null;

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Cloudinary upload success:', data.secure_url);
      return data.secure_url;
    } else {
      console.warn('Cloudinary upload returned non-200 status, converting to Base64 fallback...', response.statusText);
      return await convertFileToBase64(file);
    }
  } catch (err) {
    console.warn('Cloudinary upload failed (network/CORS), falling back to Base64 Data URL:', err);
    return await convertFileToBase64(file);
  }
}

/**
 * Convert file to Base64 Data URL fallback
 * @param {File} file 
 * @returns {Promise<string>}
 */
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
