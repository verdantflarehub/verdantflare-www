export const modelCategories = [
  "文本生成",
  "推理模型",
  "图片理解",
  "视频生成",
  "语音合成",
  "全模态",
];

export const providers = [
  "深度求索",
  "青焰",
  "月之暗面",
  "智谱",
  "可灵",
  "MiniMax",
  "通义实验室",
];

export const models = [
  {
    id: "deepseek-v4-pro",
    name: "DeepSeek-V4-pro",
    provider: "深度求索",
    categories: ["文本生成", "推理模型"],
    summary:
      "拥有百万字超长上下文，在 Agent 能力、世界知识和推理性能上均实现国内开源领域领先。",
    inputPrice: 12000,
    outputPrice: 24000,
    cachePrice: 1000,
    date: "2026.04.28",
    accent: "deepseek",
    context: "1,000k",
    maxInput: "1,000k",
    maxOutput: "384k",
    tags: ["深度思考", "函数调用", "联网搜索", "MCP"],
  },
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek-V4-Flash",
    provider: "深度求索",
    categories: ["文本生成", "深度求索"],
    summary:
      "面向高频调用场景优化，保留长上下文能力，适合对话助手、批量摘要和轻量 Agent 工作流。",
    inputPrice: 1000,
    outputPrice: 2000,
    cachePrice: 500,
    date: "2026.04.24",
    accent: "deepseek",
    context: "512k",
    maxInput: "512k",
    maxOutput: "128k",
    tags: ["高性价比", "低延迟", "批量处理"],
  },
  {
    id: "glm-5-1",
    name: "GLM-5.1",
    provider: "智谱",
    categories: ["推理模型", "文本生成"],
    summary:
      "智谱旗舰推理模型，代码能力大幅增强，适合复杂任务编排、工程化代理和知识问答。",
    inputPrice: 6000,
    outputPrice: 24000,
    cachePrice: 1000,
    date: "2026.04.08",
    accent: "zhipu",
    context: "256k",
    maxInput: "256k",
    maxOutput: "64k",
    tags: ["代码", "复杂任务", "工具调用"],
  },
  {
    id: "joyai-llm-flash",
    name: "JoyAI-LLM-Flash",
    provider: "青焰",
    categories: ["推理模型", "文本生成"],
    summary:
      "青焰自研低延迟模型，适合客服、营销脚本、轻量工作流和稳定批量调用。",
    inputPrice: 750,
    outputPrice: 3000,
    cachePrice: 300,
    date: "2026.03.24",
    accent: "joyai",
    context: "128k",
    maxInput: "128k",
    maxOutput: "32k",
    tags: ["低延迟", "稳定", "青焰推荐"],
  },
  {
    id: "qingyan-dance-2",
    name: "青焰Dance-2.0",
    provider: "青焰",
    categories: ["视频生成", "全模态"],
    summary:
      "面向舞蹈短视频和人物动作生成的青焰视频模型，适合口播舞蹈、虚拟人动作和商业创意预演。",
    inputPrice: 9800,
    outputPrice: 26800,
    cachePrice: 0,
    date: "2026.07.01",
    accent: "joyai",
    context: "video",
    maxInput: "图文/动作",
    maxOutput: "15s",
    tags: ["舞蹈生成", "动作一致", "青焰推荐"],
  },
  {
    id: "glm-5-2",
    name: "GLM-5.2",
    provider: "智谱",
    categories: ["文本生成", "推理模型"],
    summary:
      "面向长任务时代的旗舰模型，支持真正可用的百万级上下文和稳定的工程应用能力。",
    inputPrice: 11200,
    outputPrice: 39200,
    cachePrice: 1200,
    date: "2026.06.17",
    accent: "zhipu",
    context: "1,000k",
    maxInput: "1,000k",
    maxOutput: "256k",
    tags: ["百万上下文", "工程任务", "深度思考"],
  },
  {
    id: "kimi-k2-6",
    name: "Kimi-K2.6",
    provider: "月之暗面",
    categories: ["文本生成", "图片理解"],
    summary:
      "面向工程化编程和长周期自主任务的专家大模型，适合代码审阅、文档分析和代理任务。",
    inputPrice: 6500,
    outputPrice: 27000,
    cachePrice: 900,
    date: "2026.05.12",
    accent: "kimi",
    context: "512k",
    maxInput: "512k",
    maxOutput: "128k",
    tags: ["代码", "多模态", "长任务"],
  },
  {
    id: "kimi-k2-5",
    name: "Kimi-K2.5",
    provider: "月之暗面",
    categories: ["文本生成", "图片理解"],
    summary:
      "Kimi 系列稳定版本，擅长文档阅读、视觉理解和通用智能任务。",
    inputPrice: 4000,
    outputPrice: 21000,
    cachePrice: 700,
    date: "2026.01.27",
    accent: "kimi",
    context: "256k",
    maxInput: "256k",
    maxOutput: "64k",
    tags: ["文档", "视觉", "通用任务"],
  },
  {
    id: "minimax-m2-7",
    name: "MiniMax-M2.7",
    provider: "MiniMax",
    categories: ["文本生成", "推理模型"],
    summary:
      "能够自行构建复杂 Agent Harness，擅长复杂 Skills、Tool Search 和办公生产力任务。",
    inputPrice: 2730,
    outputPrice: 10920,
    cachePrice: 500,
    date: "2026.03.18",
    accent: "minimax",
    context: "256k",
    maxInput: "256k",
    maxOutput: "64k",
    tags: ["Agent", "工具", "办公"],
  },
  {
    id: "glm-5",
    name: "GLM-5",
    provider: "智谱",
    categories: ["文本生成"],
    summary:
      "专注复杂系统工程和长周期智能体任务，参数规模与稳定性适合企业级应用。",
    inputPrice: 4000,
    outputPrice: 18000,
    cachePrice: 700,
    date: "2026.02.12",
    accent: "zhipu",
    context: "384k",
    maxInput: "384k",
    maxOutput: "96k",
    tags: ["企业", "稳定", "复杂任务"],
  },
  {
    id: "deepseek-v3-2",
    name: "DeepSeek-V3.2",
    provider: "深度求索",
    categories: ["文本生成"],
    summary:
      "目标是平衡推理能力与输出长度，适合日常使用、问答场景和通用 Agent 任务。",
    inputPrice: 2000,
    outputPrice: 3000,
    cachePrice: 400,
    date: "2025.12.01",
    accent: "deepseek",
    context: "128k",
    maxInput: "128k",
    maxOutput: "64k",
    tags: ["通用", "问答", "均衡"],
  },
  {
    id: "qwen3-6-27b",
    name: "qwen3.6-27b",
    provider: "通义实验室",
    categories: ["文本生成"],
    summary:
      "轻量视觉语言 Dense 模型，推理能力和 Agentic coding 能力进一步增强。",
    inputPrice: 3000,
    outputPrice: 18000,
    cachePrice: 500,
    date: "2026.04.27",
    accent: "qwen",
    context: "128k",
    maxInput: "128k",
    maxOutput: "32k",
    tags: ["轻量", "编码", "视觉语言"],
  },
  {
    id: "qwen3-6-35b-a3b",
    name: "qwen3.6-35b-a3b",
    provider: "通义实验室",
    categories: ["文本生成"],
    summary:
      "基于混合架构设计，融合线性注意力机制，兼顾响应速度和推理表现。",
    inputPrice: 1800,
    outputPrice: 10800,
    cachePrice: 400,
    date: "2026.04.27",
    accent: "qwen",
    context: "128k",
    maxInput: "128k",
    maxOutput: "32k",
    tags: ["混合架构", "低成本", "推理"],
  },
  {
    id: "minimax-m2-5",
    name: "MiniMax-M2.5",
    provider: "MiniMax",
    categories: ["文本生成", "推理模型"],
    summary:
      "面向真实复杂环境训练，在编程、工具调用和搜索任务中表现稳定。",
    inputPrice: 2100,
    outputPrice: 8400,
    cachePrice: 400,
    date: "2026.02.13",
    accent: "minimax",
    context: "128k",
    maxInput: "128k",
    maxOutput: "48k",
    tags: ["工具调用", "搜索", "编程"],
  },
  {
    id: "kling-video-o1",
    name: "kling-video-o1",
    provider: "可灵",
    categories: ["视频生成"],
    summary:
      "多模态视频语言模型，支持图像、主体、多镜头和文字视频生成。",
    inputPrice: 720,
    outputPrice: 7200,
    cachePrice: 0,
    date: "2026.06.11",
    accent: "kling",
    context: "video",
    maxInput: "图文",
    maxOutput: "10s",
    tags: ["视频生成", "主体一致", "多镜头"],
  },
  {
    id: "kling-v2-master",
    name: "kling-v2-master",
    provider: "可灵",
    categories: ["视频生成"],
    summary:
      "可灵 AI V2 系列旗舰视频生成模型，适合电影级短片、品牌广告和商业短片。",
    inputPrice: 12000,
    outputPrice: 24000,
    cachePrice: 0,
    date: "2026.06.04",
    accent: "kling",
    context: "video",
    maxInput: "图文",
    maxOutput: "10s",
    tags: ["旗舰", "商业短片", "高质量"],
  },
];

export const getModelById = (id) =>
  models.find((model) => model.id === id) ?? models[0];

export const apiExamples = {
  curl: `#!/bin/bash

# 从环境变量获取 API 密钥
API_KEY="your_api_key"
BASE_URL="https://api.verdantflarehub.com/v1"

curl \${BASE_URL}/chat/completions \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer \${API_KEY}" \\
  -d '{
    "model": "deepseek-v4-pro",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful and harmless assistant. You should think step-by-step."
      },
      {
        "role": "user",
        "content": "请用三句话解释青焰模型市场的优势。"
      }
    ],
    "temperature": 0.7,
    "stream": false
  }'`,
  python: `from openai import OpenAI

client = OpenAI(
    api_key="your_api_key",
    base_url="https://api.verdantflarehub.com/v1",
)

completion = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "请生成一个视频广告脚本。"},
    ],
)

print(completion.choices[0].message.content)`,
  openai: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.QINGYAN_API_KEY,
  baseURL: "https://api.verdantflarehub.com/v1",
});

const response = await client.chat.completions.create({
  model: "deepseek-v4-pro",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "写一个适合电商短片的提示词。" },
  ],
});

console.log(response.choices[0].message.content);`,
};
