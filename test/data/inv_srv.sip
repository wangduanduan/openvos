INVITE sip:andrei@mobile69 SIP/2.0
Via: SIP/2.0/UDP dorian.fokus.gmd.de 
From: "test" <sip:andrei@iptel.org>;tag=b96b0300ed30f1286-2f5d
Call-ID: b96b0300-88d30f-66da-63aa@195.37.78.190
CSeq: 101 INVITE
Expires: 180
Max-Forwards:  0
User-Agent: testing lookups
Accept: application/sdp
Content-Length: 225


v=0
o=CiscoSystemsSIP-IPPhone-UserAgent 14474 8233 IN IP4 195.37.78.190
s=SIP Call
c=IN IP4 195.37.78.190
t=0 0
m=audio 18456 RTP/AVP 0 8 18 101
a=rtpmap:0 pcmu/8000
a=rtpmap:101 telephone-event/8000
a=fmtp:101 0-11 
