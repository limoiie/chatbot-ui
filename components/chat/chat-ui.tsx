/* eslint-disable tailwindcss/classnames-order */
import Loading from "@/app/[locale]/loading"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { getAssistantToolsByAssistantId } from "@/db/assistant-tools"
import { getChatFilesByChatId } from "@/db/chat-files"
import { getChatById } from "@/db/chats"
import { getMessageFileItemsByMessageId } from "@/db/message-file-items"
import { getMessagesByChatId } from "@/db/messages"
import { getMessageImageFromStorage } from "@/db/storage/message-images"
import { convertBlobToBase64 } from "@/lib/blob-to-b64"
import useHotkey from "@/lib/hooks/use-hotkey"
import { LLMID, MessageImage } from "@/types"
import { useParams } from "next/navigation"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { ChatHelp } from "./chat-help"
import { useScroll } from "./chat-hooks/use-scroll"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"
import { ChatScrollButtons } from "./chat-scroll-buttons"

interface ChatUIProps {}

export const ChatUI: FC<ChatUIProps> = ({}) => {
  useHotkey("o", () => handleNewChat())

  const params = useParams()

  const {
    setChatMessages,
    selectedChat,
    setSelectedChat,
    setChatSettings,
    setChatImages,
    assistants,
    setSelectedAssistant,
    setChatFileItems,
    setChatFiles,
    setShowFilesDisplay,
    setUseRetrieval,
    setSelectedTools
  } = useContext(ChatbotUIContext)

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  const {
    messagesStartRef,
    messagesEndRef,
    handleScroll,
    scrollToBottom,
    setIsAtBottom,
    isAtTop,
    isAtBottom,
    isOverflowing,
    scrollToTop
  } = useScroll()

  // Add refs for the containers
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  // State to track input container height
  const [inputContainerHeight, setInputContainerHeight] = useState(0)

  // Set up ResizeObserver to track input container height changes
  useEffect(() => {
    if (!inputContainerRef.current) return

    const updateHeight = () => {
      if (!inputContainerRef.current) return

      const height = inputContainerRef.current.getBoundingClientRect().height
      if (height > 0) {
        setInputContainerHeight(height)
      }
    }

    // Get initial height
    updateHeight()

    // Set up ResizeObserver with improved callback
    const resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to ensure we get the most up-to-date measurements
      window.requestAnimationFrame(updateHeight)
    })

    resizeObserver.observe(inputContainerRef.current)

    // Also observe the window resize events as a fallback
    window.addEventListener("resize", updateHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateHeight)
    }
  }, [])

  // Additional effect to measure height after component is fully rendered
  useEffect(() => {
    // Use setTimeout to ensure the DOM has been painted
    const timeoutId = setTimeout(() => {
      if (inputContainerRef.current) {
        const height = inputContainerRef.current.getBoundingClientRect().height
        if (height > 0 && inputContainerHeight === 0) {
          setInputContainerHeight(height)
        }
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [inputContainerHeight])

  // Log height changes for debugging
  useEffect(() => {
    console.log("Input container height:", inputContainerHeight)
  }, [inputContainerHeight])

  // Add MutationObserver to detect DOM changes that might affect height
  useEffect(() => {
    if (!inputContainerRef.current) return

    const updateHeight = () => {
      if (!inputContainerRef.current) return

      const height = inputContainerRef.current.getBoundingClientRect().height
      if (height > 0) {
        setInputContainerHeight(height)
      }
    }

    // Create a MutationObserver to watch for DOM changes
    const mutationObserver = new MutationObserver(() => {
      window.requestAnimationFrame(updateHeight)
    })

    // Observe changes to the input container and its descendants
    mutationObserver.observe(inputContainerRef.current, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    })

    return () => {
      mutationObserver.disconnect()
    }
  }, [])

  // Add periodic check for height updates
  useEffect(() => {
    const updateHeight = () => {
      if (!inputContainerRef.current) return

      const height = inputContainerRef.current.getBoundingClientRect().height
      if (height > 0 && height !== inputContainerHeight) {
        setInputContainerHeight(height)
      }
    }

    // Check every second
    const intervalId = setInterval(updateHeight, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [inputContainerHeight])

  // Listen for input events that might cause height changes
  useEffect(() => {
    if (!inputContainerRef.current) return

    const updateHeight = () => {
      if (!inputContainerRef.current) return

      const height = inputContainerRef.current.getBoundingClientRect().height
      if (height > 0) {
        setInputContainerHeight(height)
      }
    }

    // Find the textarea within the input container
    const textarea = inputContainerRef.current.querySelector("textarea")
    if (!textarea) return

    // Listen for events that might change the textarea's height
    const events = ["input", "change", "focus", "blur"]

    events.forEach(event => {
      textarea.addEventListener(event, () => {
        // Use setTimeout to allow the textarea to resize first
        setTimeout(updateHeight, 0)
      })
    })

    return () => {
      if (textarea) {
        events.forEach(event => {
          textarea.removeEventListener(event, updateHeight)
        })
      }
    }
  }, [])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      await fetchMessages()
      await fetchChat()

      scrollToBottom()
      setIsAtBottom(true)

      // Measure input container height after chat is loaded
      setTimeout(() => {
        if (inputContainerRef.current) {
          const height =
            inputContainerRef.current.getBoundingClientRect().height
          if (height > 0) {
            setInputContainerHeight(height)
          }
        }
      }, 200)
    }

    if (params.chatid) {
      fetchData().then(() => {
        handleFocusChatInput()
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [params.chatid])

  const fetchMessages = async () => {
    const fetchedMessages = await getMessagesByChatId(params.chatid as string)

    const imagePromises: Promise<MessageImage>[] = fetchedMessages.flatMap(
      message =>
        message.image_paths
          ? message.image_paths.map(async imagePath => {
              const url = await getMessageImageFromStorage(imagePath)

              if (url) {
                const response = await fetch(url)
                const blob = await response.blob()
                const base64 = await convertBlobToBase64(blob)

                return {
                  messageId: message.id,
                  path: imagePath,
                  base64,
                  url,
                  file: null
                }
              }

              return {
                messageId: message.id,
                path: imagePath,
                base64: "",
                url,
                file: null
              }
            })
          : []
    )

    const images: MessageImage[] = await Promise.all(imagePromises.flat())
    setChatImages(images)

    const messageFileItemPromises = fetchedMessages.map(
      async message => await getMessageFileItemsByMessageId(message.id)
    )

    const messageFileItems = await Promise.all(messageFileItemPromises)

    const uniqueFileItems = messageFileItems.flatMap(item => item.file_items)
    setChatFileItems(uniqueFileItems)

    const chatFiles = await getChatFilesByChatId(params.chatid as string)

    setChatFiles(
      chatFiles.files.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        file: null
      }))
    )

    setUseRetrieval(true)
    setShowFilesDisplay(true)

    const fetchedChatMessages = fetchedMessages.map(message => {
      return {
        message,
        fileItems: messageFileItems
          .filter(messageFileItem => messageFileItem.id === message.id)
          .flatMap(messageFileItem =>
            messageFileItem.file_items.map(fileItem => fileItem.id)
          )
      }
    })

    setChatMessages(fetchedChatMessages)
  }

  const fetchChat = async () => {
    const chat = await getChatById(params.chatid as string)
    if (!chat) return

    if (chat.assistant_id) {
      const assistant = assistants.find(
        assistant => assistant.id === chat.assistant_id
      )

      if (assistant) {
        setSelectedAssistant(assistant)

        const assistantTools = (
          await getAssistantToolsByAssistantId(assistant.id)
        ).tools
        setSelectedTools(assistantTools)
      }
    }

    setSelectedChat(chat)
    setChatSettings({
      model: chat.model as LLMID,
      prompt: chat.prompt,
      temperature: chat.temperature,
      contextLength: chat.context_length,
      includeProfileContext: chat.include_profile_context,
      includeWorkspaceInstructions: chat.include_workspace_instructions,
      embeddingsProvider: chat.embeddings_provider as "openai" | "local"
    })
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="relative flex h-full flex-col items-center">
      <div
        id="chat-messages-container"
        ref={messagesContainerRef}
        className="flex size-full flex-col overflow-auto border-b"
        style={{
          paddingBottom:
            inputContainerHeight > 0
              ? `${inputContainerHeight + 64}px`
              : "168px"
        }}
        onScroll={handleScroll}
      >
        <div ref={messagesStartRef} />

        <ChatMessages />

        <div ref={messagesEndRef} />
      </div>

      <div
        id="chat-scroll-buttons-container"
        className="absolute bottom-[100px] right-6 z-20"
      >
        <ChatScrollButtons
          isAtTop={isAtTop}
          isAtBottom={isAtBottom}
          isOverflowing={isOverflowing}
          scrollToTop={scrollToTop}
          scrollToBottom={scrollToBottom}
        />
      </div>

      <div
        id="chat-input-container"
        ref={inputContainerRef}
        className="bg-background/80 absolute bottom-0 inset-x-0 z-10 flex w-full items-end justify-center border-t border-border pb-6 pt-2 backdrop-blur-sm"
      >
        <div className="relative mx-auto w-full min-w-[300px] max-w-[800px] px-2 sm:w-[600px] md:w-[700px] lg:w-[700px] xl:w-[800px]">
          <ChatInput />
          <div
            className="text-muted-foreground/80 mt-1 flex flex-row"
            style={{
              fontSize: "12px"
            }}
          >
            <div className="pl-1">Model: {selectedChat?.model}</div>
            <div className="ml-auto pr-1">
              <ChatHelp />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
