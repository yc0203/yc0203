---
title: AI 大模型调用实战：热门模型客户端、API 协议与 Agent 接入全攻略
date: 2026-09-04 10:30:00
tags:
  - AI
  - 大模型
  - API
  - Agent
  - MCP
categories:
  - AI
  - 调用
description: 实战讲解热门大模型客户端安装、Web 版本、API 调用格式、终端工具、流式协议、Function Calling 与 Agent 接入原理。
toc: true
---

# AI 大模型调用实战：热门模型客户端、API 协议与 Agent 接入全攻略

## 一、热门大模型服务总览

| 厂商 | 代表模型 | 官网/API 地址 | 特点 |
|---|---|---|---|
| OpenAI | GPT-4o、GPT-4.1、o3 | https://api.openai.com | 生态最完善 |
| Anthropic | Claude 3.5/3.7/4 | https://api.anthropic.com | 长文本、代码能力强 |
| Google | Gemini 2.0/2.5 | https://generativelanguage.googleapis.com | 多模态强 |
| DeepSeek | DeepSeek-V3、R1 | https://api.deepseek.com | 便宜、推理强 |
| 阿里云 | Qwen-Max、Qwen-Plus | https://dashscope.aliyuncs.com | 中文生态好 |
| 智谱 AI | GLM-4、GLM-4-Plus | https://open.bigmodel.cn | 国内易接入 |
| Moonshot | Kimi K2 | https://api.moonshot.cn | 长文本 |
| 腾讯云 | 混元大模型 | https://api.tencent.com | 腾讯生态 |

## 二、API 调用前需要了解的核心概念

### 1. API Key

API Key 是你的身份凭证。

- 不要泄露
- 不要提交到 Git
- 建议使用环境变量保存

### 2. Base URL

Base URL 是 API 的基础地址。

不同厂商不同，例如：

```text
OpenAI:  https://api.openai.com/v1
DeepSeek: https://api.deepseek.com
Moonshot: https://api.moonshot.cn/v1
```

### 3. Model Name

每个 API 都需要指定模型名称，例如：

```text
gpt-4o
claude-3-7-sonnet
deepseek-chat
qwen-plus
glm-4-plus
kimi-k2
```

### 4. OpenAI 兼容格式

现在很多厂商都支持 OpenAI 兼容格式，方便迁移。

一个通用的 Chat Completion 请求长这样：

```json
{
  "model": "deepseek-chat",
  "messages": [
    {
      "role": "system",
      "content": "你是一个助手"
    },
    {
      "role": "user",
      "content": "你好"
    }
  ]
}
```

## 三、使用 curl 调用 API

### OpenAI / DeepSeek 兼容接口

```bash
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "user", "content": "你好"}
    ]
  }'
```

### Anthropic Claude 接口

```bash
curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-3-7-sonnet-latest",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "你好"}
    ]
  }'
```

## 四、使用 Python 调用 API

### 安装 OpenAI SDK

```bash
pip install openai
```

### 调用 OpenAI / DeepSeek / Qwen 等兼容 API

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.deepseek.com"
)

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "user", "content": "你好"}
    ]
)

print(response.choices[0].message.content)
```

### 使用 requests 直接调用

```python
import requests

url = "https://api.deepseek.com/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "model": "deepseek-chat",
    "messages": [
        {"role": "user", "content": "你好"}
    ]
}

resp = requests.post(url, headers=headers, json=data)
print(resp.json()["choices"][0]["message"]["content"])
```

## 五、使用 Node.js 调用 API

```bash
npm install openai
```

```js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.deepseek.com"
});

const response = await client.chat.completions.create({
  model: "deepseek-chat",
  messages: [
    { role: "user", content: "你好" }
  ]
});

console.log(response.choices[0].message.content);
```

## 六、Web 版本使用

| 产品 | 地址 | 说明 |
|---|---|---|
| ChatGPT | https://chat.openai.com | OpenAI 官方 |
| Claude | https://claude.ai | Anthropic 官方 |
| Gemini | https://gemini.google.com | Google 官方 |
| DeepSeek | https://chat.deepseek.com | DeepSeek 官方 |
| Kimi | https://kimi.moonshot.cn | Moonshot |
| 通义千问 | https://tongyi.aliyun.com | 阿里 |
| 智谱清言 | https://chatglm.cn | 智谱 |

Web 版本适合日常对话、写作、分析文档，不需要写代码。

## 七、终端版本安装与使用

### 1. Ollama：本地运行开源模型

#### 安装

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Windows 直接下载安装包：https://ollama.com

#### 下载并运行模型

```bash
ollama run qwen2.5
```

#### 通过 API 调用本地模型

```bash
curl http://localhost:11434/api/generate \
  -d '{"model": "qwen2.5", "prompt": "你好"}'
```

### 2. Claude Code：Anthropic 官方终端工具

需要安装 Node.js：

```bash
npm install -g @anthropic-ai/claude-code
```

然后登录：

```bash
claude
```

Claude Code 可以在终端里：

- 读取项目文件
- 修改代码
- 执行命令
- 调用工具

### 3. OpenAI Codex CLI

```bash
npm install -g @openai/codex
```

登录后：

```bash
codex
```

### 4. aichat：通用终端 AI 客户端

```bash
cargo install aichat
```

或者下载对应系统安装包。

配置：

```yaml
model: deepseek-chat
api_base: https://api.deepseek.com
```

使用：

```bash
aichat "解释什么是 Agent"
```

## 八、流式输出 SSE

大模型生成文字需要时间，很多 API 支持流式输出。

### 为什么需要流式输出

- 用户等待时间更短
- 体验像打字机
- 适合对话式产品

### OpenAI 兼容流式调用

```bash
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "stream": true,
    "messages": [
      {"role": "user", "content": "写一段代码"}
    ]
  }'
```

响应是 SSE 格式：

```text
data: {"choices":[{"delta":{"content":"你"}}]}
data: {"choices":[{"delta":{"content":"好"}}]}
data: [DONE]
```

### Python 流式调用

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.deepseek.com"
)

stream = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True
)

for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="")
```

## 九、Function Calling / Tool Use

Function Calling 让大模型可以调用外部函数。

### 调用流程

```text
用户提问
    ↓
程序把可用工具列表发给模型
    ↓
模型判断需要调用哪个工具
    ↓
模型返回工具调用参数
    ↓
程序真正执行工具
    ↓
把工具结果返回给模型
    ↓
模型生成最终回答
```

### 工具定义示例

```json
{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "查询天气",
    "parameters": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string"
        }
      },
      "required": ["city"]
    }
  }
}
```

### 请求中传入 tools

```python
client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "user", "content": "北京天气怎么样？"}
    ],
    tools=[tool_definition]
)
```

### 模型可能返回

```json
{
  "name": "get_weather",
  "arguments": "{\"city\":\"北京\"}"
}
```

然后程序执行天气查询，再把结果返回给模型。

## 十、Agent 是如何调用大模型的

### 1. Agent 的循环

```text
接收任务
    ↓
调用大模型做规划
    ↓
选择工具
    ↓
执行工具
    ↓
把结果返回给大模型
    ↓
判断任务是否完成
    ↓
未完成则继续循环
```

### 2. Agent 需要什么

- 一个或多个大模型
- 工具列表
- 记忆系统
- 任务管理逻辑

### 3. 常见 Agent 框架

| 框架 | 说明 |
|---|---|
| LangChain | 最流行的 LLM 应用框架 |
| LlamaIndex | 擅长知识库和 RAG |
| AutoGPT | 自动执行任务的 Agent |
| CrewAI | 多 Agent 协作 |
| Dify | 可视化 AI 应用平台 |
| Coze | 字节跳动扣子 |
| 腾讯元器 | 腾讯 Agent 平台 |

## 十一、MCP：Model Context Protocol

MCP 是 Anthropic 提出的开放协议，目的是统一 AI 和工具之间的连接。

### MCP 角色

- MCP Host：AI 应用，例如 Claude Desktop
- MCP Client：负责连接
- MCP Server：提供工具，例如文件系统、数据库、浏览器

### MCP 能做什么

- 一个工具可以被多个 AI 使用
- 不需要每个模型单独适配
- 支持文件、数据库、HTTP API、浏览器等

### 常见 MCP Server

- filesystem：文件读写
- github：GitHub 操作
- fetch：抓取网页
- sqlite：操作 SQLite 数据库
- playwright：浏览器自动化

## 十二、如何识别一个 API 是哪种格式

### 1. 看 Base URL

```text
/v1/chat/completions
```

一般是 OpenAI 兼容格式。

```text
/v1/messages
```

一般是 Anthropic 格式。

### 2. 看请求头

OpenAI 兼容：

```text
Authorization: Bearer KEY
```

Anthropic：

```text
x-api-key: KEY
anthropic-version: 2023-06-01
```

Google：

```text
x-goog-api-key: KEY
```

### 3. 看鉴权方式

| 厂商 | 鉴权方式 |
|---|---|
| OpenAI | Bearer Token |
| Anthropic | x-api-key |
| Google | x-goog-api-key / API Key |
| DeepSeek | Bearer Token |
| 阿里 DashScope | Bearer Token |
| 智谱 | Bearer Token |

## 十三、底层原理

### 1. 一次 API 调用到底发生了什么

```text
你的程序
    ↓
发送 HTTP 请求
    ↓
服务端验证 API Key
    ↓
检查模型是否存在
    ↓
把 messages 转成 Token
    ↓
加载模型权重
    ↓
GPU 推理，逐步生成 Token
    ↓
流式或一次性返回结果
    ↓
你的程序解析 JSON
```

### 2. 为什么同一个 Prompt 每次结果可能不同

大模型生成时带有随机性，受 temperature 参数影响。

- temperature 低：更确定
- temperature 高：更多样

### 3. 为什么 Agent 能调用工具

模型本身不会真正执行代码。

Agent 框架做的事情是：

```text
让模型输出"我想调用什么工具"
    ↓
程序解析这个意图
    ↓
程序去执行真实工具
    ↓
把真实结果返回给模型
```

所以 Agent 的能力 = 大模型 + 工具 + 流程控制。

## 十四、最佳实践

### 1. API Key 安全

```bash
# Windows PowerShell 临时设置
$env:OPENAI_API_KEY = "你的 Key"
```

不要写死在代码里。

### 2. 根据场景选择模型

- 通用对话：GPT-4o、Claude、DeepSeek
- 中文场景：Qwen、GLM、DeepSeek
- 长文本：Kimi、Gemini
- 代码：Claude、GPT、DeepSeek
- 本地私有化：Llama、Qwen、Ollama

### 3. 优先使用 OpenAI 兼容接口

很多国产模型都兼容 OpenAI 格式，只需要改：

- base_url
- api_key
- model

代码可以做到很少改动。

## 十五、总结

```text
Web：直接聊
API：给程序用
终端：给开发者用
Function Calling：让模型调用工具
Agent：自动完成复杂任务
MCP：统一工具接入协议
```

从最简单的 curl 开始，再到 Python SDK，最后理解 Agent 调用循环，你就能掌握大模型应用开发的核心链路。
