"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import React, { useState, useRef } from 'react'
import { useUser } from "@clerk/nextjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createReplyAction } from "@/actions/reply.actions"
import { Button } from "@/components/ui/button"
import { Loader2, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ReplyDialogProps {
    isOpen: boolean;
    onClose: () => void;
    post: any;
}

const ReplyDialog = ({ isOpen, onClose, post }: ReplyDialogProps) => {
    const { user } = useUser();
    const [text, setText] = useState("");
    const queryClient = useQueryClient();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const mutation = useMutation({
        mutationFn: createReplyAction,
        onSuccess: () => {
            setText("");
            onClose();
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", post.id] });
        },
    });

    const handleReply = async () => {
        if (!user || !text.trim() || mutation.isPending) return;

        await mutation.mutateAsync({
            content: text,
            postId: post.id,
            userId: user.id,
        });
    };

    const autoResize = (el: HTMLTextAreaElement) => {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    };

    if (!post) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-black border-[#2f3336] p-0 overflow-hidden max-w-[600px] w-[90vw] sm:w-full rounded-2xl">
                <DialogHeader className="p-4 flex flex-row items-center">
                   <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-white" />
                   </button>
                </DialogHeader>

                <div className="px-4 pb-4">
                    {/* Original Post Snippet */}
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <img src={post.user?.profileImage || "/default-avatar.png"} className="w-10 h-10 rounded-full object-cover" alt="" />
                            <div className="w-0.5 grow bg-[#2f3336] mt-1 mb-1"></div>
                        </div>
                        <div className="flex flex-col flex-1 pb-4">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-white">{post.user?.name}</span>
                                <span className="text-[#71767b]">@{post.user?.username}</span>
                                <span className="text-[#71767b]">·</span>
                                <span className="text-[#71767b]">{formatDistanceToNow(new Date(post.createdAt))}</span>
                            </div>
                            <div className="text-white text-[15px]">
                                {post.content}
                            </div>
                            <div className="text-[#71767b] text-[15px] mt-3">
                                Replying to <span className="text-[#1d9bf0]">@{post.user?.username}</span>
                            </div>
                        </div>
                    </div>

                    {/* Reply Input */}
                    <div className="flex gap-3 mt-1">
                        <img src={user?.imageUrl || "/default-avatar.png"} className="w-10 h-10 rounded-full object-cover" alt="" />
                        <div className="flex flex-col flex-1">
                            <textarea
                                ref={textareaRef}
                                value={text}
                                onChange={(e) => { setText(e.target.value); autoResize(e.target); }}
                                placeholder="Post your reply"
                                className="w-full bg-transparent border-none outline-none text-white text-xl resize-none py-2 leading-normal min-h-[100px]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button
                            onClick={handleReply}
                            disabled={!text.trim() || mutation.isPending}
                            className={`rounded-full font-bold px-4 py-1.5 h-auto transition-all ${
                                text.trim() ? "bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white" : "bg-[#1d9bf0]/50 text-white/50 cursor-not-allowed"
                            }`}
                        >
                            {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : "Reply"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ReplyDialog
