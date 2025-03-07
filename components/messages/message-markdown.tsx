import React, { FC, useState, useEffect } from "react"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { MessageCodeBlock } from "./message-codeblock"
import { MessageMarkdownMemoized } from "./message-markdown-memoized"
import Image from "next/image"
import { Components } from "react-markdown"
import { cn } from "@/lib/utils"
import { Brain, BrainCircuitIcon, ChevronRightIcon } from "lucide-react"
import { ChevronDownIcon } from "lucide-react"

interface MessageMarkdownProps {
  content: string
}

export const MessageMarkdown: FC<MessageMarkdownProps> = ({ content }) => {
  const [thinkContent, setThinkContent] = useState<string>("")
  const [regularContent, setRegularContent] = useState<string>("")
  const [isThinkOpen, setIsThinkOpen] = useState<boolean>(true)
  const [thinkingComplete, setThinkingComplete] = useState<boolean>(false)

  useEffect(() => {
    // Check if content has <think> tag
    if (content.includes("<think>")) {
      // Check if thinking is complete (if </think> tag exists)
      if (content.includes("</think>")) {
        // Extract content between <think> and </think> tags
        const thinkRegex = /<think>([\s\S]*?)<\/think>([\s\S]*)/
        const match = content.match(thinkRegex)

        if (match) {
          setThinkContent(match[1])
          setRegularContent(match[2])

          if (!thinkingComplete) {
            setThinkingComplete(true)
            setIsThinkOpen(false)
          }
        }
      } else {
        // <think> tag is open but not closed yet
        const thinkOpenRegex = /<think>([\s\S]*)/
        const match = content.match(thinkOpenRegex)

        if (match) {
          setThinkContent(match[1])
          setRegularContent("")
          setThinkingComplete(false)
        }
      }
    } else {
      // No think tags, treat all as regular content
      setRegularContent(content)
    }
  }, [content, thinkingComplete])

  const toggleThink = () => {
    setIsThinkOpen(!isThinkOpen)
  }

  // Common components configuration for MessageMarkdownMemoized
  const markdownComponents = {
    p({ children }: { children: React.ReactNode }) {
      return <p className="mb-2 last:mb-0">{children}</p>
    },
    img(props: { src?: string; alt?: string }) {
      return (
        <Image
          src={props.src || ""}
          alt={props.alt || ""}
          width={500}
          height={300}
          className="h-auto max-w-[67%]"
        />
      )
    },
    code({
      className,
      children,
      ...props
    }: {
      className?: string
      children: React.ReactNode
      [key: string]: any
    }) {
      const childArray = React.Children.toArray(children)
      const firstChild = childArray[0] as React.ReactElement
      const firstChildAsString = React.isValidElement(firstChild)
        ? (firstChild as React.ReactElement).props.children
        : firstChild

      if (firstChildAsString === "▍") {
        return <span className="mt-1 animate-pulse cursor-default">▍</span>
      }

      if (typeof firstChildAsString === "string") {
        childArray[0] = firstChildAsString.replace("`▍`", "▍")
      }

      const match = /language-(\w+)/.exec(className || "")

      if (
        typeof firstChildAsString === "string" &&
        !firstChildAsString.includes("\n")
      ) {
        return (
          <code className={className} {...props}>
            {childArray}
          </code>
        )
      }

      return (
        <MessageCodeBlock
          key={Math.random()}
          language={(match && match[1]) || ""}
          value={String(childArray).replace(/\n$/, "")}
          {...props}
        />
      )
    }
  }

  // Reusable MessageMarkdownMemoized component
  const renderMarkdown = (contentToRender: string, className?: string) => (
    <MessageMarkdownMemoized
      className={cn(
        "prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words",
        className
      )}
      remarkPlugins={[remarkGfm, remarkMath]}
      components={markdownComponents as Partial<Components>}
    >
      {contentToRender}
    </MessageMarkdownMemoized>
  )

  return (
    <div className="w-full">
      {thinkContent && (
        <div className="mb-4">
          <div className="flex cursor-pointer flex-col items-start rounded-md">
            <div
              className={cn(
                "flex w-full items-center justify-between border border-gray-200 bg-white p-3 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:hover:bg-gray-800",
                isThinkOpen ? "rounded-t-md border-b-0" : "w-80 rounded-md"
              )}
              onClick={toggleThink}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-md bg-gray-100 p-3 dark:bg-gray-800">
                  <BrainCircuitIcon size={18} />
                </div>
                <div className="flex text-sm">Thinking Process</div>
              </div>
              <div>
                {isThinkOpen ? (
                  <ChevronDownIcon size={16} />
                ) : (
                  <ChevronRightIcon size={16} />
                )}
              </div>
            </div>

            {isThinkOpen && (
              <div className="w-full rounded-b-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-black">
                {renderMarkdown(thinkContent, "text-sm")}
              </div>
            )}
          </div>
        </div>
      )}

      {regularContent && renderMarkdown(regularContent)}

      {!thinkContent && !regularContent && renderMarkdown(content)}
    </div>
  )
}
