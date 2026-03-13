"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon, Video, Loader2 } from "lucide-react";
import EmojiPickerComponent from "./EmojiPicker";
import { useUploadThing } from "@/lib/uploadthing-hooks";
import { createPostAction } from "@/actions/post.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MediaGrid from "./MediaGrid";

/* ─── tiny helper to grow textarea ──────────────────────────────── */
function autoResize(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

/* ─── circular progress ring ────────────────────────────────────── */
function CharCounter({ count, max = 280 }: { count: number; max?: number }) {
  const remaining = max - count;
  const pct = Math.min(count / max, 1);
  const r = 14;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const nearLimit = remaining <= 20;
  const overLimit = remaining < 0;

  return (
    <div className="relative flex items-center justify-center w-[30px] h-[30px]">
      <svg width="30" height="30" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="15" cy="15" r={r} fill="none" stroke="#2f3336" strokeWidth="2.2" />
        <circle
          cx="15" cy="15" r={r}
          fill="none"
          stroke={overLimit ? "#f4212e" : nearLimit ? "#ffd400" : "#1d9bf0"}
          strokeWidth="2.2"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.15s" }}
        />
      </svg>
      {nearLimit && (
        <span className={`absolute text-[11px] font-bold leading-none ${overLimit ? "text-[#f4212e]" : "text-[#71767b]"}`}>
          {remaining}
        </span>
      )}
    </div>
  );
}

/* ─── icon button ────────────────────────────────────── */
const IconBtn = React.forwardRef<
  HTMLButtonElement,
  { children: React.ReactNode; title: string; onClick?: () => void; disabled?: boolean }
>(function IconBtn({ children, title, onClick, disabled }, ref) {
  return (
    <button
      ref={ref}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-transparent border-none cursor-pointer text-[#1d9bf0] p-0 transition-colors duration-150 hover:bg-[#1d9bf0]/10 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
});

type MediaItem = { file: File; url: string; isVideo: boolean };

interface PostFormProps {
    onSuccess?: () => void;
    placeholder?: string;
    showClose?: boolean;
    onClose?: () => void;
}

const PostForm = ({ onSuccess, placeholder = "What is happening?", showClose, onClose }: PostFormProps) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isExpanded = focused || text.length > 0 || mediaFiles.length > 0;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const MAX = 280;

  const { startUpload, isUploading } = useUploadThing("mediaUploader", {
    onClientUploadComplete: async (res) => {
      if (!user) return;
      
      const media = res.map((f) => ({
        url: f.url,
        type: (f.type.startsWith("video") ? "VIDEO" : "IMAGE") as "IMAGE" | "VIDEO",
      }));

      await mutation.mutateAsync({
        content: text,
        media,
        userId: user.id,
      });
    },
    onUploadError: (error: Error) => {
      alert(`ERROR! ${error.message}`);
    },
  });

  const mutation = useMutation({
    mutationFn: createPostAction,
    onSuccess: () => {
      setText("");
      setMediaFiles([]);
      setFocused(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      onSuccess?.();
    },
  });

  useEffect(() => {
    if (showEmojiPicker && emojiPickerRef.current) {
      emojiPickerRef.current.focus();
    }
  }, [showEmojiPicker]);

  const handlePost = async () => {
    if (!user || isUploading || mutation.isPending) return;

    if (mediaFiles.length > 0) {
      const files = mediaFiles.map((m) => m.file);
      await startUpload(files);
    } else if (text.trim()) {
      await mutation.mutateAsync({
        content: text,
        media: [],
        userId: user.id,
      });
    }
  };

  const onEmojiSelect = (emoji: string) => {
    setText((prev) => prev + emoji);
    requestAnimationFrame(() => {
      if (textareaRef.current) autoResize(textareaRef.current);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const newItems: MediaItem[] = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isVideo: file.type.startsWith("video/"),
    }));

    setMediaFiles((prev) => [...prev, ...newItems].slice(0, 4));
    e.target.value = "";
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const canPost = (text.trim().length > 0 || mediaFiles.length > 0) && text.length <= MAX && !isUploading && !mutation.isPending;

  return (
    <div className="flex flex-col w-full">
        {showClose && (
            <div className="flex items-center justify-between p-4 pb-0">
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={20} className="text-white" />
                </button>
                <span className="text-[#1d9bf0] font-bold text-sm cursor-pointer hover:underline">Drafts</span>
            </div>
        )}
        
        <div className="flex gap-3 px-4 py-3 w-full box-border">
            <div className="pt-0.5 shrink-0">
            <img 
                src={user?.imageUrl || "/default-avatar.png"} 
                className="w-10 h-10 rounded-full object-cover" 
                alt="Profile"
            />
            </div>

            <div className="flex flex-col flex-1 min-w-0">
            {isExpanded && (
                <button className="self-start flex items-center gap-1 px-3 py-[3px] mb-2 rounded-full border border-[#2f3336] bg-transparent text-[#1d9bf0] text-[13px] font-bold cursor-pointer hover:bg-[#1d9bf0]/10 transition-colors">
                    Everyone
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <g><path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z" /></g>
                    </svg>
                </button>
            )}

            <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => { setText(e.target.value); autoResize(e.target); }}
                onFocus={() => setFocused(true)}
                placeholder={placeholder}
                rows={isExpanded ? 3 : 1}
                className={`w-full resize-none border-none outline-none bg-transparent text-[#e7e9ea] placeholder:text-[#71767b] placeholder:text-xl leading-7 py-2 font-[inherit] overflow-y-hidden box-border focus:outline-none ${isExpanded ? "min-h-[120px]" : "min-h-[40px]"}`}
            />

            <MediaGrid 
                media={mediaFiles.map(m => ({ url: m.url, type: m.isVideo ? "VIDEO" : "IMAGE" }))} 
                onRemove={removeMedia} 
                editable={true} 
            />

            {isExpanded && (
                <div className="flex items-center gap-1 py-3 text-[#1d9bf0] font-bold text-[14px]">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <g><path d="M12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm0 18.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5 6.5 2.916 6.5 6.5-2.916 6.5-6.5 6.5zM12.5 12V7h-1v6l4.25 2.125.5-.875L12.5 12z"/></g>
                    </svg>
                    <span>Everyone can reply</span>
                </div>
            )}

            <div className="flex items-center justify-between mt-1 pt-2 border-t border-[#2f3336]">
                <div className="flex items-center gap-0.5">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
                {/* Media */}
                <IconBtn title="Media" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <g><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" /></g>
                    </svg>
                </IconBtn>

                {/* GIF */}
                <IconBtn title="GIF">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <g><path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z" /></g>
                    </svg>
                </IconBtn>

                <IconBtn title="Poll">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <g><path d="M6 5c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM2 7c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12V6h10v2zM6 15c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zm-4 2c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12v-2h10v2z" /></g>
                    </svg>
                </IconBtn>

                {/* Emoji */}
                <IconBtn title="Emoji" ref={emojiBtnRef} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <g><path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z" /></g>
                    </svg>
                </IconBtn>

                {/* Schedule */}
                <IconBtn title="Schedule">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <g><path d="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z" /></g>
                    </svg>
                </IconBtn>

                {/* Location */}
                <IconBtn title="Location">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <g><path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z" /></g>
                    </svg>
                </IconBtn>
                </div>

                <div className="flex items-center gap-3">
                {text.length > 0 && <CharCounter count={text.length} max={MAX} />}
                <Button
                    disabled={!canPost}
                    onClick={handlePost}
                    className={`rounded-full font-bold text-[15px] px-4 py-1.5 h-auto transition-all duration-200 ${
                    canPost ? "bg-white text-black hover:bg-white/90 cursor-pointer" : "bg-white/50 text-black/50 cursor-not-allowed"
                    }`}
                >
                    {isUploading || mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : "Post"}
                </Button>
                </div>
            </div>
            </div>
        </div>

        {showEmojiPicker && (
            <div 
            ref={emojiPickerRef}
            className="fixed z-50 shadow-2xl rounded-2xl overflow-hidden outline-none"
            tabIndex={0}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setShowEmojiPicker(false);
                }
            }}
            style={{ 
                top: emojiBtnRef.current ? emojiBtnRef.current.getBoundingClientRect().bottom + 10 : 0, 
                left: emojiBtnRef.current ? emojiBtnRef.current.getBoundingClientRect().left : 0 
            }}
            >
            <EmojiPickerComponent onEmojiSelect={onEmojiSelect} />
            </div>
        )}
    </div>
  );
};

export default PostForm;
