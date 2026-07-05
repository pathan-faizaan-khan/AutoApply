"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, Terminal, ToggleRight, FolderOpen, X, Chrome } from "lucide-react";
import { useEffect } from "react";

interface ExtensionOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExtensionOnboardingModal({ isOpen, onClose }: ExtensionOnboardingModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger download
      const link = document.createElement("a");
      link.href = "/auto-apply-extension.zip";
      link.download = "auto-apply-extension.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
        >
          <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-8 flex items-center gap-4 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-muted-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-border flex items-center justify-center shrink-0">
              <Chrome className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">Install Auto-Apply Extension</h2>
              <p className="text-muted-foreground mt-1 text-sm font-medium">Follow these 3 simple steps to activate the extension.</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black shrink-0">1</div>
              <div>
                <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-500" /> Extract the downloaded ZIP
                </h3>
                <p className="text-muted-foreground text-sm mt-1">We've just downloaded <span className="font-bold bg-muted px-1.5 py-0.5 rounded text-foreground">auto-apply-extension.zip</span> to your computer. Extract it to a folder.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black shrink-0">2</div>
              <div>
                <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-500" /> Open Chrome Extensions
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Open a new tab and go to <code className="font-bold bg-muted px-1.5 py-0.5 rounded text-foreground select-all">chrome://extensions/</code>. Then, enable <strong>Developer mode</strong> in the top right corner.
                </p>
                <div className="mt-3 bg-muted/50 p-3 rounded-xl border border-border flex items-center gap-3">
                  <ToggleRight className="w-6 h-6 text-emerald-500" />
                  <span className="text-sm font-bold">Developer mode</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black shrink-0">3</div>
              <div>
                <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-purple-500" /> Load Unpacked
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Click the <strong>Load unpacked</strong> button and select the folder you extracted in Step 1.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-border bg-muted/20 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm"
            >
              Done, I've installed it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
