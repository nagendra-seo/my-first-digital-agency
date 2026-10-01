export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function emailLayout({ previewText, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My First Digital Agency</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F3F0E7;font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none;font-size:1px;color:#F3F0E7;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      ${escapeHtml(previewText)}
    </span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F0E7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background-color:#1A1612;padding:24px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:#F5C319;color:#1A1612;font-weight:bold;font-size:14px;border-radius:8px;padding:8px 10px;">MF</td>
                    <td style="padding-left:10px;">
                      <div style="color:#ffffff;font-size:16px;font-weight:bold;line-height:1.1;">My First</div>
                      <div style="color:#F5C319;font-size:11px;font-weight:bold;letter-spacing:0.06em;">DIGITAL AGENCY</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#141B2B;font-size:15px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#FBFAF6;color:#7C8494;font-size:12px;">
                My First Digital Agency &middot; Strategy &middot; Traffic &middot; Leads &middot; Revenue<br />
                This is an automated message about a free-audit request. If this wasn't you, you can ignore it.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function button(label, url) {
  return `<a href="${url}" style="display:inline-block;background-color:#F5C319;color:#1A1612;font-weight:bold;text-decoration:none;padding:12px 22px;border-radius:8px;margin-top:8px;">${escapeHtml(label)}</a>`;
}

export function detailRow(label, value) {
  return `<tr>
    <td style="padding:6px 0;color:#7C8494;font-size:13px;width:40%;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;color:#141B2B;font-size:14px;font-weight:bold;vertical-align:top;">${value}</td>
  </tr>`;
}

export function detailTable(rows) {
  return `<table role="presentation" width="100%" style="margin:16px 0;border-top:1px solid #EAE5D6;border-bottom:1px solid #EAE5D6;padding:8px 0;">${rows}</table>`;
}
