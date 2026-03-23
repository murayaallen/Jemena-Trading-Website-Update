/**
 * JEMENA TRADING LIMITED
 * AI Product Description Generator
 *
 * Generates rich, professional "uses" descriptions for all products
 * in the SQLite database using GPT-4o, then saves them back.
 *
 * Usage:
 *   node scripts/generate-descriptions.js
 *
 * Options:
 *   --dry-run      Print descriptions without saving to DB
 *   --category X   Only process products in category X
 *   --limit N      Only process first N products
 *
 * Requirements:
 *   - OPENAI_API_KEY in .env
 *   - npm install better-sqlite3 openai dotenv (already in package.json except better-sqlite3)
 */

'use strict';

require('dotenv').config();
const { OpenAI } = require('openai');
const productDb   = require('../db/products');

const isDryRun     = process.argv.includes('--dry-run');
const categoryArg  = (() => { const i = process.argv.indexOf('--category'); return i !== -1 ? process.argv[i + 1] : null; })();
const limitArg     = (() => { const i = process.argv.indexOf('--limit');    return i !== -1 ? parseInt(process.argv[i + 1]) || 999 : 999; })();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DELAY_MS    = 500;  // Rate limiting between API calls
const BATCH_SIZE  = 5;    // Products processed per log line

async function generateDescription(product) {
    const prompt =
        `Write a concise, professional 2–3 sentence description of the industrial/commercial uses of "${product.name}" ` +
        `in the context of the ${product.category} industry. ` +
        `Focus on practical applications, benefits, and industries that use it. ` +
        `Do not include pricing or company-specific information. Plain text only, no bullet points.`;

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',   // mini: fast + cheap for bulk generation
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 150,
    });

    return completion.choices[0].message.content.trim();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    let products = productDb.getAll();

    if (categoryArg) {
        products = products.filter(p => p.category.toLowerCase().includes(categoryArg.toLowerCase()));
        console.log(`Filtered to category "${categoryArg}": ${products.length} products`);
    }

    products = products.slice(0, limitArg);

    console.log(`\nGenerating descriptions for ${products.length} products${isDryRun ? ' (DRY RUN)' : ''}...\n`);

    let success = 0;
    let failed  = 0;

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const num = `[${i + 1}/${products.length}]`;

        try {
            const uses = await generateDescription(p);

            if (isDryRun) {
                console.log(`${num} ${p.name}\n    → ${uses}\n`);
            } else {
                productDb.upsert({ ...p, uses });
                if ((i + 1) % BATCH_SIZE === 0 || i === products.length - 1) {
                    console.log(`${num} Saved "${p.name}"`);
                }
            }
            success++;
        } catch (err) {
            console.error(`${num} FAILED "${p.name}": ${err.message}`);
            failed++;
        }

        // Rate limit
        if (i < products.length - 1) await sleep(DELAY_MS);
    }

    console.log(`\nDone. Success: ${success} | Failed: ${failed}`);
    if (!isDryRun && success > 0) {
        console.log('Descriptions saved to database.');
    }
}

main().catch(err => {
    console.error('Fatal error:', err.message);
    process.exit(1);
});
