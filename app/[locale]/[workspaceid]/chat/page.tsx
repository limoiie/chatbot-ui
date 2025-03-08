"use client"

import { ChatHelp } from "@/components/chat/chat-help"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSettingsSimple } from "@/components/chat/chat-settings-simple"
import { ChatUI } from "@/components/chat/chat-ui"
import { Brand } from "@/components/ui/brand"
import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useTheme } from "next-themes"
import { useContext } from "react"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { chatMessages } = useContext(ChatbotUIContext)

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  const { theme } = useTheme()

  return (
    <>
      {chatMessages.length === 0 ? (
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="top-50% left-50% -translate-x-50% -translate-y-50% absolute mb-20">
            <Brand theme={theme === "dark" ? "dark" : "light"} />
          </div>

          {/* <div className="absolute left-2 top-2">
            <QuickSettings />
          </div> */}

          {/* <div className="absolute right-2 top-2">
            <ChatSettings />
          </div> */}

          <div className="flex grow flex-col items-center justify-center" />

          <div
            id="chat-input-container"
            className="bg-background/80 border-border absolute inset-x-0 bottom-0 z-10 flex w-full items-end justify-center border-t pb-6 pt-2 backdrop-blur-sm"
          >
            <div className="relative mx-auto w-full min-w-[300px] max-w-[800px] px-2 sm:w-[600px] md:w-[700px] lg:w-[700px] xl:w-[800px]">
              <ChatInput />
              <div
                className="text-muted-foreground/80 mt-1 flex flex-row"
                style={{
                  fontSize: "12px"
                }}
              >
                <div className="flex items-center space-x-1 pl-1">
                  <span className="font-semibold">Model:</span>
                  <ChatSettingsSimple />
                </div>
                <div className="ml-auto pr-1">
                  <ChatHelp />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ChatUI />
      )}
    </>
  )
}
