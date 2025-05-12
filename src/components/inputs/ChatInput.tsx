import { TextareaHTMLAttributes, ForwardedRef, forwardRef } from "react";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";
import { cn } from "@/lib/utils";

interface ChatInputProps
  extends Omit<TextareaAutosizeProps, "style">,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> {}

export const ChatInput = forwardRef(
  (
    { className, ...props }: ChatInputProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    return (
      <TextareaAutosize
        ref={ref}
        maxRows={6}
        className={cn(
          "w-full resize-none px-3 text-sm placeholder:text-muted-foreground outline-none",
          className
        )}
        {...props}
      />
    );
  }
);

ChatInput.displayName = "ChatInput";
