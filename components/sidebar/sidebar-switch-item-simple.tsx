import { ContentType } from "@/types"
import { FC } from "react"
import { TabsTrigger } from "../ui/tabs"

interface SidebarSwitchItemSimpleProps {
  contentType: ContentType
  icon: React.ReactNode
  onContentTypeChange: (contentType: ContentType) => void
}

export const SidebarSwitchItemSimple: FC<SidebarSwitchItemSimpleProps> = ({
  contentType,
  icon,
  onContentTypeChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <TabsTrigger
        className="hover:opacity-50"
        value={contentType}
        onClick={() => onContentTypeChange(contentType as ContentType)}
      >
        {icon}
      </TabsTrigger>
      <span>{contentType[0].toUpperCase() + contentType.substring(1)}</span>
    </div>
  )
}
