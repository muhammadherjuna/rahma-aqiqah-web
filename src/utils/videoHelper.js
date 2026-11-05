// src/utils/videoHelper.js
/**
 * Utilitas Parser dan Embed Video Dokumentasi Syariat
 * Mendukung YouTube (Unlisted), Google Drive Video, Vimeo, dan Direct MP4/Cloud Storage
 */

export function parseVideoUrl(url) {
  if (!url || typeof url !== 'string') {
    return { type: 'none', embedUrl: '', label: 'Tidak ada video' };
  }

  const cleanUrl = url.trim();

  // 1. YouTube (youtube.com, youtu.be, shorts, embed)
  const ytMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      videoId: ytMatch[1],
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
      label: 'YouTube (Unlisted / Publik)',
      rawUrl: cleanUrl,
    };
  }

  // 2. Google Drive Video Preview
  const gdriveMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (gdriveMatch && gdriveMatch[1]) {
    return {
      type: 'gdrive',
      fileId: gdriveMatch[1],
      embedUrl: `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`,
      label: 'Google Drive Video',
      rawUrl: cleanUrl,
    };
  }

  // 3. Vimeo
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      videoId: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      label: 'Vimeo Video',
      rawUrl: cleanUrl,
    };
  }

  // 4. Direct Video file (MP4, WebM, Supabase Storage)
  const isDirectVideo =
    /\.(mp4|webm|mov|ogg)($|\?)/i.test(cleanUrl) ||
    cleanUrl.includes('/storage/v1/object/public/');

  if (isDirectVideo) {
    return {
      type: 'direct',
      srcUrl: cleanUrl,
      label: 'File Video Cloud Langsung',
      rawUrl: cleanUrl,
    };
  }

  // 5. Fallback URL
  return {
    type: 'generic_link',
    rawUrl: cleanUrl,
    label: 'Tautan Video Eksternal',
  };
}
