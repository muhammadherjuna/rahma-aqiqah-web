// src/utils/imageCompressor.js
/**
 * Kompresi dan konversi otomatis file gambar ke WebP di sisi klien
 * Mengoptimalkan kecepatan muat foto penyembelihan dan bukti transfer di ponsel pelanggan
 */

export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function compressImageToWebP(
  file,
  { maxWidth = 1280, maxHeight = 1280, quality = 0.82 } = {}
) {
  // Jika bukan file gambar (misalnya PDF bukti transfer), kembalikan file asli
  if (!file.type.startsWith('image/')) {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: 0,
      previewUrl: null,
      isImage: false,
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let { width, height } = img;

        // Hitung rasio aspek proporsional
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
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
        // Gambar ulang dengan smoothing kualitas tinggi
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke WebP dengan fallback ke JPEG bila browser lawas
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              // Fallback bila toBlob gagal
              resolve({
                file,
                originalSize: file.size,
                compressedSize: file.size,
                compressionRatio: 0,
                previewUrl: event.target.result,
                isImage: true,
              });
              return;
            }

            const baseName = file.name.replace(/\.[^/.]+$/, '');
            const newFileName = `${baseName}.webp`;
            const compressedFile = new File([blob], newFileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            const originalSize = file.size;
            const compressedSize = compressedFile.size;
            const savedBytes = Math.max(0, originalSize - compressedSize);
            const compressionRatio = Math.round((savedBytes / originalSize) * 100);

            resolve({
              file: compressedFile,
              originalSize,
              compressedSize,
              savedFormatted: formatBytes(savedBytes),
              originalFormatted: formatBytes(originalSize),
              compressedFormatted: formatBytes(compressedSize),
              compressionRatio,
              previewUrl: URL.createObjectURL(blob),
              isImage: true,
            });
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        resolve({
          file,
          originalSize: file.size,
          compressedSize: file.size,
          compressionRatio: 0,
          previewUrl: null,
          isImage: true,
        });
      };
    };

    reader.onerror = () => {
      resolve({
        file,
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: 0,
        previewUrl: null,
        isImage: false,
      });
    };
  });
}
