/**
 * Cloudinary CDN File & PDF Upload Engine with Auto-Compression & Base64 Fallback
 * Cloud Name: ku9okwip
 * Upload Preset: room107
 */

const CLOUDINARY_CONFIG = {
  cloudName: 'ku9okwip',
  uploadPreset: 'room107',
  uploadUrl: 'https://api.cloudinary.com/v1_1/ku9okwip/auto/upload'
};

/**
 * Auto Compress / Resize image file using HTML5 Canvas (High Quality, Low File Size)
 * Shrinks 5-15MB phone photos down to ~150-300KB with sharp readability
 * @param {File} file - Original image file from camera/file input
 * @param {number} maxWidth - Maximum width (default 1600px)
 * @param {number} maxHeight - Maximum height (default 1600px)
 * @param {number} quality - JPEG quality 0.0 - 1.0 (default 0.82)
 * @returns {Promise<File>} Compressed File object
 */
async function compressImageFile(file, maxWidth = 1600, maxHeight = 1600, quality = 0.82) {
  // If not an image (e.g. PDF), return original file without compression
  if (!file || !file.type || !file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Proportional aspect ratio scaling
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Clean white background for transparency conversion to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const cleanName = (file.name || 'image').replace(/\.[^/.]+$/, "") + ".jpg";
              const compressedFile = new File([blob], cleanName, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              console.log(`Auto Image Compressed: ${(file.size / 1024).toFixed(1)} KB -> ${(blob.size / 1024).toFixed(1)} KB (Saved ${Math.round((1 - blob.size / file.size) * 100)}%)`);
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = readerEvent.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Auto Compress & Optimize PDF file for lightweight storage in Firebase Realtime DB
 * Renders high-res PDF pages onto HTML5 Canvas, compresses each page to optimized JPEG,
 * and rebuilds a lightweight Deflate-compressed PDF.
 * Shrinks 5-15MB scanned PDFs down to ~150-400KB with crystal clear readability.
 * @param {File} file - Original PDF file
 * @param {number} maxDimension - Maximum pixel width/height (default 1400px)
 * @param {number} quality - JPEG compression quality (default 0.76)
 * @returns {Promise<string>} Compressed Base64 Data URL (data:application/pdf;base64,...)
 */
async function compressPdfFile(file, maxDimension = 1400, quality = 0.76) {
  if (!file) return null;

  // If not a PDF, convert directly to Base64
  const isPdf = (file.type === 'application/pdf') || (file.name && file.name.toLowerCase().endsWith('.pdf'));
  if (!isPdf) {
    return await convertFileToBase64(file);
  }

  // Small PDFs (under 250KB) are already compact, read directly
  if (file.size <= 250 * 1024) {
    console.log(`PDF already small (${(file.size / 1024).toFixed(1)} KB), skipping recompression.`);
    return await convertFileToBase64(file);
  }

  try {
    const arrayBuffer = await file.arrayBuffer();

    if (typeof window.pdfjsLib === 'undefined') {
      console.warn("pdfjsLib not available, falling back to original Base64.");
      return await convertFileToBase64(file);
    }

    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdfDoc.numPages;

    if (numPages === 0) {
      return await convertFileToBase64(file);
    }

    const compressedPages = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const unscaledViewport = page.getViewport({ scale: 1.0 });

      let scale = 1.0;
      const originalMaxDim = Math.max(unscaledViewport.width, unscaledViewport.height);
      if (originalMaxDim > maxDimension) {
        scale = maxDimension / originalMaxDim;
      } else if (originalMaxDim < 800) {
        scale = Math.min(1.8, 1200 / originalMaxDim);
      }

      const viewport = page.getViewport({ scale: scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      const ctx = canvas.getContext('2d', { alpha: false });
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise;

      const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
      compressedPages.push({
        dataUrl: jpegDataUrl,
        width: unscaledViewport.width,
        height: unscaledViewport.height
      });
    }

    // Rebuild lightweight compressed PDF using jsPDF
    if (typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF) {
      const { jsPDF } = window.jspdf;
      const firstPage = compressedPages[0];
      const orientation = firstPage.width >= firstPage.height ? 'landscape' : 'portrait';

      const doc = new jsPDF({
        orientation: orientation,
        unit: 'pt',
        format: [firstPage.width, firstPage.height],
        compress: true
      });

      compressedPages.forEach((p, idx) => {
        if (idx > 0) {
          const pageOrientation = p.width >= p.height ? 'landscape' : 'portrait';
          doc.addPage([p.width, p.height], pageOrientation);
        }
        doc.addImage(p.dataUrl, 'JPEG', 0, 0, p.width, p.height, undefined, 'FAST');
      });

      const compressedDataUrl = doc.output('datauristring');
      const approxCompressedBytes = Math.round((compressedDataUrl.length * 3) / 4);

      console.log(`Auto PDF Compressed: ${(file.size / 1024).toFixed(1)} KB -> ${(approxCompressedBytes / 1024).toFixed(1)} KB (${numPages} pages, Saved ${Math.max(0, Math.round((1 - approxCompressedBytes / file.size) * 100))}%)`);

      if (approxCompressedBytes < file.size) {
        return compressedDataUrl;
      }
    }

    return await convertFileToBase64(file);
  } catch (err) {
    console.warn("PDF compression failed, falling back to original Base64:", err);
    return await convertFileToBase64(file);
  }
}

/**
 * Upload router:
 * - PDF files: Auto-compressed and returned as Base64 Data URL for Firebase Realtime DB storage
 * - Image files: Auto-compressed with Canvas and uploaded to Cloudinary CDN
 * @param {File} file - File from input / camera
 * @returns {Promise<string>} Base64 Data URL (for PDF) or Cloudinary CDN URL (for images)
 */
async function uploadImageFile(file) {
  if (!file) return null;

  // 1. PDF File: Compress PDF and store as Base64 for Firebase Realtime DB
  const isPdf = (file.type === 'application/pdf') || (file.name && file.name.toLowerCase().endsWith('.pdf'));
  if (isPdf) {
    return await compressPdfFile(file);
  }

  // 2. Image File: Compress with Canvas and upload to Cloudinary CDN
  try {
    let uploadPayload = file;
    if (file.type && file.type.startsWith('image/')) {
      uploadPayload = await compressImageFile(file, 1600, 1600, 0.82);
    }

    const formData = new FormData();
    formData.append('file', uploadPayload);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Cloudinary image upload success:', data.secure_url);
      return data.secure_url;
    } else {
      console.warn('Cloudinary upload returned non-200, fallback to Base64:', response.statusText);
      return await convertFileToBase64(uploadPayload);
    }
  } catch (err) {
    console.warn('Cloudinary upload failed (network/CORS), fallback to Base64:', err);
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

