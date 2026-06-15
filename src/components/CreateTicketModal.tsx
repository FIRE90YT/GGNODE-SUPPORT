"use client";

import { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Image as ImageIcon, FileText, Video, Mic, Send, File as FileIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createTicketAction } from "@/app/actions/tickets";

export default function CreateTicketModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("modal") === "create-ticket";

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.push(`?${params.toString()}`);
    // Reset state after closing
    setTimeout(() => {
      setSelectedFiles([]);
      setErrorMsg("");
      if (formRef.current) formRef.current.reset();
    }, 300);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    // Note: This won't update the actual hidden file input's FileList, 
    // but for this simple UI preview it's fine. In a real app we'd use FormData append.
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    
    // Create new FormData and append everything manually so we can respect the removed files
    const formData = new FormData(e.currentTarget);
    formData.delete("files"); // Remove the default file input data
    selectedFiles.forEach(file => {
      formData.append("files", file); // Add our managed files
    });
    
    startTransition(async () => {
      const result = await createTicketAction(formData);
      if (result?.error) {
        setErrorMsg(result.error);
      } else {
        closeModal();
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="w-full max-w-2xl colorful-border rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-[var(--color-border)] bg-black/20">
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-text-main)]">Create New Ticket</h2>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">Describe your issue in detail so we can help you faster.</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-[var(--color-border)] text-[var(--color-text-muted)] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto">
                <form ref={formRef} id="create-ticket-form" onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {errorMsg}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5 ml-1">Subject</label>
                      <input 
                        type="text" 
                        name="title"
                        required
                        placeholder="E.g., Server node not starting"
                        className="w-full px-4 py-3 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5 ml-1">Discord Username</label>
                      <input 
                        type="text" 
                        name="discordUsername"
                        required
                        placeholder="e.g., user#1234 or @username"
                        className="w-full px-4 py-3 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">Description</label>
                    <textarea 
                      name="description"
                      required
                      rows={5}
                      placeholder="Please provide as much detail as possible about the issue..."
                      className="w-full px-4 py-3 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">Attachments (Images, Media, Recording)</label>
                    <div className="border-2 border-dashed border-[var(--color-border)] rounded-2xl p-6 text-center hover:bg-[var(--color-bg-base)]/50 transition-colors group relative overflow-hidden flex flex-col items-center justify-center">
                      <input 
                        type="file" 
                        name="files" 
                        multiple 
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                      />
                      
                      <div className="flex justify-center gap-4 mb-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)] transition-colors">
                        <ImageIcon className="w-6 h-6" />
                        <FileText className="w-6 h-6" />
                        <Video className="w-6 h-6" />
                        <Mic className="w-6 h-6" />
                      </div>
                      <p className="font-medium text-[var(--color-text-main)] mb-1">Click or drag files to upload</p>
                      <p className="text-xs text-[var(--color-text-muted)]">Supports JPG, PNG, MP4, PDF, and Audio recordings</p>
                    </div>

                    {/* Preview Selected Files */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {selectedFiles.map((file, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border)]"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="p-2 rounded-lg bg-[var(--color-bg-panel)]">
                                {file.type.startsWith('image/') ? (
                                  <ImageIcon className="w-4 h-4 text-[var(--color-brand)]" />
                                ) : (
                                  <FileIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                                )}
                              </div>
                              <div className="truncate text-sm font-medium text-[var(--color-text-main)]">
                                {file.name}
                              </div>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeFile(idx)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[var(--color-border)] bg-black/20 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl font-medium text-[var(--color-text-main)] hover:bg-[var(--color-border)] transition-colors"
                >
                  Cancel
                </button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  form="create-ticket-form"
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-brand)] text-white font-medium rounded-xl hover:bg-[#16a34a] shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Submitting..." : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Ticket</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
