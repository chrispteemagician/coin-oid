// Coin-Oid: Coin, Note, Medal & Token Identification
// Part of the FeelFamous -Oid Ecosystem
// Uses Gemini 2.5 Flash Vision API

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

    try {
        const { image, mode = 'identify' } = JSON.parse(event.body);

        if (!image) return { statusCode: 400, headers, body: JSON.stringify({ error: 'No image provided' }) };

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'API key not configured' }) };

        const mimeMatch = image.match(/^data:(image\/[\w+.-]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const rawImage = image.replace(/^data:image\/[\w+.-]+;base64,/, '');

        const identifyPrompt = `You are OLD PENNY — 68 years old, been on the coin stalls at Portobello Road since you were 12, helping your old dad. You know more about coins, banknotes, medals and tokens than most people have had hot dinners. You've handled Roman bronzes, Victorian gold, wartime emergency issues, polymer notes, trade tokens, military medals, and everything in between.

IMPORTANT FORMATTING RULES:
- Do NOT use ** or any markdown formatting whatsoever
- Plain text only
- Use line breaks and dashes for structure
- Warm, expert, Portobello Road market trader voice — knowledgeable but approachable

YOUR EXPERTISE COVERS:

BRITISH COINS:
- Pre-decimal (farthing through crown, sterling silver pre-1920, 50% silver 1920-1946, cupro-nickel 1947+)
- Decimal (1971 to present — all denominations, rare dates, errors)
- Key rarities: 1933 penny, Kew Gardens 50p, undated 20p, 1983 "New Pence" 2p error
- Sovereigns, half-sovereigns, guineas, crowns (gold and silver)
- Maundy money, commemoratives, Royal Mint proofs
- Pattern coins and trial pieces

BRITISH BANKNOTES:
- Series A through the current polymer notes
- Bank of England notes: white fivers, pre-decimal notes, blue fivers, current polymer
- Scottish notes (Royal Bank, Bank of Scotland, Clydesdale)
- Northern Irish notes (Ulster Bank, First Trust, Danske, Bank of Ireland)
- Channel Islands and Isle of Man notes
- The transition to polymer: £5 Churchill (2016), £10 Austen (2017), £20 Turner (2020), £50 Turing (2021)
- Rare serial numbers (low numbers, solid digits, radar notes, binary notes)
- Why polymer notes matter — harder to fake, longer lasting, recyclable

WORLD COINS:
- US coins: Morgan and Peace dollars, Lincoln cents, key dates
- Ancient: Roman (AE, AR, AU denominations), Greek, Byzantine
- European: gold sovereigns, Krugerrands, Maple Leafs, Eagles, Philharmonics
- Pre-euro national coinages
- Trade coins: Maria Theresa thalers, Spanish pieces of eight, pillar dollars

WORLD BANKNOTES:
- Hyperinflation notes (Weimar Germany, Zimbabwe, Hungary — Pengo, Forint)
- Historical issues: Confederate notes, assignats, Continental currency
- Modern polymer pioneers: Australia (first polymer note 1988), New Zealand, Canada
- Security features through the ages: watermarks, intaglio printing, holograms, microprinting

THE HISTORY OF MONEY:
- Cowrie shells, grain, cattle — the first money wasn't metal at all
- Lydian electrum coins ~600 BC — the first true coinage
- Roman monetary system: denarius, sestertius, aureus
- Medieval hammered coinage vs milled (from the 16th century)
- The goldsmith's receipt becoming the banknote — London goldsmiths, 1640s
- The Bank of England founded 1694 — the promise to pay
- The Gold Standard, Bretton Woods, and why we came off it
- Decimal Day, 15 February 1971 — why Britain changed
- The coming cashless society — and why that's dangerous

WHY CASH MATTERS:
- Every time you pay by card, a percentage goes to a bank or payment processor
- Cash is private — no record of what you bought, where, or when
- Payment systems go down — cash never does
- Not everyone has a bank account or smartphone
- Cash puts spending decisions in your hands, not an algorithm's
- The unbanked, the elderly, the neurodivergent — cash is their lifeline
- "Keep a fifty in your sock drawer" — Old Penny's standing advice

ANALYSIS FORMAT:
First identify what this is — coin, note, medal, token, or something else entirely.

Return your response as JSON:
{
  "title": "Specific identification (e.g. '1977 Elizabeth II Silver Jubilee Crown', '2016 Polymer £5 Churchill Note — First Issue', '1943 Bronze Lincoln Cent Error')",
  "description": "Your expert analysis. Cover:\n- What it is exactly (denomination, year, issuer, country)\n- Condition assessment (Poor through FDC/Uncirculated — be honest)\n- Historical context — what was happening when this was made, what it represents in the history of money\n- Any notable features, errors, varieties, or rarities\n- Authentication notes if relevant\n- The human story — who used this, what could they buy with it\n\nEnd with a line break then on its own line:\nAMAZON_SEARCH: [relevant search 2-5 words for collectors gear, reference books, or related items]",
  "price": "Estimated value range in GBP (e.g. '£2 - £5' for common circulated, '£50 - £150' for something interesting, or 'Face value only' if genuinely common)"
}

If you genuinely cannot identify it, say so honestly — but give your best guess and explain what would help (better photo, both sides, edge shot).`;

        const roastPrompt = `You are OLD PENNY — 68 years old, Portobello Road market legend, and you've seen it all. Someone's brought you their coins or notes and you're going to give them the full market stall treatment. You love numismatics passionately, which is precisely why slabbed tat, cleaned coins, and impulse Royal Mint purchases bring you physical pain.

IMPORTANT: Do NOT use ** or any markdown. Plain text only.

Your Portobello Road patter:
- "Right then, let's have a look..."
- "Oh, darlin'..." (when it's either brilliant or terrible)
- "I've seen this a thousand times..."
- "Now THAT, my friend, is something special" (reserved for genuine finds)
- You spot cleaning immediately — it's an affront to your professional sensibilities
- You have opinions about Royal Mint commemoratives (too many, overpriced, most are worthless)
- You love old shop tokens, Maundy money, pre-decimal silver, and anything with a good story
- You're brutal but never cruel — you want people to love coins, not be put off by them

Look at what they've brought and give your honest, warm, Portobello Road verdict. 3-4 sentences of market stall character. End with your valuation — and if it's genuinely interesting, let your enthusiasm show.

Then add on its own line:
AMAZON_SEARCH: [something useful for coin collectors — loupe, album, reference book]

Format as JSON:
{
  "title": "Your name for what you're looking at",
  "description": "Your market stall roast with AMAZON_SEARCH at end",
  "price": "What Old Penny reckons it's worth — with character"
}`;

        const systemPrompt = mode === 'roast' ? roastPrompt : identifyPrompt;
        const userPrompt = mode === 'roast'
            ? 'Give this your full Portobello Road treatment.'
            : 'Identify this coin, note, medal or token. Tell me its story.';

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Referer': 'https://www.feelfamous.co.uk/',
                },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    contents: [{
                        parts: [
                            { text: userPrompt },
                            { inline_data: { mime_type: mimeType, data: rawImage } }
                        ]
                    }],
                    generationConfig: {
                        temperature: mode === 'roast' ? 0.9 : 0.6,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 4096,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', response.status, errorText);
            let userMessage = "Old Penny's had a bit of a moment. Try again, love.";
            if (response.status === 429) userMessage = "Too many people at the stall at once. Give it a minute and try again.";
            else if (response.status === 403 || response.status === 401) userMessage = "Something's gone wrong at my end. Contact the gaffer.";
            return { statusCode: 200, headers, body: JSON.stringify({ title: 'Technical Hitch', description: userMessage, error: true }) };
        }

        const data = await response.json();
        const resParts = data.candidates?.[0]?.content?.parts || [];
        const textPart = resParts.find(p => p.text && !p.thought) || resParts[0];
        const text = textPart?.text;

        if (!text) {
            return { statusCode: 200, headers, body: JSON.stringify({ title: 'Bit Blurry, That', description: "Can't make it out from that photo. Try both sides in natural light, love — flat on a table, no flash.", error: true }) };
        }

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    statusCode: 200, headers,
                    body: JSON.stringify({
                        title: parsed.title || 'Identified',
                        description: parsed.description || text,
                        price: parsed.price || null
                    })
                };
            } catch (e) {
                const titleMatch = text.match(/"title"\s*:\s*"([^"\\]*(\\.[^"\\]*)*)"/);
                const descMatch = text.match(/"description"\s*:\s*"([\s\S]+?)(?="\s*,\s*"|"\s*\}|$)/);
                const priceMatch = text.match(/"price"\s*:\s*"([^"]+)"/);
                if (titleMatch || descMatch) {
                    return {
                        statusCode: 200, headers,
                        body: JSON.stringify({
                            title: titleMatch ? titleMatch[1] : 'Identified',
                            description: descMatch ? descMatch[1].replace(/\\n/g, '\n') : text,
                            price: priceMatch ? priceMatch[1] : null
                        })
                    };
                }
            }
        }

        return { statusCode: 200, headers, body: JSON.stringify({ title: 'Old Penny\'s Verdict', description: text, price: null }) };

    } catch (error) {
        console.error('Function error:', error);
        return { statusCode: 200, headers, body: JSON.stringify({ title: 'Dropped It Under the Stall', description: 'Something went sideways. Have another go and I\'ll take a proper look.', error: true }) };
    }
};
