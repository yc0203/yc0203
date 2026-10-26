'use strict';
// Register site-owned templates without editing installed Butterfly files.
const fs = require('fs');
const path = require('path');
hexo.extend.filter.register('before_generate', function () {
  if (this.config.theme !== 'butterfly') return;
  for (const view of ['index.pug', 'post.pug', 'page.pug', 'cheng-taxonomy.pug', 'includes/footer.pug']) {
    this.theme.setView(view, fs.readFileSync(path.join(this.base_dir, 'layouts', view), 'utf8'));
  }
});
hexo.extend.filter.register('after_render:html', function (html) {
  if (this.config.theme !== 'butterfly') return html;
  return html.replace(/<body([^>]*)>/, '<body$1><a class="skip-link" href="#content-inner">跳转到正文</a><div class="site-status"><span>cheng.blog / personal space</span><span class="status-note"><i aria-hidden="true"></i> 保持好奇，持续记录</span><span class="status-edition">notes, code &amp; everyday life</span></div>');
});
