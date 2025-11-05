'use client';

import { useState, useEffect } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { downloadQRCode, downloadQRCodeSVG, getQRCodeOptions } from '@/libs/qrcode';
import toast from 'react-hot-toast';

export default function QRCodeDisplay({ url, shortCode }) {
  const [qrFormat, setQrFormat] = useState('canvas'); // 'canvas' or 'svg'
  const [qrSize, setQrSize] = useState(256);

  useEffect(() => {
    // Adjust QR size based on screen size
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setQrSize(200);
      } else {
        setQrSize(256);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = () => {
    try {
      if (qrFormat === 'canvas') {
        downloadQRCode(shortCode);
      } else {
        downloadQRCodeSVG(shortCode);
      }
      toast.success('QR code downloaded!');
    } catch (error) {
      toast.error('Failed to download QR code');
      console.error('Download error:', error);
    }
  };

  const qrOptions = getQRCodeOptions({ size: qrSize });

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body items-center text-center">
        <h3 className="card-title text-sm text-base-content/60 mb-4">QR Code</h3>

        {/* QR Code Display */}
        <div className="bg-white p-4 rounded-lg">
          {qrFormat === 'canvas' ? (
            <QRCodeCanvas
              id="qr-code-canvas"
              value={url}
              size={qrOptions.size}
              level={qrOptions.level}
              bgColor={qrOptions.bgColor}
              fgColor={qrOptions.fgColor}
              includeMargin={qrOptions.includeMargin}
            />
          ) : (
            <QRCodeSVG
              id="qr-code-svg"
              value={url}
              size={qrOptions.size}
              level={qrOptions.level}
              bgColor={qrOptions.bgColor}
              fgColor={qrOptions.fgColor}
              includeMargin={qrOptions.includeMargin}
            />
          )}
        </div>

        {/* Format Toggle */}
        <div className="form-control mt-4">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-base-content/60">Format:</span>
            <div className="join">
              <button
                className={`btn btn-sm join-item ${qrFormat === 'canvas' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setQrFormat('canvas')}
              >
                PNG
              </button>
              <button
                className={`btn btn-sm join-item ${qrFormat === 'svg' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setQrFormat('svg')}
              >
                SVG
              </button>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button onClick={handleDownload} className="btn btn-primary btn-sm mt-2 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download QR Code
        </button>

        <p className="text-xs text-base-content/60 mt-4">
          Scan this QR code to open the short URL
        </p>
      </div>
    </div>
  );
}
