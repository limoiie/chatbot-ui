import { ChatbotUIContext } from "@/context/context"
import { LLMID, ModelProvider } from "@/types"
import { FC, useContext } from "react"
import { Badge } from "../ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "../ui/select"

interface ModelSelectSimpleProps {
  selectedModelId: string
  onSelectModel: (modelId: LLMID) => void
}

export const ModelSelectSimple: FC<ModelSelectSimpleProps> = ({
  selectedModelId,
  onSelectModel
}) => {
  const {
    profile,
    models,
    availableHostedModels,
    availableLocalModels,
    availableOpenRouterModels
  } = useContext(ChatbotUIContext)

  // Combine all models into a single list
  const allModels = [
    ...models.map(model => ({
      modelId: model.model_id as LLMID,
      modelName: model.name,
      provider: "custom" as ModelProvider,
      hostedId: model.id,
      platformLink: "",
      imageInput: false,
      isLocal: false
    })),
    ...availableHostedModels.map(model => ({
      ...model,
      isLocal: false
    })),
    ...availableLocalModels.map(model => ({
      ...model,
      isLocal: true
    })),
    ...availableOpenRouterModels.map(model => ({
      ...model,
      isLocal: false
    }))
  ]

  // Sort models by name within each group
  const localModels = allModels
    .filter(model => model.isLocal)
    .sort((a, b) => a.modelName.localeCompare(b.modelName))

  const hostedModels = allModels
    .filter(model => !model.isLocal)
    .sort((a, b) => a.modelName.localeCompare(b.modelName))

  if (!profile) return null

  if (allModels.length === 0) {
    return (
      <div className="rounded text-sm font-bold">
        Unlock models by entering API keys in your profile settings.
      </div>
    )
  }

  return (
    <Select
      value={selectedModelId}
      onValueChange={value => onSelectModel(value as LLMID)}
    >
      <SelectTrigger className="w-full px-3 py-5">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {localModels.length > 0 && (
          <SelectGroup>
            <SelectLabel>Local Models</SelectLabel>
            {localModels.map(model => (
              <SelectItem
                key={model.modelId}
                value={model.modelId}
                className="flex items-center justify-between"
              >
                <div className="flex w-full items-center justify-between">
                  <span>{model.modelName}</span>
                  <div className="ml-2 flex items-center gap-1">
                    <Badge variant="secondary" className="px-1 py-0 text-xs">
                      {model.provider.charAt(0).toUpperCase() +
                        model.provider.slice(1)}
                    </Badge>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}

        <SelectSeparator />

        {hostedModels.length > 0 && (
          <SelectGroup>
            <SelectLabel>Hosted Models</SelectLabel>
            {hostedModels.map(model => (
              <SelectItem
                key={model.modelId}
                value={model.modelId}
                className="flex items-center justify-between"
              >
                <div className="flex w-full items-center justify-between">
                  <span>{model.modelName}</span>
                  <div className="ml-2 flex items-center gap-1">
                    <Badge variant="secondary" className="px-1 py-0 text-xs">
                      {model.provider === "openai" && profile.use_azure_openai
                        ? "Azure OpenAI"
                        : model.provider.charAt(0).toUpperCase() +
                          model.provider.slice(1)}
                    </Badge>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  )
}
