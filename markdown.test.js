// Tests for the renderMarkdown function in markdown.js
var md = require("./markdown");
var renderMarkdown = md.renderMarkdown;

test("turns a level 1 heading into an h1 tag", function () {
  expect(renderMarkdown("# Hello")).toBe("<h1>Hello</h1>");
});

test("turns level 2 and level 3 headings into h2 and h3 tags", function () {
  expect(renderMarkdown("## Sub")).toBe("<h2>Sub</h2>");
  expect(renderMarkdown("### Small")).toBe("<h3>Small</h3>");
});

test("wraps a normal line of text in a paragraph", function () {
  expect(renderMarkdown("just some text")).toBe("<p>just some text</p>");
});

test("makes text bold with double asterisks", function () {
  expect(renderMarkdown("this is **bold**")).toBe("<p>this is <strong>bold</strong></p>");
});

test("makes text italic with single asterisks", function () {
  expect(renderMarkdown("this is *italic*")).toBe("<p>this is <em>italic</em></p>");
});

test("formats inline code with backticks", function () {
  expect(renderMarkdown("run `npm test`")).toBe("<p>run <code>npm test</code></p>");
});

test("turns markdown links into anchor tags", function () {
  expect(renderMarkdown("[Google](http://google.com)")).toBe(
    '<p><a href="http://google.com">Google</a></p>'
  );
});

test("turns dash lines into a bullet list", function () {
  expect(renderMarkdown("- one\n- two")).toBe("<ul><li>one</li><li>two</li></ul>");
});

test("closes the list when a normal line comes after bullets", function () {
  expect(renderMarkdown("- item\ntext")).toBe("<ul><li>item</li></ul><p>text</p>");
});

test("skips blank lines", function () {
  expect(renderMarkdown("# Title\n\ntext")).toBe("<h1>Title</h1><p>text</p>");
});

test("escapes html special characters so they are not treated as tags", function () {
  expect(renderMarkdown("a < b & c")).toBe("<p>a &lt; b &amp; c</p>");
});
