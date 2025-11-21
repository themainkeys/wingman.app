import React, { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface QrScannerProps {
  onClose: () => void;
  onScan: (data: string) => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Using a ref to track scanning state to prevent race conditions with unmounting
  const isScanningRef = useRef(true);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;
    
    // isMounted ref ensures we don't try to set state on an unmounted component
    const isMounted = { current: true };

    const startScan = async () => {
      // BarcodeDetector is experimental and may not exist on the window object in all environments
      // @ts-ignore
      if (!('BarcodeDetector' in window)) {
        if (isMounted.current) {
            setError('QR code scanning is not supported by this browser.');
            isScanningRef.current = false;
        }
        return;
      }

      try {
        // @ts-ignore
        const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
        
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          scanFrame(barcodeDetector);
        }
      } catch (err) {
        console.error("Camera access error:", err);
        if(isMounted.current) {
            setError('Could not access the camera. Please check permissions.');
            isScanningRef.current = false;
        }
      }
    };

    const scanFrame = async (barcodeDetector: any) => {
      if (!videoRef.current || videoRef.current.readyState < 2 || !isScanningRef.current) {
        if (isScanningRef.current) {
            animationFrameId = requestAnimationFrame(() => scanFrame(barcodeDetector));
        }
        return;
      }

      try {
        const barcodes = await barcodeDetector.detect(videoRef.current);
        if (barcodes.length > 0 && isScanningRef.current) {
          isScanningRef.current = false; // Stop further scanning immediately
          const scannedData = barcodes[0].rawValue;
          onScan(scannedData); // Pass data up to App.tsx
        }
      } catch (err) {
        console.error('Error during QR scan:', err);
        if (isMounted.current) {
            setError('An error occurred during scanning.');
        }
      }
      
      if (isScanningRef.current) {
        animationFrameId = requestAnimationFrame(() => scanFrame(barcodeDetector));
      }
    };

    const stopScan = () => {
        isScanningRef.current = false;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if(animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    }

    startScan();

    return () => {
      isMounted.current = false;
      stopScan();
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 animate-fade-in" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-md aspect-square p-4">
        <video ref={videoRef} className="w-full h-full object-cover rounded-lg" playsInline />
        {/* Scanning box overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
            <div className="w-full h-full border-4 border-dashed border-amber-400/50 rounded-lg animate-pulse"></div>
        </div>
      </div>
      
      <p className="text-center text-white mt-4">Point your camera at a QR code</p>

      {error && <p className="text-red-500 bg-red-900/50 p-3 rounded-md mt-4 max-w-sm text-center">{error}</p>}
      
      <button onClick={onClose} className="absolute top-6 right-6 bg-black/50 p-2 rounded-full text-white hover:bg-white/20 transition-colors" aria-label="Close scanner">
          <CloseIcon className="w-8 h-8" />
      </button>
    </div>
  );
};