// src/components/VideoSyariatModal.jsx
import { X, ExternalLink, ShieldCheck, Film } from 'lucide-react';
import { parseVideoUrl } from '../utils/videoHelper';

export default function VideoSyariatModal({ videoUrl, namaAnak, onClose }) {
  if (!videoUrl) return null;

  const parsed = parseVideoUrl(videoUrl);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 text-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl my-auto border border-emerald-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gray-950 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Film size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-gray-100">
                Video Penyembelihan Syariat
              </h3>
              {namaAnak && (
                <p className="text-xs text-emerald-400">Ananda: {namaAnak}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {parsed.type === 'youtube' || parsed.type === 'gdrive' || parsed.type === 'vimeo' ? (
            <iframe
              src={parsed.embedUrl}
              title="Video Dokumentasi Penyembelihan Syariat"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : parsed.type === 'direct' ? (
            <video
              src={parsed.srcUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Browser Anda tidak mendukung pemutar video HTML5.
            </video>
          ) : (
            <div className="p-8 text-center">
              <Film size={40} className="mx-auto text-emerald-400 mb-3" />
              <p className="text-sm font-semibold mb-2">Tautan Video Eksternal</p>
              <a
                href={parsed.rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                Buka Video di Tab Baru <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>

        {/* Footer info syariat */}
        <div className="px-5 py-3 bg-gray-950/80 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck size={16} />
            <span>Penyembelihan sah secara syariat dengan pembacaan Bismillah Allahu Akbar</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-gray-300 hover:text-white px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
