// Editorial translations are bound to the exact reviewed source copy. If an
// operator changes the catalog record, show the new original rather than a
// stale translation. Control remains the source of truth for catalog facts.
const english = {
  modelName: {
    "青焰 Dance 2.0 (SD2)": "VerdantFlare Dance 2.0 (SD2)",
  },
  modelSummary: {
    "支持文本生成、推理与图像输入的 DeepSeek 模型，通过青焰模型网关调用。":
      "A DeepSeek model for text generation, reasoning, and image input, available through the VerdantFlare model gateway.",
    "面向复杂推理、编码与工具调用任务的 DeepSeek 模型，通过青焰模型网关调用。":
      "A DeepSeek model for complex reasoning, coding, and tool use, available through the VerdantFlare model gateway.",
    "面向舞蹈短视频、广告创意和商品种草场景的视频生成模型；支持异步提交任务并查询视频结果。":
      "A video generation model for dance clips, ads, and product showcases. Submit tasks asynchronously and retrieve the video results.",
  },
  appSummary: {
    "音乐生成与音频处理 MCP 工具；实际能力以服务预检为准。":
      "MCP tools for music generation and audio processing. Available capabilities depend on the current service preflight.",
    "统一的视频生成与处理工作台，支持模型选择、任务查询和结果管理。":
      "A unified workspace for video generation and processing, with model selection, task tracking, and result management.",
  },
  appDescription: {
    "Music MCP v0.9.4 已在成都算力集群运行。公开目录不代表 Hub 在线体验已开放或组织具有使用权益；具体工具是否就绪须按当前服务预检核验。":
      "Music MCP v0.9.4 is running in the Chengdu compute cluster. This public listing does not mean Hub online experience is available or that your organization has access. Check current service preflight results for tool readiness.",
    "Video MCP v0.11.9 已在 5090 开发/测试集群运行。此公开目录记录不表示客户 Station 已安装或当前组织具有使用权益。":
      "Video MCP v0.11.9 is running in the 5090 development/test cluster. This public listing does not mean it is installed on a customer's Station or available to your organization.",
  },
  modelSpec: {
    "输入与输出合计 ≤ 1,048,576 tokens": "Input and output combined ≤ 1,048,576 tokens",
  },
  modelPriceUnit: {
    "美元/百万 tokens · DeepSeek 官方参考成本":
      "USD per million tokens · DeepSeek official reference cost",
  },
};

export const localizeCatalog = (field, value, locale) => {
  if (locale !== "en" || !value) return value || "";
  if (field === "modelPrice") return value.replaceAll("谷时", "Off-peak").replaceAll("峰时", "Peak");
  return english[field]?.[value] || value;
};

export const isOriginalChinese = (value, locale) => locale === "en" && /\p{Script=Han}/u.test(value || "");
