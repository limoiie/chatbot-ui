import useHotkey from "@/lib/hooks/use-hotkey"
import {
  IconBrandGithub,
  IconBrandX,
  IconHelpCircle
} from "@tabler/icons-react"
import {
  KeyboardIcon,
  HelpCircleIcon,
  FoldersIcon,
  MessageSquareIcon,
  FilesIcon,
  SearchIcon,
  SettingsIcon,
  SlidersIcon,
  PanelLeftIcon
} from "lucide-react"
import Link from "next/link"
import { FC, useState } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { Announcements } from "../utility/announcements"
import { Badge } from "../ui/badge"

interface ChatHelpProps {}

export const ChatHelp: FC<ChatHelpProps> = ({}) => {
  useHotkey("/", () => setIsOpen(prevState => !prevState))

  const [isOpen, setIsOpen] = useState(false)

  // Common CSS classes
  const linkClass = "cursor-pointer hover:opacity-50"

  const renderShortcutItem = (
    label: string,
    keys: string[],
    icon: React.ReactNode
  ) => {
    return (
      <div className="hover:bg-muted flex cursor-default items-center justify-between rounded-md py-1">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        <div className="flex gap-1 opacity-60">
          {keys.map((key, index) => (
            <Badge
              key={index}
              className="min-w-6 rounded border-DEFAULT p-1 text-center font-mono"
              variant="secondary"
            >
              {key}
            </Badge>
          ))}
        </div>
      </div>
    )
  }

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        <div className="hover:text-muted-foreground/100 flex cursor-pointer flex-row items-center gap-1">
          <span>Shortcuts</span>
          <KeyboardIcon className="rounded-full p-0.5" size={20} />
        </div>
      </HoverCardTrigger>

      <HoverCardContent align="end" className="w-[350px] p-0" sideOffset={10}>
        <div className="p-3">
          <div className="flex items-center justify-between pb-2">
            <div className="flex space-x-2">
              <Link
                className={linkClass}
                href="https://twitter.com/ChatbotUI"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandX />
              </Link>

              <Link
                className={linkClass}
                href="https://github.com/limoiie/chatbot-ui"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandGithub />
              </Link>
            </div>

            <div className="flex space-x-2">
              <Announcements />

              {/* <Link
                className={linkClass}
                href="/help"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconHelpCircle size={24} />
              </Link> */}
            </div>
          </div>

          <div className="border-t pt-2 text-sm">
            {renderShortcutItem(
              "Show Help",
              ["⌘", "Shift", "/"],
              <HelpCircleIcon size={16} />
            )}
            {renderShortcutItem(
              "Show Workspaces",
              ["⌘", "Shift", "O"],
              <FoldersIcon size={16} />
            )}
            {renderShortcutItem(
              "Focus Chat",
              ["⌘", "Shift", "L"],
              <MessageSquareIcon size={16} />
            )}
            {renderShortcutItem(
              "Toggle Files",
              ["⌘", "Shift", "F"],
              <FilesIcon size={16} />
            )}
            {renderShortcutItem(
              "Toggle Retrieval",
              ["⌘", "Shift", "E"],
              <SearchIcon size={16} />
            )}
            {renderShortcutItem(
              "Open Settings",
              ["⌘", "Shift", "I"],
              <SettingsIcon size={16} />
            )}
            {renderShortcutItem(
              "Open Quick Settings",
              ["⌘", "Shift", "P"],
              <SlidersIcon size={16} />
            )}
            {renderShortcutItem(
              "Toggle Sidebar",
              ["⌘", "Shift", "S"],
              <PanelLeftIcon size={16} />
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
