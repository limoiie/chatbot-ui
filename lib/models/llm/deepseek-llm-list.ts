import { LLM } from "@/types"

const DEEPSEEK_PLATORM_LINK =
  "https://deepseek.com/docs/api-reference/introduction"

const DEEPSEEK_LLM_MODEL: LLM = {
  modelId: "deepseek-llm",
  modelName: "DeepSeek LLM",
  provider: "deepseek",
  hostedId: "deepseek-llm",
  platformLink: DEEPSEEK_PLATORM_LINK,
  imageInput: false
}

const DEEPSEEK_CODER_MODEL: LLM = {
  modelId: "deepseek-coder",
  modelName: "DeepSeek Coder",
  provider: "deepseek",
  hostedId: "deepseek-coder",
  platformLink: DEEPSEEK_PLATORM_LINK,
  imageInput: false
}

const DEEPSEEK_CODER_V2_MODEL: LLM = {
  modelId: "deepseek-coder-v2",
  modelName: "DeepSeek Coder V2",
  provider: "deepseek",
  hostedId: "deepseek-coder-v2",
  platformLink: DEEPSEEK_PLATORM_LINK,
  imageInput: false
}

const DEEPSEEK_V2_MODEL: LLM = {
  modelId: "deepseek-v2",
  modelName: "DeepSeek V2",
  provider: "deepseek",
  hostedId: "deepseek-v2",
  platformLink: DEEPSEEK_PLATORM_LINK,
  imageInput: false
}

const DEEPSEEK_V2_5_MODEL: LLM = {
  modelId: "deepseek-v2.5",
  modelName: "DeepSeek V2.5",
  provider: "deepseek",
  hostedId: "deepseek-v2.5",
  platformLink: DEEPSEEK_PLATORM_LINK,
  imageInput: false
}

const DEEPSEEK_CHAT_MODEL: LLM = {
  modelId: "deepseek-chat",
  modelName: "DeepSeek Chat",
  provider: "deepseek",
  hostedId: "deepseek-chat",
  platformLink: DEEPSEEK_PLATORM_LINK,
  imageInput: false
}

const DEEPSEEK_REASONER_MODEL: LLM = {
  modelId: "deepseek-reasoner",
  modelName: "DeepSeek Reasoner",
  provider: "deepseek",
  hostedId: "deepseek-reasoner",
  platformLink: DEEPSEEK_PLATORM_LINK,
  imageInput: false
}

const DEEPSEEK_V3_MODEL: LLM = {
  modelId: "deepseek-v3",
  modelName: "DeepSeek V3",
  provider: "deepseek",
  hostedId: "deepseek-v3",
  platformLink: DEEPSEEK_PLATORM_LINK,
  imageInput: false
}

const DEEPSEEK_R1_MODEL: LLM = {
  modelId: "deepseek-r1",
  modelName: "DeepSeek R1",
  provider: "deepseek",
  hostedId: "deepseek-r1",
  platformLink: DEEPSEEK_PLATORM_LINK,
  imageInput: false
}

export const DEEPSEEK_LLM_LIST: LLM[] = [
  DEEPSEEK_LLM_MODEL,
  DEEPSEEK_CODER_MODEL,
  DEEPSEEK_CODER_V2_MODEL,
  DEEPSEEK_V2_MODEL,
  DEEPSEEK_V2_5_MODEL,
  DEEPSEEK_V3_MODEL,
  DEEPSEEK_R1_MODEL,
  DEEPSEEK_CHAT_MODEL,
  DEEPSEEK_REASONER_MODEL
]
