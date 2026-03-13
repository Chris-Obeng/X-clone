"use client";

import React, { useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReplyAction } from '@/actions/reply.actions';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CreateReplyProps {
  postId: string;
}

const CreateReply = ({ postId }: CreateReplyProps) => {
  const { user } = useUser();
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const mutation = useMutation({
    mutationFn: createReplyAction,
    onSuccess: () => {
      setText("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const handleReply = async () => {
    if (!user || !text.trim() || mutation.isPending) return;

    await mutation.mutateAsync({
      content: text,
      postId: postId,
      userId: user.id,
    });
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  if (!user) return null;

  return (
    <div className="flex gap-3 px-4 py-3 border-b border-[#2f3336]">
      <img 
        src={user.imageUrl || "/default-avatar.png"} 
        className="w-10 h-10 rounded-full object-cover shrink-0" 
        alt="Profile"
      />
      <div className="flex flex-col flex-1">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => { setText(e.target.value); autoResize(e.target); }}
          placeholder="Post your reply"
          className="w-full bg-transparent border-none outline-none text-[#e7e9ea] placeholder:text-[#71767b] text-xl resize-none py-2 leading-normal"
          rows={1}
        />
        <div className="flex justify-end mt-2">
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
    </div>
  );
};

export default CreateReply;
