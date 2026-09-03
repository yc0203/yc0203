---
title: 关于
date: 2026-08-31 00:00:00
type: about
---

<div style="text-align:center;margin:20px 0 30px;">
<button onclick="toggleLang()" style="padding:8px 20px;border:1px solid #ccc;border-radius:20px;background:#fff;cursor:pointer;color:#555;">中文 / English</button>
</div>

<div id="intro-zh" style="line-height:1.9;">
<h2>关于我</h2>
<p><strong>姓名：</strong>YCheng</p>
<p><strong>本科：</strong>西北大学</p>
<p><strong>研究生：</strong>西北大学</p>
<p><strong>年级：</strong>研一</p>
<p><strong>专业：</strong>新一代电子信息专业</p>
<h2>个人兴趣</h2>
<p>喜欢折腾技术，热爱搭建个人博客，关注电子信息、编程开发、Git 与 GitHub。</p>
<h2>联系方式</h2>
<ul>
<li>GitHub：<a href="https://github.com/yc0203">github.com/yc0203</a></li>
</ul>
</div>

<div id="intro-en" style="line-height:1.9;display:none;">
<h2>About Me</h2>
<p><strong>Name:</strong> YCheng</p>
<p><strong>Undergraduate:</strong> Northwest University</p>
<p><strong>Graduate:</strong> Northwest University</p>
<p><strong>Grade:</strong> First-year Master's Student</p>
<p><strong>Major:</strong> New Generation Electronic Information Engineering</p>
<h2>Interests</h2>
<p>I enjoy exploring technology, building personal blogs, and learning programming, Git and GitHub.</p>
<h2>Contact</h2>
<ul>
<li>GitHub: <a href="https://github.com/yc0203">github.com/yc0203</a></li>
</ul>
</div>

<script>
function toggleLang() {
  var zh = document.getElementById("intro-zh");
  var en = document.getElementById("intro-en");
  if (zh.style.display === "none") {
    zh.style.display = "block";
    en.style.display = "none";
  } else {
    zh.style.display = "none";
    en.style.display = "block";
  }
}
</script>
