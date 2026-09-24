import React, { useRef, useState } from 'react';
import { Download, Sparkles, X, Check, Copy } from 'lucide-react';

interface SamSatLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  customSize?: number;
  className?: string;
  showDownloadOnHover?: boolean;
  withGlow?: boolean;
  onClick?: () => void;
}

export const SamSatLogo: React.FC<SamSatLogoProps> = ({
  size = 'md',
  customSize,
  className = '',
  showDownloadOnHover = false,
  withGlow = true,
  onClick,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Dimension mapping
  const sizePx = customSize || {
    xs: 28,
    sm: 38,
    md: 48,
    lg: 72,
    xl: 110,
    '2xl': 180,
    custom: 48,
  }[size];

  // Function to download as Transparent PNG
  const downloadPng = (resolution: number = 1024) => {
    setDownloading(true);
    try {
      const svgElement = svgRef.current;
      if (!svgElement) return;

      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = resolution;
        canvas.height = resolution;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Clear canvas to ensure 100% transparent background
        context.clearRect(0, 0, resolution, resolution);
        context.drawImage(image, 0, 0, resolution, resolution);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `samsat-transparent-logo-${resolution}x${resolution}.png`;
        downloadLink.href = pngUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(blobURL);
        setDownloading(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      };
      image.src = blobURL;
    } catch (err) {
      console.error('Error generating PNG:', err);
      setDownloading(false);
    }
  };

  // Function to download as raw SVG
  const downloadSvg = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const downloadLink = document.createElement('a');
    downloadLink.download = 'samsat-logo-vector.svg';
    downloadLink.href = URL.createObjectURL(svgBlob);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <>
      <div
        className={`relative inline-flex items-center justify-center select-none group cursor-pointer ${className}`}
        style={{ width: sizePx, height: sizePx }}
        onClick={() => {
          if (onClick) {
            onClick();
          } else if (showDownloadOnHover) {
            setShowModal(true);
          }
        }}
        title="شعار سام سات الرسمي (SAM SAT) - انقر للمعاينة والتحميل بدقة عالية مفرغ"
      >
        {/* Soft Radial Ambient Glow */}
        {withGlow && (
          <div
            className="absolute inset-0 rounded-full bg-amber-400/20 blur-md pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60"
            style={{ transform: 'scale(1.15)' }}
          />
        )}

        {/* Vector SVG Emblem */}
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 500"
          className="w-full h-full relative z-10 transition-transform duration-300 group-hover:scale-105"
          fill="none"
        >
          <defs>
            <linearGradient id="goldMetallic_react" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCEBA4" />
              <stop offset="22%" stopColor="#D4AF37" />
              <stop offset="48%" stopColor="#FFF2B2" />
              <stop offset="75%" stopColor="#AA771C" />
              <stop offset="100%" stopColor="#E5C158" />
            </linearGradient>

            <linearGradient id="goldBright_react" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#FFF7CC" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>

            <linearGradient id="goldDeep_react" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#F5DE88" />
              <stop offset="50%" stopColor="#C59B27" />
              <stop offset="100%" stopColor="#8C6313" />
            </linearGradient>

            <filter id="goldGlow_react" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#D4AF37" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Outer Double Golden Circular Ring */}
          <circle cx="250" cy="250" r="232" stroke="url(#goldMetallic_react)" strokeWidth="7" filter="url(#goldGlow_react)" />
          <circle cx="250" cy="250" r="222" stroke="url(#goldBright_react)" strokeWidth="1.8" opacity="0.85" />

          {/* SATELLITE DISH & SIGNAL WAVES */}
          <g filter="url(#goldGlow_react)">
            {/* Pedestal Stand */}
            <path d="M 216 226 L 254 226 L 250 231 L 220 231 Z" fill="url(#goldDeep_react)" />
            <path d="M 226 226 L 235 204 L 244 204 L 246 226 Z" fill="url(#goldMetallic_react)" />
            <path d="M 233 204 L 247 204 L 244 196 L 230 196 Z" fill="url(#goldBright_react)" />

            {/* Satellite Parabolic Bowl */}
            <path
              d="M 204 186 C 196 156, 218 130, 252 128 C 272 126, 290 137, 296 153 C 286 142, 268 135, 248 137 C 220 140, 203 162, 208 186 Z"
              fill="url(#goldBright_react)"
            />
            <ellipse
              cx="252"
              cy="164"
              rx="46"
              ry="24"
              transform="rotate(-30 252 164)"
              stroke="url(#goldMetallic_react)"
              strokeWidth="5.5"
              fill="none"
            />
            <ellipse
              cx="252"
              cy="164"
              rx="42"
              ry="20"
              transform="rotate(-30 252 164)"
              stroke="url(#goldDeep_react)"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />

            {/* Feedhorn and Arm */}
            <line x1="250" y1="166" x2="276" y2="136" stroke="url(#goldMetallic_react)" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="228" y1="178" x2="276" y2="136" stroke="url(#goldMetallic_react)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="276" cy="136" r="4.5" fill="url(#goldBright_react)" />
            <path d="M 273 133 L 282 126 L 286 130 L 278 138 Z" fill="url(#goldMetallic_react)" />

            {/* 3 Radiating Signal Waves */}
            <path d="M 288 126 C 293 121, 298 120, 303 124" stroke="url(#goldBright_react)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 293 118 C 302 110, 310 110, 317 116" stroke="url(#goldMetallic_react)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
            <path d="M 298 110 C 312 98, 323 100, 332 108" stroke="url(#goldBright_react)" strokeWidth="3.8" strokeLinecap="round" fill="none" />

            {/* 4-Point Stars & Sparkles */}
            <path d="M 188 152 Q 188 160 196 160 Q 188 160 188 168 Q 188 160 180 160 Q 188 160 188 152 Z" fill="url(#goldBright_react)" />
            <circle cx="196" cy="138" r="2.2" fill="url(#goldBright_react)" />
            <path d="M 334 162 Q 334 168 340 168 Q 334 168 334 174 Q 334 168 328 168 Q 334 168 334 162 Z" fill="url(#goldBright_react)" />
            <circle cx="342" cy="144" r="1.8" fill="url(#goldBright_react)" />
          </g>

          {/* BRAND NAME: SAM SAT */}
          <g filter="url(#goldGlow_react)">
            <text
              x="250"
              y="278"
              textAnchor="middle"
              fontFamily="'Times New Roman', 'Cinzel', 'Georgia', serif"
              fontSize="49"
              fontWeight="900"
              letterSpacing="5"
              fill="url(#goldMetallic_react)"
            >
              SAM SAT
            </text>
          </g>

          {/* SUBTITLE: PREMIUM SATELLITE SOLUTIONS */}
          <text
            x="250"
            y="307"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', 'Arial', sans-serif"
            fontSize="13.2"
            fontWeight="700"
            letterSpacing="3.2"
            fill="url(#goldBright_react)"
          >
            PREMIUM SATELLITE SOLUTIONS
          </text>

          {/* DIVIDER & 4-POINT STAR */}
          <line x1="168" y1="324" x2="234" y2="324" stroke="url(#goldMetallic_react)" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M 250 318 L 253.5 324 L 259 324 L 254.5 327 L 256.5 332 L 250 328.5 L 243.5 332 L 245.5 327 L 241 324 L 246.5 324 Z"
            fill="url(#goldBright_react)"
          />
          <line x1="266" y1="324" x2="332" y2="324" stroke="url(#goldMetallic_react)" strokeWidth="1.8" strokeLinecap="round" />

          {/* PHONE NUMBER: • 71186492 • */}
          <g filter="url(#goldGlow_react)">
            <text
              x="250"
              y="367"
              textAnchor="middle"
              fontFamily="'JetBrains Mono', 'Plus Jakarta Sans', monospace"
              fontSize="30"
              fontWeight="800"
              letterSpacing="4"
              fill="url(#goldMetallic_react)"
            >
              • 71186492 •
            </text>
          </g>
        </svg>

        {/* Optional Quick Download Icon on Hover for larger sizes */}
        {showDownloadOnHover && sizePx >= 48 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="absolute -bottom-1 -right-1 z-20 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            title="تحميل الشعار المفرغ"
          >
            <Download className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* High-Resolution Modal / Transparent Asset Exporter */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-center space-y-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                شعار سام سات الرسمي المفرغ
              </span>
              <h3 className="text-lg font-bold text-white">SAM SAT Brand Assets</h3>
              <p className="text-xs text-slate-400">
                الشعار مفرغ بالكامل بدون خلفية (Transparent PNG &amp; Vector SVG) جاهز للاستخدام في موقعك، بروفايل الواتساب، والفواتير.
              </p>
            </div>

            {/* Logo Big Preview on Checkerboard (Proving Transparency) */}
            <div
              className="mx-auto rounded-2xl p-6 relative flex items-center justify-center border border-slate-700/80 shadow-inner"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, #161e2e 25%, transparent 25%), linear-gradient(-45deg, #161e2e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #161e2e 75%), linear-gradient(-45deg, transparent 75%, #161e2e 75%)',
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                backgroundColor: '#0d131f',
              }}
            >
              <div className="w-48 h-48">
                {/* SVG Instance for download */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 500 500"
                  className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)]"
                  fill="none"
                >
                  <use href="#goldMetallic_react" />
                  <circle cx="250" cy="250" r="232" stroke="#FCEBA4" strokeWidth="7" />
                  <circle cx="250" cy="250" r="222" stroke="#D4AF37" strokeWidth="1.8" />
                  <ellipse cx="252" cy="164" rx="46" ry="24" transform="rotate(-30 252 164)" stroke="#FCEBA4" strokeWidth="5.5" fill="none" />
                  <line x1="250" y1="166" x2="276" y2="136" stroke="#D4AF37" strokeWidth="3.5" />
                  <circle cx="276" cy="136" r="4.5" fill="#FFF7CC" />
                  <path d="M 288 126 C 293 121, 298 120, 303 124" stroke="#FFF7CC" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  <path d="M 293 118 C 302 110, 310 110, 317 116" stroke="#D4AF37" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  <path d="M 298 110 C 312 98, 323 100, 332 108" stroke="#FFF7CC" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                  <text x="250" y="278" textAnchor="middle" fontFamily="Times New Roman, serif" fontSize="49" fontWeight="900" letterSpacing="5" fill="#FCEBA4">
                    SAM SAT
                  </text>
                  <text x="250" y="307" textAnchor="middle" fontFamily="sans-serif" fontSize="13.2" fontWeight="700" letterSpacing="3.2" fill="#FFF7CC">
                    PREMIUM SATELLITE SOLUTIONS
                  </text>
                  <line x1="168" y1="324" x2="234" y2="324" stroke="#D4AF37" strokeWidth="1.8" />
                  <path d="M 250 318 L 253.5 324 L 259 324 L 254.5 327 L 256.5 332 L 250 328.5 L 243.5 332 L 245.5 327 L 241 324 L 246.5 324 Z" fill="#FFF7CC" />
                  <line x1="266" y1="324" x2="332" y2="324" stroke="#D4AF37" strokeWidth="1.8" />
                  <text x="250" y="367" textAnchor="middle" fontFamily="monospace" fontSize="30" fontWeight="800" letterSpacing="4" fill="#FCEBA4">
                    • 71186492 •
                  </text>
                </svg>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => downloadPng(1024)}
                disabled={downloading}
                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {downloadSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>تحميل PNG مفرغ (1024px)</span>
              </button>

              <button
                onClick={downloadSvg}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all border border-slate-700"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>تحميل كملف SVG فيكتور</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              رقم التواصل والتحويل المعتمد للشعار: <span className="text-amber-400 font-bold">71186492</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
