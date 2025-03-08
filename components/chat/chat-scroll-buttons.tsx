import { ChevronUpIcon, ChevronDownIcon } from "lucide-react"
import { FC } from "react"

interface ChatScrollButtonsProps {
  isAtTop: boolean
  isAtBottom: boolean
  isOverflowing: boolean
  scrollToTop: () => void
  scrollToBottom: () => void
}

export const ChatScrollButtons: FC<ChatScrollButtonsProps> = ({
  isAtTop,
  isAtBottom,
  isOverflowing,
  scrollToTop,
  scrollToBottom
}) => {
  return (
    <div className="flex flex-col gap-2">
      {!isAtTop && isOverflowing && (
        <button
          className="bg-background flex size-10 items-center justify-center rounded-full shadow-md transition-all hover:opacity-80"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ChevronUpIcon
            className="hover:text-foreground/70 text-foreground"
            size={24}
          />
        </button>
      )}

      {!isAtBottom && isOverflowing && (
        <button
          className="bg-background flex size-10 items-center justify-center rounded-full shadow-md transition-all hover:opacity-80"
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
        >
          <ChevronDownIcon
            className="hover:text-foreground/70 text-foreground"
            size={24}
          />
        </button>
      )}
    </div>
  )
}
