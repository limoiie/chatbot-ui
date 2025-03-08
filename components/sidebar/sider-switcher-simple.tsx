import { BookIcon, FilesIcon, LibraryIcon } from "lucide-react"
import { FC } from "react"
import { WithTooltip } from "../ui/with-tooltip"
import { ProfileSettings } from "../utility/profile-settings"

export const SIDEBAR_ICON_SIZE = 18

interface SidebarSwitcherSimpleProps {}

export const SidebarSwitcherSimple: FC<SidebarSwitcherSimpleProps> = ({}) => {
  return (
    <div className="flex flex-col">
      <div className="border-border flex flex-col items-stretch justify-between border-t p-2">
        <div className="hover:bg-muted-foreground/10 flex w-full flex-row items-center gap-2 rounded-md p-2">
          <FilesIcon size={SIDEBAR_ICON_SIZE} />
          <a className="grow text-sm">Files</a>
        </div>

        <div className="hover:bg-muted-foreground/10 flex w-full flex-row items-center gap-2 rounded-md p-2">
          <LibraryIcon size={SIDEBAR_ICON_SIZE} />
          <a className="grow text-sm">Collections</a>
        </div>
      </div>

      <div className="ml-auto pb-4 pr-4">
        <WithTooltip
          display={<div>Profile Settings</div>}
          trigger={<ProfileSettings />}
        />
      </div>
    </div>
  )
}
