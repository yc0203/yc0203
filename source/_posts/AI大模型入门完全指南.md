---
title: AI 大模型入门完全指南：大模型、Agent、API、Skill 详解
date: 2026-09-04 10:00:00
tags:
  - AI
  - 大模型
  - Agent
  - API
  - Skill
categories:
  - AI
  - 介绍
description: 详细介绍什么是大模型、大模型原理、Agent、API、Skill 等 AI 核心概念，适合零基础入门。
toc: true
---

# AI 大模型入门完全指南：大模型、Agent、API、Skill 详解

## 一、什么是 AI 大模型

AI 大模型是指参数量非常大、经过海量数据训练的深度学习模型。

它可以理解文字、生成文字、编写代码、分析图片、处理语音等。

常见的大模型包括：

- OpenAI GPT 系列
- Google Gemini
- Anthropic Claude
- Meta Llama
- DeepSeek
- 阿里 Qwen
- 智谱 GLM
- Moonshot Kimi
- 腾讯混元

## 二、大模型是怎么工作的：通俗原理

### 1. 基本流程

```text
输入文字
    ↓
Token 化
    ↓
神经网络计算
    ↓
预测下一个 Token
    ↓
输出文字
```

### 2. Token 是什么

Token 是模型处理文字的最小单位。

它可能是一个词、半个词，甚至一个汉字。

例如：

```text
"Hello World"
```

可能被拆成：

```text
Hello
World
```

不同模型使用的 Tokenizer 不同，所以同一个文本在不同模型里的 Token 数量可能不一样。

### 3. 参数是什么

参数是模型内部的"可调旋钮"。

参数越多，模型通常能力越强，但需要的计算资源也越大。

例如：

- 7B 模型：约 70 亿参数
- 70B 模型：约 700 亿参数
- 大模型往往有数千亿甚至上万亿参数

### 4. 训练和推理

| 阶段 | 作用 |
|---|---|
| 预训练 | 让模型学习大量文本规律 |
| 微调 | 让模型学会特定任务 |
| 推理 | 用户输入后生成回答 |

### 5. Transformer 是什么

现代大模型大多基于 Transformer 架构。

它的核心思想是"注意力机制"：

- 模型会关注输入中最重要的部分
- 能理解词语之间的上下文关系
- 能处理长文本依赖

简单理解：

```text
传统模型：按顺序读句子
Transformer：同时看整句话，重点注意关键词
```

## 三、什么是 API

### 1. API 概念

API 是"应用程序编程接口"。

在 AI 场景中，API 就是厂商提供的一个网络接口，让开发者把大模型能力集成到自己的程序里。

### 2. 常见形式

大模型 API 通常是一个 HTTP 地址。

例如：

```text
https://api.openai.com/v1/chat/completions
```

开发者发送请求，模型返回结果。

### 3. 请求通常包含

- API Key：身份凭证
- model：模型名称
- messages：对话内容
- temperature：随机性
- max_tokens：最大返回长度

### 4. 一个最简单的 API 调用概念

```text
用户程序
    ↓
HTTP POST
    ↓
大模型 API
    ↓
返回 JSON
    ↓
用户程序展示结果
```

## 四、什么是 Agent

### 1. Agent 是什么

Agent 可以理解为一个"能自己思考和行动的 AI 助手"。

普通大模型只会聊天，Agent 会：

- 理解任务
- 拆解任务
- 调用工具
- 查看结果
- 继续执行
- 最终完成任务

### 2. Agent 的核心组成

| 组件 | 作用 |
|---|---|
| 大模型 | 大脑，负责理解和决策 |
| 工具 | 手，负责执行具体操作 |
| 记忆 | 记录上下文和历史 |
| 规划 | 拆解复杂任务 |
| 反思 | 判断结果是否正确 |

### 3. Agent 和 Chatbot 的区别

```text
Chatbot：你问我答
Agent：你给我任务，我自己拆解并完成
```

## 五、什么是 Skill

### 1. Skill 是什么

Skill 可以理解成"给 AI 准备的技能包"。

它告诉模型：

- 有什么工具可以用
- 工具怎么调用
- 什么情况下使用
- 参数格式是什么

### 2. 和 Function Calling 的关系

不同厂商叫法不同：

- OpenAI：Function Calling / Tools
- Anthropic：Tool Use
- 通用概念：Skill / MCP Tool

本质上都是让模型可以调用外部能力。

### 3. Skill 的例子

例如给 AI 加一个"查天气技能"：

```json
{
  "name": "get_weather",
  "description": "查询某个城市的天气",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "城市名"
      }
    }
  }
}
```

模型发现用户问天气时，会返回一个调用请求，然后由程序真正执行天气查询。

## 六、什么是 MCP

MCP 全称 Model Context Protocol，是一种让 AI 接入外部工具的统一协议。

可以把 MCP 理解成 AI 世界的 USB 接口：

- 不用每个模型单独定制
- 一套工具可以给多个 AI 使用
- 方便连接数据库、浏览器、文件系统等

## 七、什么是 Prompt

Prompt 是用户给模型的输入提示。

好的 Prompt 可以大幅提升回答质量。

### 常见 Prompt 技巧

- 明确角色
- 明确任务
- 给出格式
- 给出示例
- 限制长度
- 让模型一步一步思考

## 八、什么是 System Prompt

System Prompt 是系统级别的指令，通常用来设定 AI 的角色和行为。

例如：

```text
你是一个专业的中文技术写作者，回答要通俗易懂。
```

## 九、什么是 Context Window

Context Window 是模型一次能处理的最大上下文长度。

例如：

- 32K：约 3 万字左右
- 128K：约 20 万字左右
- 1M：百万级 Token

如果输入太长，超出上下文窗口，模型会遗忘早期内容。

## 十、什么是 RAG

RAG 全称 Retrieval-Augmented Generation，检索增强生成。

### 简单理解

```text
用户提问
    ↓
先从知识库搜索相关资料
    ↓
把资料和问题一起交给大模型
    ↓
生成回答
```

### RAG 的作用

- 解决大模型不知道最新信息的问题
- 解决私有知识问题
- 减少幻觉

## 十一、什么是 Fine-tuning

Fine-tuning 是微调，就是在大模型基础上，用特定数据继续训练。

### 什么时候需要微调

- 需要固定输出格式
- 需要学习特定领域术语
- 需要模仿特定写作风格

### 什么时候不需要微调

- 只需要临时告诉模型规则：用 Prompt
- 需要最新知识：用 RAG
- 需要外部工具：用 Function Calling / Skill

## 十二、大模型的调用方式

### 1. Web 对话

直接使用 ChatGPT、Claude、DeepSeek 等网站。

适合普通用户。

### 2. API 调用

适合开发者，可以嵌入自己的产品。

### 3. 本地部署

使用 Ollama、vLLM 等工具运行开源模型。

适合隐私敏感场景。

## 十三、总结

```text
大模型：大脑
API：接口
Agent：会行动的助手
Skill：技能
Function Calling：调用能力
MCP：统一工具协议
Prompt：指令
RAG：外接知识
Fine-tuning：深度定制
```

掌握这些概念后，你就基本理解 AI 应用开发的全貌了。
