import { ChatbotUIContext } from "@/context/context"
import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import useHotkey from "@/lib/hooks/use-hotkey"
import { LLMID, ModelProvider } from "@/types"
import { IconAdjustmentsHorizontal } from "@tabler/icons-react"
import { FC, useContext, useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ModelSelectSimple } from "../models/model-select-simple"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { Checkbox } from "../ui/checkbox"
import { WithTooltip } from "../ui/with-tooltip"
import { IconInfoCircle } from "@tabler/icons-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select"

interface ChatSettingsSimpleProps {}

export const ChatSettingsSimple: FC<ChatSettingsSimpleProps> = ({}) => {
  useHotkey("i", () => handleClick())

  const {
    chatSettings,
    setChatSettings,
    models,
    availableHostedModels,
    availableLocalModels,
    availableOpenRouterModels,
    profile,
    selectedWorkspace
  } = useContext(ChatbotUIContext)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    if (buttonRef.current) {
      buttonRef.current.click()
    }
  }

  useEffect(() => {
    if (!chatSettings) return

    setChatSettings({
      ...chatSettings,
      temperature: Math.min(
        chatSettings.temperature,
        CHAT_SETTING_LIMITS[chatSettings.model]?.MAX_TEMPERATURE || 1
      ),
      contextLength: Math.min(
        chatSettings.contextLength,
        CHAT_SETTING_LIMITS[chatSettings.model]?.MAX_CONTEXT_LENGTH || 4096
      )
    })
  }, [chatSettings?.model])

  if (!chatSettings || !profile) return null

  const allModels = [
    ...models.map(model => ({
      modelId: model.model_id as LLMID,
      modelName: model.name,
      provider: "custom" as ModelProvider,
      hostedId: model.id,
      platformLink: "",
      imageInput: false
    })),
    ...availableHostedModels,
    ...availableLocalModels,
    ...availableOpenRouterModels
  ]

  const fullModel = allModels.find(llm => llm.modelId === chatSettings.model)

  const isCustomModel = models.some(
    model => model.model_id === chatSettings.model
  )

  function findOpenRouterModel(modelId: string) {
    return availableOpenRouterModels.find(model => model.modelId === modelId)
  }

  const MODEL_LIMITS = CHAT_SETTING_LIMITS[chatSettings.model] || {
    MIN_TEMPERATURE: 0,
    MAX_TEMPERATURE: 1,
    MAX_CONTEXT_LENGTH:
      findOpenRouterModel(chatSettings.model)?.maxContext || 4096
  }

  return (
    <Popover>
      <PopoverTrigger>
        <button
          ref={buttonRef}
          className="flex items-center space-x-1 p-0 hover:underline"
        >
          <div
            className="max-w-[120px] truncate sm:max-w-[300px] lg:max-w-[500px]"
            style={{
              fontSize: "12px"
            }}
          >
            {fullModel?.modelName || chatSettings.model}
          </div>

          <IconAdjustmentsHorizontal size={16} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="bg-background border-input relative flex max-h-[calc(100vh-60px)] w-[300px] flex-col space-y-4 overflow-auto rounded-lg border-2 p-6 sm:w-[350px] md:w-[400px] lg:w-[500px] dark:border-none"
        align="end"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Model</Label>

            <ModelSelectSimple
              selectedModelId={chatSettings.model}
              onSelectModel={model => {
                setChatSettings({ ...chatSettings, model })
              }}
            />
          </div>

          <div className="space-y-1">
            <Label>Prompt</Label>

            <TextareaAutosize
              className="bg-background border-input border-2"
              placeholder="You are a helpful AI assistant."
              onValueChange={prompt => {
                setChatSettings({ ...chatSettings, prompt })
              }}
              value={chatSettings.prompt}
              minRows={3}
              maxRows={6}
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center space-x-1">
              <div>Temperature:</div>
              <div>{chatSettings.temperature}</div>
            </Label>

            <Slider
              value={[chatSettings.temperature]}
              onValueChange={temperature => {
                setChatSettings({
                  ...chatSettings,
                  temperature: temperature[0]
                })
              }}
              min={MODEL_LIMITS.MIN_TEMPERATURE}
              max={MODEL_LIMITS.MAX_TEMPERATURE}
              step={0.01}
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center space-x-1">
              <div>Context Length:</div>
              <div>{chatSettings.contextLength}</div>
            </Label>

            <Slider
              value={[chatSettings.contextLength]}
              onValueChange={contextLength => {
                setChatSettings({
                  ...chatSettings,
                  contextLength: contextLength[0]
                })
              }}
              min={0}
              max={
                isCustomModel
                  ? models.find(model => model.model_id === chatSettings.model)
                      ?.context_length
                  : MODEL_LIMITS.MAX_CONTEXT_LENGTH
              }
              step={1}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={chatSettings.includeProfileContext}
              onCheckedChange={(value: boolean) =>
                setChatSettings({
                  ...chatSettings,
                  includeProfileContext: value
                })
              }
            />

            <Label>Chats Include Profile Context</Label>

            <WithTooltip
              delayDuration={0}
              display={
                <div className="w-[400px] p-3">
                  {profile?.profile_context || "No profile context."}
                </div>
              }
              trigger={
                <IconInfoCircle className="cursor-hover:opacity-50" size={16} />
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={chatSettings.includeWorkspaceInstructions}
              onCheckedChange={(value: boolean) =>
                setChatSettings({
                  ...chatSettings,
                  includeWorkspaceInstructions: value
                })
              }
            />

            <Label>Chats Include Workspace Instructions</Label>

            <WithTooltip
              delayDuration={0}
              display={
                <div className="w-[400px] p-3">
                  {selectedWorkspace?.instructions ||
                    "No workspace instructions."}
                </div>
              }
              trigger={
                <IconInfoCircle className="cursor-hover:opacity-50" size={16} />
              }
            />
          </div>

          <div>
            <Label>Embeddings Provider</Label>

            <Select
              value={chatSettings.embeddingsProvider}
              onValueChange={(embeddingsProvider: "openai" | "local") => {
                setChatSettings({
                  ...chatSettings,
                  embeddingsProvider
                })
              }}
            >
              <SelectTrigger>
                <SelectValue defaultValue="openai" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="openai">
                  {profile?.use_azure_openai ? "Azure OpenAI" : "OpenAI"}
                </SelectItem>

                {window.location.hostname === "localhost" && (
                  <SelectItem value="local">Local</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
