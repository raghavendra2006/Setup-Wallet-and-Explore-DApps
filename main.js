/* =====================================================
   WEB3 BASICS — Main JavaScript
   Navigation, Flip Cards, Accordions, Form, Doc Gen
   ===================================================== */

// ── Navigation ──
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section, .hero');

// Scroll handler: sticky nav + active section
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Toggle scrolled class
    navbar.classList.toggle('scrolled', scrollY > 60);

    // Update active nav link
    let currentSection = '';
    sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        if (scrollY >= top) currentSection = sec.id;
    });

    navItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });

    // Scroll-to-top button
    const scrollTop = document.getElementById('scrollTop');
    scrollTop.classList.toggle('hidden', scrollY < 400);

    lastScroll = scrollY;
}, { passive: true });

// Mobile nav toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navItems.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Scroll to top
document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Intersection Observer for Animations ──
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.section-header, .concept-card, .step-card, .security-card, .glass-card, .tx-flow, .explorer-demo, .submission-form').forEach(el => {
    el.classList.add('animate-in');
    observer.observe(el);
});

// ── Flip Cards ──
document.querySelectorAll('.concept-card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});

// ── Accordion Steps ──
document.querySelectorAll('.step-card').forEach(card => {
    const header = card.querySelector('.step-header');
    header.addEventListener('click', () => {
        // Close others in same container
        const parent = card.parentElement;
        parent.querySelectorAll('.step-card.open').forEach(openCard => {
            if (openCard !== card) openCard.classList.remove('open');
        });
        card.classList.toggle('open');
    });
});

// Open first step by default in wallet section
const firstWalletStep = document.querySelector('#wallet .step-card');
if (firstWalletStep) firstWalletStep.classList.add('open');

// ── DApp Tabs ──
const dappTabs = document.querySelectorAll('.dapp-tab');
const dappPanels = document.querySelectorAll('.dapp-panel');

dappTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        dappTabs.forEach(t => t.classList.remove('active'));
        dappPanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(`panel-${target}`).classList.add('active');
    });
});

// ── Word Counter for Reflection ──
const reflectionTextarea = document.getElementById('reflection');
const wordCounter = document.getElementById('wordCounter');

if (reflectionTextarea && wordCounter) {
    reflectionTextarea.addEventListener('input', () => {
        const text = reflectionTextarea.value.trim();
        const words = text ? text.split(/\s+/).length : 0;

        wordCounter.textContent = `${words} / 300-500 words`;

        wordCounter.classList.remove('good', 'over');
        if (words >= 300 && words <= 500) {
            wordCounter.classList.add('good');
        } else if (words > 500) {
            wordCounter.classList.add('over');
        }
    });
}

// ── Submission Form ──
const generateBtn = document.getElementById('generateDoc');
const clearBtn = document.getElementById('clearForm');
const docPreview = document.getElementById('docPreview');
const docContent = document.getElementById('docContent');

if (generateBtn) {
    generateBtn.addEventListener('click', generateDocument);
}

if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        document.getElementById('submissionForm').reset();
        docPreview.classList.add('hidden');
        wordCounter.textContent = '0 / 300-500 words';
        wordCounter.classList.remove('good', 'over');
    });
}

function generateDocument() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const walletAddress = document.getElementById('walletAddress').value.trim();
    const testnetUsed = document.getElementById('testnetUsed').value;
    const dappUsed = document.getElementById('dappUsed').value.trim();
    const txHash = document.getElementById('txHash').value.trim();
    const etherscanLinks = document.getElementById('etherscanLinks').value.trim();
    const txTypes = document.getElementById('txTypes').value.trim();
    const errors = document.getElementById('errors').value.trim();
    const reflection = document.getElementById('reflection').value.trim();

    if (!firstName || !lastName) {
        alert('Please fill in your first and last name.');
        return;
    }

    const html = `
    <h1>${firstName} ${lastName} — Web3 &amp; Blockchain Basics</h1>
    <p style="color: var(--text-muted); font-size: 0.85rem;">Generated on ${new Date().toLocaleString()}</p>

    <h2>1. Documentation</h2>

    <h3>Personal Information</h3>
    <div class="doc-field">
      <span class="doc-field-label">Student Name:</span>
      <span class="doc-field-value">${firstName} ${lastName}</span>
    </div>
    <div class="doc-field">
      <span class="doc-field-label">File Name:</span>
      <span class="doc-field-value mono">${firstName}_${lastName}_Web3_Basics.pdf</span>
    </div>

    <h3>Wallet &amp; Network Information</h3>
    <div class="doc-field">
      <span class="doc-field-label">Public Wallet Address:</span>
      <span class="doc-field-value mono">${walletAddress || '[Add your wallet address]'}</span>
    </div>
    <div class="doc-field">
      <span class="doc-field-label">Testnet Used:</span>
      <span class="doc-field-value">${testnetUsed}</span>
    </div>

    <h3>Transaction Details</h3>
    <div class="doc-field">
      <span class="doc-field-label">DApp(s) Interacted With:</span>
      <span class="doc-field-value">${dappUsed || '[Add DApp names]'}</span>
    </div>
    <div class="doc-field">
      <span class="doc-field-label">Transaction Hash(es):</span>
      <span class="doc-field-value mono">${txHash ? txHash.replace(/\n/g, '<br>') : '[Add transaction hashes]'}</span>
    </div>
    <div class="doc-field">
      <span class="doc-field-label">Etherscan Link(s):</span>
      <span class="doc-field-value">${etherscanLinks ? etherscanLinks.split('\n').map(l => l.trim()).filter(Boolean).map(l => `<a href="${l}" target="_blank">${l}</a>`).join('<br>') : '[Add Etherscan links]'}</span>
    </div>
    <div class="doc-field">
      <span class="doc-field-label">Transaction Types:</span>
      <span class="doc-field-value">${txTypes || '[Add transaction types]'}</span>
    </div>

    <h3>Screenshots</h3>
    <p><em>Please insert screenshots of the following into your final PDF:</em></p>
    <ul style="padding-left: 20px; margin-bottom: 16px;">
      <li>MetaMask installation &amp; wallet creation</li>
      <li>Sepolia testnet network configuration</li>
      <li>Testnet ETH balance after faucet transfer</li>
      <li>DApp connection (e.g., Uniswap)</li>
      <li>Completed transaction details</li>
      <li>Etherscan transaction view</li>
    </ul>

    <h2>2. Written Reflection</h2>
    <div class="doc-reflection">${reflection || '[Write your 300-500 word reflection here covering:\n• Key blockchain concepts learned\n• Differences between centralized and decentralized applications\n• Smart contracts and their role in DApps\n• Security considerations with crypto wallets\n• Challenges faced and how you overcame them]'}</div>

    <h2>3. Technical Summary</h2>
    <div class="doc-field">
      <span class="doc-field-label">Testnet Used:</span>
      <span class="doc-field-value">${testnetUsed}</span>
    </div>
    <div class="doc-field">
      <span class="doc-field-label">DApp(s):</span>
      <span class="doc-field-value">${dappUsed || '[List DApps]'}</span>
    </div>
    <div class="doc-field">
      <span class="doc-field-label">Transaction Types:</span>
      <span class="doc-field-value">${txTypes || '[List transaction types]'}</span>
    </div>
    <div class="doc-field">
      <span class="doc-field-label">Errors &amp; Troubleshooting:</span>
      <span class="doc-field-value">${errors ? errors.replace(/\n/g, '<br>') : 'None encountered'}</span>
    </div>

    <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 32px 0;" />
    <p style="font-size: 0.78rem; color: var(--text-muted); text-align: center;">
      ⚠️ This document does NOT contain any private keys, seed phrases, or sensitive wallet information.<br>
      Only the public wallet address is included.
    </p>
  `;

    docContent.innerHTML = html;
    docPreview.classList.remove('hidden');
    docPreview.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Copy document
document.getElementById('copyDoc')?.addEventListener('click', () => {
    const text = docContent.innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copyDoc');
        const original = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        setTimeout(() => btn.innerHTML = original, 2000);
    });
});

// Print document
document.getElementById('printDoc')?.addEventListener('click', () => {
    const printContent = docContent.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${document.getElementById('firstName').value}_${document.getElementById('lastName').value}_Web3_Basics</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, sans-serif;
          color: #1a1a1a;
          padding: 40px;
          line-height: 1.7;
          max-width: 800px;
          margin: 0 auto;
        }
        h1 { font-size: 1.5rem; margin-bottom: 4px; color: #1a1a1a; }
        h2 { font-size: 1.15rem; margin-top: 28px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 2px solid #e5e5e5; color: #333; }
        h3 { font-size: 0.95rem; margin-top: 16px; margin-bottom: 6px; color: #555; }
        p { margin-bottom: 10px; font-size: 0.88rem; color: #444; }
        ul { padding-left: 20px; margin-bottom: 12px; }
        li { font-size: 0.85rem; padding: 2px 0; color: #444; }
        a { color: #2563eb; }
        .doc-field { display: flex; gap: 8px; padding: 5px 0; font-size: 0.88rem; }
        .doc-field-label { font-weight: 600; color: #1a1a1a; min-width: 180px; }
        .doc-field-value { color: #444; word-break: break-all; }
        .doc-field-value.mono { font-family: 'Courier New', monospace; font-size: 0.82rem; color: #2563eb; }
        .doc-reflection { background: #f5f5f5; padding: 16px; border-left: 3px solid #333; border-radius: 4px; white-space: pre-wrap; font-size: 0.88rem; line-height: 1.7; }
        hr { border: none; border-top: 1px solid #ddd; margin: 24px 0; }
        em { color: #888; }
        @media print {
          body { padding: 20px; }
        }
      </style>
    </head>
    <body>${printContent}</body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
});
