import React, { useState, useRef, useEffect } from 'react';
import { Upload, Crop, RotateCw, Check, X } from 'lucide-react';

export default function ImageCropper({ onImageCropped, currentImage }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  
  // Dragging and positioning state parameters
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
        setScale(1);
        setRotate(0);
        setPosition({ x: 0, y: 0 }); // Reset positions
      };
      reader.readAsDataURL(file);
    }
  };

  // --- MOUSE & TOUCH EVENT DRAG CAPTURE IMPLEMENTATION ---
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleApplyCrop = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
        // 1. Establish absolute target square dimensions (150x150)
        const targetSize = 150;
        const viewPortSize = 192; // Matches w-48 cropping ring
        
        canvas.width = targetSize;
        canvas.height = targetSize;
        
        // Clear background with crisp white fallback color fill
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetSize, targetSize);

        // 2. Shift rendering engine origin point precisely to the center of the canvas
        ctx.translate(targetSize / 2, targetSize / 2);
        ctx.rotate((rotate * Math.PI) / 180);

        // 3. Compute how the real image scales into the 192px visual box
        const imgRatio = img.width / img.height;
        let baseRenderWidth = viewPortSize;
        let baseRenderHeight = viewPortSize;

        if (imgRatio > 1) {
        baseRenderHeight = viewPortSize / imgRatio;
        } else {
        baseRenderWidth = viewPortSize * imgRatio;
        }

        // 4. Map the on-screen dragged position (offsets) to the export scale multiplier
        const conversionFactor = targetSize / viewPortSize;
        
        const dx = position.x * conversionFactor;
        const dy = position.y * conversionFactor;
        const dw = baseRenderWidth * conversionFactor * scale;
        const dh = baseRenderHeight * conversionFactor * scale;

        // 5. Draw the image offset by half its converted width/height to keep the anchor centered
        ctx.drawImage(img, dx - (dw / 2), dy - (dh / 2), dw, dh);
        
        // 6. Output clean compressed JPEG string directly to state pipeline
        const croppedBase64 = canvas.toDataURL('image/jpeg', 0.9);
        onImageCropped(croppedBase64);
        setSelectedFile(null); // Terminate overlay modal state
    };
    img.src = selectedFile;
    };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-slate-500 mb-1">Profile Identification Image</label>
      
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center flex-shrink-0 shadow-inner">
          {currentImage ? (
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Upload size={20} className="text-slate-400" />
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition border shadow-sm flex items-center gap-1.5"
        >
          <Upload size={14}/> Upload Photo
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>

      {/* MODAL CROP FRAME OVERLAY PANEL */}
      {selectedFile && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full border shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1"><Crop size={16}/> Adjust & Align Photo</h4>
              <button type="button" onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
            </div>

            {/* FIXED CROP VIEWPORT CONTAINER */}
            <div 
              className="relative w-full aspect-square bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border cursor-move select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
            >
              {/* Underneath image asset layer being dragged and scaled independently */}
              <div 
                ref={imageRef}
                className="absolute transition-transform duration-75 ease-out pointer-events-none"
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotate}deg)`,
                }}
              >
                <img src={selectedFile} alt="Source" className="max-w-xs max-h-xs object-contain" />
              </div>

              {/* FIXED CENTER CROPPING WINDOW WITH MASK OUTLINE */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Visual Circle Indicator Frame boundary box */}
                <div className="w-48 h-48 rounded-full border-4 border-white shadow-[0_0_0_9999px_rgba(15,23,42,0.6)] z-10"></div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center italic font-medium">💡 Drag inside the box to reposition. Use the slider below to zoom.</p>

            {/* Transformation Slider Controls */}
            <div className="space-y-3 text-xs pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-500 font-semibold font-mono">
                  <span>Zoom Level</span>
                  <span>{Math.round(scale * 100)}%</span>
                </div>
                <input type="range" min="1" max="3" step="0.05" value={scale} onChange={e => setScale(parseFloat(e.target.value))} className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="flex justify-between pt-1 gap-2">
                <button type="button" onClick={() => setRotate(r => r + 90)} className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl text-slate-600 font-bold transition">
                  <RotateCw size={12}/> Rotate 90°
                </button>
                <button type="button" onClick={handleApplyCrop} className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold transition shadow-md ml-auto">
                  <Check size={14}/> Save Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}