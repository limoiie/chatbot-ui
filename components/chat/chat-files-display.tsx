import { ChatbotUIContext } from "@/context/context"
import { getFileFromStorage } from "@/db/storage/files"
import useHotkey from "@/lib/hooks/use-hotkey"
import { cn } from "@/lib/utils"
import { ChatFile, MessageImage } from "@/types"
import {
  IconCircleFilled,
  IconFileFilled,
  IconFileTypeCsv,
  IconFileTypeDocx,
  IconFileTypePdf,
  IconFileTypeTxt,
  IconJson,
  IconMarkdown
} from "@tabler/icons-react"
import { CircleXIcon, LoaderIcon } from "lucide-react"
import Image from "next/image"
import { FC, useContext, useState } from "react"
import { FilePreview } from "../ui/file-preview"
import { WithTooltip } from "../ui/with-tooltip"

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 3px;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #4b5563;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #6b7280;
  }
`

interface ChatFilesDisplayProps {}

export const ChatFilesDisplay: FC<ChatFilesDisplayProps> = ({}) => {
  useHotkey("f", () => setShowFilesDisplay(prev => !prev))
  useHotkey("e", () => setUseRetrieval(prev => !prev))

  const {
    files,
    newMessageImages,
    setNewMessageImages,
    newMessageFiles,
    setNewMessageFiles,
    setShowFilesDisplay,
    showFilesDisplay,
    chatFiles,
    chatImages,
    setChatImages,
    setChatFiles,
    setUseRetrieval
  } = useContext(ChatbotUIContext)

  const [selectedFile, setSelectedFile] = useState<ChatFile | null>(null)
  const [selectedImage, setSelectedImage] = useState<MessageImage | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [hoveredFileId, setHoveredFileId] = useState<string | null>(null)

  const messageImages = [
    ...newMessageImages.filter(
      image =>
        !chatImages.some(chatImage => chatImage.messageId === image.messageId)
    )
  ]

  const combinedChatFiles = [
    ...newMessageFiles.filter(
      file => !chatFiles.some(chatFile => chatFile.id === file.id)
    ),
    ...chatFiles
  ]

  const combinedMessageFiles = [...messageImages, ...combinedChatFiles]

  const getLinkAndView = async (file: ChatFile) => {
    const fileRecord = files.find(f => f.id === file.id)

    if (!fileRecord) return

    const link = await getFileFromStorage(fileRecord.file_path)
    window.open(link, "_blank")
  }

  const renderCloseButton = (
    file: ChatFile | MessageImage,
    onClick: (e: React.MouseEvent<SVGSVGElement>) => void
  ) => {
    return (
      <CircleXIcon
        className="absolute right-[6px] top-[6px] size-5 cursor-pointer rounded-full bg-white text-gray-500 hover:bg-red-50 hover:text-red-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        onClick={onClick}
        size={16}
      />
    )
  }

  return (
    showFilesDisplay && (
      <>
        {showPreview && selectedImage && (
          <FilePreview
            type="image"
            item={selectedImage}
            isOpen={showPreview}
            onOpenChange={(isOpen: boolean) => {
              setShowPreview(isOpen)
              setSelectedImage(null)
            }}
          />
        )}

        {showPreview && selectedFile && (
          <FilePreview
            type="file"
            item={selectedFile}
            isOpen={showPreview}
            onOpenChange={(isOpen: boolean) => {
              setShowPreview(isOpen)
              setSelectedFile(null)
            }}
          />
        )}

        <div className="w-full min-w-[300px] max-w-[800px] overflow-hidden pr-4 sm:w-[600px] md:w-[700px] lg:w-[700px] xl:w-[800px]">
          <style jsx>{scrollbarStyles}</style>
          <div
            className="custom-scrollbar flex flex-nowrap gap-2 overflow-x-auto py-2"
            style={{
              scrollbarWidth: "thin",
              msOverflowStyle: "none"
            }}
          >
            {messageImages.map((image, index) => (
              <div
                key={index}
                className="relative flex h-[64px] cursor-pointer items-center space-x-4 rounded-xl hover:opacity-50"
                onMouseEnter={() => setHoveredFileId(image.messageId)}
                onMouseLeave={() => setHoveredFileId(null)}
              >
                <Image
                  className="rounded"
                  // Force the image to be 56px by 56px
                  style={{
                    minWidth: "56px",
                    minHeight: "56px",
                    maxHeight: "56px",
                    maxWidth: "56px"
                  }}
                  src={image.base64} // Preview images will always be base64
                  alt="File image"
                  width={56}
                  height={56}
                  onClick={() => {
                    setSelectedImage(image)
                    setShowPreview(true)
                  }}
                />

                {hoveredFileId === image.messageId &&
                  renderCloseButton(image, e => {
                    e.stopPropagation()
                    setNewMessageImages(
                      newMessageImages.filter(
                        f => f.messageId !== image.messageId
                      )
                    )
                    setChatImages(
                      chatImages.filter(f => f.messageId !== image.messageId)
                    )
                  })}
              </div>
            ))}

            {combinedChatFiles.map((file, index) =>
              file.id === "loading" ? (
                <div
                  key={index}
                  className="relative flex items-center space-x-4 rounded-xl border-2 p-3"
                >
                  <div className="rounded bg-blue-500 p-1">
                    <LoaderIcon
                      className="animate-spin"
                      color="white"
                      size={20}
                    />
                  </div>

                  <div className="truncate" style={{ fontSize: "10px" }}>
                    <div className="truncate">{file.name}</div>
                    <div className="truncate opacity-50">{file.type}</div>
                  </div>
                </div>
              ) : (
                <div
                  key={file.id}
                  className="hover:bg-opacity/60 relative flex cursor-pointer items-center space-x-4 rounded-xl bg-gray-100 p-3 dark:bg-gray-600"
                  onClick={() => getLinkAndView(file)}
                  onMouseEnter={() => setHoveredFileId(file.id)}
                  onMouseLeave={() => setHoveredFileId(null)}
                >
                  <div className="rounded bg-blue-500 p-1">
                    {(() => {
                      let fileExtension = file.type.includes("/")
                        ? file.type.split("/")[1]
                        : file.type

                      switch (fileExtension) {
                        case "pdf":
                          return <IconFileTypePdf color="white" size={20} />
                        case "markdown":
                          return <IconMarkdown color="white" size={20} />
                        case "txt":
                          return <IconFileTypeTxt color="white" size={20} />
                        case "json":
                          return <IconJson color="white" size={20} />
                        case "csv":
                          return <IconFileTypeCsv color="white" size={20} />
                        case "docx":
                          return <IconFileTypeDocx color="white" size={20} />
                        default:
                          return <IconFileFilled color="white" size={20} />
                      }
                    })()}
                  </div>

                  <div className="truncate" style={{ fontSize: "10px" }}>
                    <div className="truncate">{file.name}</div>
                    <div className="truncate opacity-50">{file.type}</div>
                  </div>

                  {hoveredFileId === file.id &&
                    renderCloseButton(file, e => {
                      e.stopPropagation()
                      setNewMessageFiles(
                        newMessageFiles.filter(f => f.id !== file.id)
                      )
                      setChatFiles(chatFiles.filter(f => f.id !== file.id))
                    })}
                </div>
              )
            )}
          </div>
        </div>
      </>
      // ) : (
      //   combinedMessageFiles.length > 0 && (
      //     <div className="flex w-full items-center justify-center space-x-2">
      //       <Button
      //         className="flex h-[32px] w-[140px] space-x-2"
      //         onClick={() => setShowFilesDisplay(true)}
      //       >
      //         <RetrievalToggle />

      //         <div>
      //           {" "}
      //           View {combinedMessageFiles.length} file
      //           {combinedMessageFiles.length > 1 ? "s" : ""}
      //         </div>

      //         <div onClick={e => e.stopPropagation()}>
      //           <ChatRetrievalSettings />
      //         </div>
      //       </Button>
      //     </div>
      //   )
    )
  )
}

const RetrievalToggle = ({}) => {
  const { useRetrieval, setUseRetrieval } = useContext(ChatbotUIContext)

  return (
    <div className="flex items-center">
      <WithTooltip
        delayDuration={0}
        side="top"
        display={
          <div>
            {useRetrieval
              ? "File retrieval is enabled on the selected files for this message. Click the indicator to disable."
              : "Click the indicator to enable file retrieval for this message."}
          </div>
        }
        trigger={
          <IconCircleFilled
            className={cn(
              "p-1",
              useRetrieval ? "text-green-500" : "text-red-500",
              useRetrieval ? "hover:text-green-200" : "hover:text-red-200"
            )}
            size={24}
            onClick={e => {
              e.stopPropagation()
              setUseRetrieval(prev => !prev)
            }}
          />
        }
      />
    </div>
  )
}
