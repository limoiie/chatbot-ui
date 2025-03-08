import { Tables } from "@/supabase/types"
import { ContentType, DataListType } from "@/types"
import { FC, useContext, useState } from "react"
import { ChatbotUIContext } from "@/context/context"
import { SidebarSearch } from "./sidebar-search"
import { SidebarDataList } from "./sidebar-data-list"
import { SidebarCreateButtons } from "./sidebar-create-buttons"

interface SidebarSheetContentProps {
  contentType: ContentType
}

export const SidebarSheetContent: FC<SidebarSheetContentProps> = ({
  contentType
}) => {
  const { files, collections, folders } = useContext(ChatbotUIContext)

  const [searchTerm, setSearchTerm] = useState("")

  // Filter folders based on contentType
  const filteredFolders = folders.filter(folder => folder.type === contentType)

  // Determine which data to use based on contentType
  const data: DataListType = contentType === "files" ? files : collections

  const filteredData: any = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex max-h-[calc(100%-50px)] grow flex-col">
      <div className="mt-2 flex items-center">
        <SidebarCreateButtons
          contentType={contentType}
          hasData={data.length > 0}
        />
      </div>

      <div className="mt-2">
        <SidebarSearch
          contentType={contentType}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <SidebarDataList
        contentType={contentType}
        data={filteredData}
        folders={filteredFolders}
      />
    </div>
  )
}
