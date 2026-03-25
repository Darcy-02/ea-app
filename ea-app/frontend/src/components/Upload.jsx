import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, clearAuth } from "../api";
import toast from "react-hot-toast";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api("/api/auth/me").catch(() => { clearAuth(); navigate("/"); });
  }, [navigate]);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { toast.error("Images only"); return; }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error("Select an image"); return; }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      if (title.trim()) form.append("title", title.trim());
      if (description.trim()) form.append("description", description.trim());
      await api("/api/uploads", { method: "POST", body: form, isFormData: true });
      toast.success("Work published!");
      navigate("/feed");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32">
      <main className="max-w-3xl mx-auto px-4 md:px-8 pt-12">
        <div className="mb-10 border-b-4 border-[#FF4D00] pb-4">
          <h1 className="font-['Space_Grotesk'] font-black text-5xl md:text-6xl uppercase italic tracking-tighter">DROP_WORK</h1>
          <p className="font-['Space_Grotesk'] uppercase tracking-[0.3em] text-white/30 text-sm mt-2">PUBLISH YOUR MASTERWORK</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={"relative cursor-pointer border-4 border-dashed transition-all min-h-[300px] md:min-h-[400px] flex items-center justify-center overflow-hidden " +
              (dragOver ? "border-[#00e3fd] bg-[#00e3fd]/5" : preview ? "border-[#FF4D00] bg-[#0a0a0a]" : "border-[#FF4D00]/30 bg-[#0a0a0a] hover:border-[#FF4D00]")}
          >
            {preview ? (
              <>
                <img src={preview} className="max-w-full max-h-[500px] object-contain" />
                <div className="absolute top-4 right-4 bg-[#FF4D00] text-black px-4 py-2 font-['Space_Grotesk'] font-black uppercase text-sm -rotate-3">
                  READY
                </div>
                <button type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                  className="absolute top-4 left-4 bg-black/80 text-white w-10 h-10 flex items-center justify-center border-2 border-white/20 hover:border-[#FF4D00]">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </>
            ) : (
              <div className="text-center p-8">
                <span className="material-symbols-outlined text-7xl text-[#FF4D00]/30 mb-4 block">cloud_upload</span>
                <p className="font-['Space_Grotesk'] font-black text-2xl uppercase text-white/40">DROP YOUR ART HERE</p>
                <p className="font-mono text-xs text-white/20 mt-2">OR CLICK TO SELECT // JPG, PNG, GIF, WEBP</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          </div>

          <div className="space-y-6 bg-[#0a0a0a] border-4 border-[#FF4D00]/10 p-6">
            <div>
              <label className="font-['Space_Grotesk'] font-black uppercase text-xs tracking-[0.3em] text-[#FF4D00] mb-2 block">TITLE</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="NAME YOUR WORK..."
                className="w-full bg-[#1a1a1a] border-2 border-[#FF4D00]/20 text-white px-4 py-3 font-['Space_Grotesk'] uppercase placeholder:text-white/15 focus:border-[#FF4D00] focus:outline-none" />
            </div>
            <div>
              <label className="font-['Space_Grotesk'] font-black uppercase text-xs tracking-[0.3em] text-[#FF4D00] mb-2 block">DESCRIPTION</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="TELL THE STORY..."
                rows={4}
                className="w-full bg-[#1a1a1a] border-2 border-[#FF4D00]/20 text-white px-4 py-3 font-['Space_Grotesk'] placeholder:text-white/15 focus:border-[#FF4D00] focus:outline-none resize-none" />
            </div>
          </div>

          <button type="submit" disabled={!file || uploading}
            className="w-full bg-[#FF4D00] text-black py-5 font-['Space_Grotesk'] font-black text-2xl uppercase tracking-wider disabled:opacity-30 hover:bg-[#00e3fd] transition-colors shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
            {uploading ? "PUBLISHING..." : "PUBLISH"}
          </button>
        </form>
      </main>
    </div>
  );
}
