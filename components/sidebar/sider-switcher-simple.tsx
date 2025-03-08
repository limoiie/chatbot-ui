import { cn } from "@/lib/utils"
import { FilesIcon, LibraryIcon, X } from "lucide-react"
import { FC, useState } from "react"
import { Button } from "../ui/button"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet"
import { WithTooltip } from "../ui/with-tooltip"
import { ProfileSettings } from "../utility/profile-settings"
import { SidebarSheetContent } from "./sidebar-sheet-content"

export const SIDEBAR_ICON_SIZE = 18

interface SidebarSwitcherSimpleProps {}

export const SidebarSwitcherSimple: FC<SidebarSwitcherSimpleProps> = ({}) => {
  const [isFilesSheetOpen, setIsFilesSheetOpen] = useState(false)
  const [isCollectionsSheetOpen, setIsCollectionsSheetOpen] = useState(false)

  return (
    <div className="flex flex-col">
      <div className="border-border flex flex-col items-stretch justify-between border-t p-2">
        <Sheet open={isFilesSheetOpen} onOpenChange={setIsFilesSheetOpen}>
          <SheetTrigger asChild>
            <div
              className={cn(
                "hover:bg-muted-foreground/10 flex w-full cursor-pointer flex-row items-center gap-2 rounded-md p-2",
                isFilesSheetOpen && "bg-muted-foreground/10"
              )}
            >
              <FilesIcon size={SIDEBAR_ICON_SIZE} />
              <a className="grow text-sm">Files</a>
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <div className="flex h-full flex-col">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-xl font-bold">Files</div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="size-4" />
                  </Button>
                </SheetClose>
              </div>
              <SidebarSheetContent contentType="files" />
            </div>
          </SheetContent>
        </Sheet>

        <Sheet
          open={isCollectionsSheetOpen}
          onOpenChange={setIsCollectionsSheetOpen}
        >
          <SheetTrigger asChild>
            <div
              className={cn(
                "hover:bg-muted-foreground/10 flex w-full cursor-pointer flex-row items-center gap-2 rounded-md p-2",
                isCollectionsSheetOpen && "bg-muted-foreground/10"
              )}
            >
              <LibraryIcon size={SIDEBAR_ICON_SIZE} />
              <a className="grow text-sm">Collections</a>
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <div className="flex h-full flex-col">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-xl font-bold">Collections</div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="size-4" />
                  </Button>
                </SheetClose>
              </div>
              <SidebarSheetContent contentType="collections" />
            </div>
          </SheetContent>
        </Sheet>
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
