// A small Markdown to HTML converter.
// It handles the common things: headings, bold, italic, code,
// links, and bullet lists. It is not a full parser but works for notes.

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineFormat(line) {
  // bold: **text**
  line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // italic: *text*
  line = line.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // inline code: `code`
  line = line.replace(/`(.+?)`/g, "<code>$1</code>");
  // links: [text](url)
  line = line.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  return line;
}

function renderMarkdown(text) {
  var lines = escapeHtml(text).split("\n");
  var html = "";
  var inList = false;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    // bullet list item
    if (line.indexOf("- ") === 0) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += "<li>" + inlineFormat(line.substring(2)) + "</li>";
      continue;
    } else if (inList) {
      html += "</ul>";
      inList = false;
    }

    // headings
    if (line.indexOf("### ") === 0) {
      html += "<h3>" + inlineFormat(line.substring(4)) + "</h3>";
    } else if (line.indexOf("## ") === 0) {
      html += "<h2>" + inlineFormat(line.substring(3)) + "</h2>";
    } else if (line.indexOf("# ") === 0) {
      html += "<h1>" + inlineFormat(line.substring(2)) + "</h1>";
    } else if (line.trim() === "") {
      // blank line, skip
    } else {
      html += "<p>" + inlineFormat(line) + "</p>";
    }
  }

  if (inList) {
    html += "</ul>";
  }

  return html;
}
