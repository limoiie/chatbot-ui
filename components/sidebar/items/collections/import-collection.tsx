import { SidebarCreateItem } from "@/components/sidebar/items/all/sidebar-create-item"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChatbotUIContext } from "@/context/context"
import { COLLECTION_DESCRIPTION_MAX, COLLECTION_NAME_MAX } from "@/db/limits"
import { ACCEPTED_FILE_TYPES } from "@/components/chat/chat-hooks/use-select-file-handler"
import { createFileBasedOnExtension } from "@/db/files"
import { TablesInsert } from "@/supabase/types"
import { CollectionFile } from "@/types"
import { FC, useContext, useState, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

// Add type declaration for webkitdirectory and directory attributes
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string
    directory?: string
  }
}

interface ImportCollectionProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const ImportCollection: FC<ImportCollectionProps> = ({
  isOpen,
  onOpenChange
}) => {
  const { profile, selectedWorkspace } = useContext(ChatbotUIContext)

  const [name, setName] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [description, setDescription] = useState("")
  const [selectedCollectionFiles, setSelectedCollectionFiles] = useState<
    CollectionFile[]
  >([])
  const [isImporting, setIsImporting] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [importProgress, setImportProgress] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)
  const [processedFiles, setProcessedFiles] = useState(0)

  const directoryInputRef = useRef<HTMLInputElement>(null)

  const handleFolderSelect = async () => {
    if (directoryInputRef.current) {
      directoryInputRef.current.click()
    }
  }

  const handleDirectoryChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !selectedWorkspace || !profile) return

    setIsImporting(true)
    setImportProgress(0)
    setProcessedFiles(0)

    try {
      const files = Array.from(e.target.files)

      if (files.length === 0) {
        toast.error("No files selected")
        setIsImporting(false)
        return
      }

      // Get folder name from the first file's path
      const firstFilePath = files[0].webkitRelativePath
      const folderPathParts = firstFilePath.split("/")
      const extractedFolderName = folderPathParts[0]
      setFolderName(extractedFolderName)
      setName(extractedFolderName)

      // Filter files by accepted types
      const acceptedExtensions = ACCEPTED_FILE_TYPES.split(",").map(
        type => type.split("/")[1]
      )

      const validFiles = files.filter(file => {
        const extension = file.name.split(".").pop()?.toLowerCase()
        return (
          extension && acceptedExtensions.some(ext => ext.includes(extension))
        )
      })

      if (validFiles.length === 0) {
        toast.error("No valid files found in the selected folder")
        setIsImporting(false)
        return
      }

      // Set total files for progress tracking
      setTotalFiles(validFiles.length)

      // Create files in the database
      const createdFiles: CollectionFile[] = []

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        try {
          const fileRecord: TablesInsert<"files"> = {
            user_id: profile.user_id,
            name: file.name.split(".").slice(0, -1).join("."),
            description: `Imported from ${extractedFolderName}`,
            file_path: "",
            size: file.size,
            tokens: 0,
            type: file.type
          }

          const createdFile = await createFileBasedOnExtension(
            file,
            fileRecord,
            selectedWorkspace.id,
            selectedWorkspace.embeddings_provider as "openai" | "local"
          )

          if (createdFile) {
            createdFiles.push({
              id: createdFile.id,
              name: createdFile.name,
              type: createdFile.type
            })
          }
        } catch (error) {
          console.error(`Error creating file ${file.name}:`, error)
        } finally {
          // Update progress
          const processed = i + 1
          setProcessedFiles(processed)
          setImportProgress(Math.round((processed / validFiles.length) * 100))
        }
      }

      setSelectedCollectionFiles(createdFiles)
      toast.success(
        `Imported ${createdFiles.length} files from ${extractedFolderName}`
      )
    } catch (error) {
      console.error("Error importing folder:", error)
      toast.error("Failed to import folder")
    } finally {
      setIsImporting(false)
    }
  }

  if (!profile) return null
  if (!selectedWorkspace) return null

  return (
    <SidebarCreateItem
      contentType="collections"
      createState={
        {
          collectionFiles: selectedCollectionFiles.map(file => ({
            user_id: profile.user_id,
            collection_id: "",
            file_id: file.id
          })),
          user_id: profile.user_id,
          name,
          description
        } as TablesInsert<"collections">
      }
      isOpen={isOpen}
      isTyping={isTyping}
      onOpenChange={onOpenChange}
      renderInputs={() => (
        <>
          <div className="space-y-1">
            <Label>Import Folder</Label>

            <div className="flex flex-col space-y-2">
              <input
                type="file"
                ref={directoryInputRef}
                onChange={handleDirectoryChange}
                webkitdirectory="true"
                directory="true"
                multiple
                className="hidden"
              />

              <Button
                onClick={handleFolderSelect}
                disabled={isImporting}
                className="w-full"
              >
                {isImporting ? "Importing..." : "Select Folder"}
              </Button>

              {isImporting && (
                <div className="mt-2 space-y-1">
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>Importing files...</span>
                    <span>
                      {processedFiles} of {totalFiles} ({importProgress}%)
                    </span>
                  </div>
                  <div className="bg-secondary h-1.5 w-full overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full transition-all duration-300 ease-in-out"
                      style={{ width: `${importProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {!isImporting && selectedCollectionFiles.length > 0 && (
                <div className="text-muted-foreground mt-2 text-sm">
                  {selectedCollectionFiles.length} files selected from{" "}
                  {folderName}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Name</Label>

            <Input
              placeholder="Collection name..."
              value={name}
              onChange={e => {
                setName(e.target.value)
                setIsTyping(true)
              }}
              onBlur={() => setIsTyping(false)}
              maxLength={COLLECTION_NAME_MAX}
            />
          </div>

          <div className="space-y-1">
            <Label>Description</Label>

            <Input
              placeholder="Collection description..."
              value={description}
              onChange={e => {
                setDescription(e.target.value)
                setIsTyping(true)
              }}
              onBlur={() => setIsTyping(false)}
              maxLength={COLLECTION_DESCRIPTION_MAX}
            />
          </div>
        </>
      )}
    />
  )
}
