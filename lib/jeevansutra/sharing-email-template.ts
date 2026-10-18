import "server-only"
import { loveRelationshipCopy, type CustomerReading } from "./compatibility-contract"

export function sharingEmailContent(reading: CustomerReading, senderName: string, link: string) {
 const current = "relationshipContextVersion" in reading && reading.relationshipContextVersion === "JS_RELATIONSHIP_CONTEXT_1"
 let message = "Explore your connection, your shared strengths and the differences you can understand better."
 if (current) {
  if (reading.kind === "Love & Marriage" && "relationship" in reading && Object.prototype.hasOwnProperty.call(loveRelationshipCopy, reading.relationship)) message = loveRelationshipCopy[reading.relationship].invitation
  else if (reading.kind === "Family") message = "Explore your family bond, each other’s needs and ways to build greater understanding."
  else if (reading.kind === "Friendship") message = "Discover what strengthens your friendship and how you can support each other."
  else if (reading.kind === "Business & Work") message = "Explore how your strengths, working styles and expectations fit together."
 }
 const name = senderName.replace(/[\r\n]/g, " ").trim().slice(0,120) || "A Jeevan Sutra member"
 const introduction = name + " has shared insights about your connection."
 const draft = reading.version === "JS_COMPATIBILITY_V2_DRAFT_1"
 const draftText = "STAGING DRAFT — interpretation tables are under review. Not a final customer reading."
 const accessText = "Sign in or register using the email address chosen by the sender, then accept the invitation to view."
 const expiryText = "Invitation valid for 7 days. Access is private and can be revoked by the sender."
 const ignoreText = "If you were not expecting this invitation, you can ignore this email."
 const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\u0027/g, "&#39;")
 const text = ["JEEVAN SUTRA", "Your life at the centre.", "", "Discover your connection", "", introduction, "", message, "", ...(draft ? [draftText, ""] : []), "View our shared insights:", link, "", accessText, "", expiryText, "", ignoreText, "", "Jeevan Sutra", "care@jeevansutra.co.in"].join("\n")
 const html = [
  "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Jeevan Sutra invitation</title></head>",
  "<body style=\"margin:0;padding:24px 12px;background:#FAF7F0;color:#463B3B;font-family:Arial,sans-serif;\"><table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tr><td align=\"center\"><table role=\"presentation\" width=\"600\" cellspacing=\"0\" cellpadding=\"0\" style=\"width:100%;max-width:600px;border:1px solid #C5A15A;background:#FFFDFA;\">",
  "<tr><td align=\"center\" bgcolor=\"#64263B\" style=\"padding:32px 20px;background:#64263B;border-bottom:3px solid #C5A15A;\"><div style=\"font-family:Georgia,serif;font-size:32px;line-height:1.3;color:#EAD8AD;\">JEEVAN SUTRA</div><p style=\"margin:10px 0 0;font-family:Georgia,serif;font-size:17px;color:#EAD8AD;\">Your life at the centre.</p></td></tr>",
  "<tr><td align=\"center\" style=\"padding:32px 24px;\"><p style=\"margin:0 0 18px;font-size:12px;letter-spacing:2px;color:#815020;\">A PERSONAL INVITATION</p><h1 style=\"margin:0 0 24px;font-family:Georgia,serif;font-size:32px;line-height:1.2;font-weight:normal;color:#64263B;\">Discover your connection</h1>",
  "<p style=\"margin:0 0 18px;font-size:18px;line-height:1.7;\">" + escape(introduction) + "</p><p style=\"margin:0 0 26px;font-size:17px;line-height:1.7;\">" + escape(message) + "</p>",
  draft ? "<p style=\"padding:14px;border:1px solid #C5A15A;background:#FFF6DD;font-size:14px;line-height:1.6;color:#624318;\">" + escape(draftText) + "</p>" : "",
  "<table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin:24px auto;\"><tr><td align=\"center\" bgcolor=\"#64263B\" style=\"background:#64263B;border-radius:10px;\"><a href=\"" + escape(link) + "\" style=\"display:inline-block;padding:18px 24px;border:1px solid #64263B;border-radius:10px;color:#EAD8AD;font-size:18px;font-weight:bold;text-decoration:none;\">View our shared insights</a></td></tr></table>",
  "<p style=\"margin:0 0 24px;font-size:15px;line-height:1.7;\">" + escape(accessText) + "</p><p style=\"margin:0;padding:18px;border:1px solid #E0CCAA;background:#F8EFDF;font-size:14px;line-height:1.7;\">" + escape(expiryText) + "</p>",
  "<p style=\"margin:28px 0 16px;font-size:13px;line-height:1.7;color:#766B67;\">" + escape(ignoreText) + "</p><p style=\"margin:0;font-family:Georgia,serif;font-size:20px;color:#64263B;\">Jeevan Sutra</p><p style=\"margin:8px 0 0;font-size:13px;color:#766B67;\">care@jeevansutra.co.in</p></td></tr></table></td></tr></table></body></html>"
 ].join("")
 const shareText = ["JEEVAN SUTRA", "Your life at the centre.", "", introduction, "", message, "", ...(draft ? [draftText, ""] : []), "View our shared insights:", link, "", accessText, "", "Private access | Valid for 7 days | No compatibility credit needed to view", "The sender can revoke access."].join("\n")
 return { text, html, shareText }
}
