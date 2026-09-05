/*
 * slide_helpers.js —— PPT 翻页与句级下划线的纯逻辑工具
 * 通用格式：在浏览器挂到 window.SlideHelpers，在 Node(CommonJS) 走 module.exports。
 * 与 DOM/音频解耦，便于单元测试。
 */
(function (global) {
  /* 按累计高度做贪心分页。
   * heights: number[] 每个段落的高度(不含间距)；gap: 段间间距；avail: 可用高度。
   * 返回分块，每块为段落下标数组。空输入返回 [[]]。
   * 与原文等价的贪心约定：只有当前块非空且再加一段会超界时才换页。
   */
  function groupByHeight(heights, gap, avail) {
    var slides = [], buf = [], used = 0;
    for (var i = 0; i < heights.length; i++) {
      var h = heights[i] + gap;
      if (used + h > avail && buf.length) { slides.push(buf); buf = []; used = 0; }
      buf.push(i); used += h;
    }
    if (buf.length) slides.push(buf);
    return slides.length ? slides : [[]];
  }

  /* 无时间戳时的句级起始回退：按句子字符长度在总时长内等比分配。
   * lengths: number[] 每句字数；total: 音频总时长(秒)。
   * 返回每句的起始时间(秒)，已剔除 0/负 长度并补齐为至少 1。
   */
  function computeSentenceStarts(lengths, total) {
    var safe = (lengths || []).map(function (L) { return Math.max(1, L); });
    var sum = safe.reduce(function (a, b) { return a + b; }, 0) || 1;
    var out = [], acc = 0;
    for (var i = 0; i < safe.length; i++) {
      out.push(acc / sum * total);
      acc += safe[i];
    }
    return out;
  }

  /* 给定句级起始数组与当前播放时刻 t，返回正在朗读的句子下标。
   * starts: number[]（升序）；t: 秒。t 落在 [start_k, start_{k+1}) 内归 k；
   * t 超界归最后一小节。空输入返回 -1。
   */
  function sentenceIndexAt(starts, t) {
    if (!starts || !starts.length) return -1;
    var i = starts.findIndex(function (s) { return s > t; }) - 1;
    if (i < 0) i = starts.length - 1;
    return i;
  }

  var api = { groupByHeight: groupByHeight, computeSentenceStarts: computeSentenceStarts, sentenceIndexAt: sentenceIndexAt };
  global.SlideHelpers = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);